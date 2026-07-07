// ============================================================
// AIG Secure Sign — signer experience.
//
// Reads doc/signer/token from the URL, loads the document from the
// SAME shared localStorage store the sender's app.js writes to (see
// the note at the top of app.js about why this only works within one
// browser in this backend-less demo).
// ============================================================

(function () {
  "use strict";

  const DOCS_KEY = "aigsign_documents_v1";
  const PDFJS_VERSION = "3.11.174";

  const params = new URLSearchParams(location.search);
  const docId = params.get("doc");
  const signerId = params.get("signer");
  const token = params.get("token");

  const el = {};
  ["loadingState","errorState","errorMessage","consentState","consentDocTitle","agreeConsentBtn",
   "signingState","signingDocTitle","fieldsRemainingLabel","pageCanvasContainer","pdfCanvas","finishSigningBtn",
   "completedState","fieldModal","fieldModalTitle","closeFieldModalBtn","signatureFillArea","sigPadCanvas",
   "sigTypedInput","clearSigBtn","textFillArea","textFillInput","checkboxFillArea","checkboxFillInput","saveFieldBtn"
  ].forEach(id => { el[id] = document.getElementById(id); });

  function showState(name) {
    ["loadingState","errorState","consentState","signingState","completedState"].forEach(s => {
      document.getElementById(s).style.display = s === name ? "block" : "none";
    });
  }

  function loadAllDocuments() {
    try { return JSON.parse(localStorage.getItem(DOCS_KEY) || "[]"); }
    catch (e) { return []; }
  }
  function saveAllDocuments(docs) { localStorage.setItem(DOCS_KEY, JSON.stringify(docs)); }

  let doc = null, signer = null;

  function loadAndValidate() {
    if (!docId || !signerId || !token) {
      showError("This signing link is missing required information. Ask the sender to resend it.");
      return false;
    }
    const docs = loadAllDocuments();
    doc = docs.find(d => d.id === docId);
    if (!doc) {
      showError("This document couldn't be found. If you're opening this on a different device or browser than where it was sent from, that's expected in this demo — see the README about the backend-less limitation.");
      return false;
    }
    signer = doc.signers.find(s => s.id === signerId);
    if (!signer || signer.token !== token) {
      showError("This signing link isn't valid for this document. Ask the sender to resend it.");
      return false;
    }
    if (signer.status === "signed") {
      showState("completedState");
      return false;
    }
    return true;
  }

  function showError(msg) {
    showState("errorState");
    el.errorMessage.innerHTML = "<b>Can't open this document.</b> " + msg;
  }

  // ============================================================
  // PDF.js loading + rendering
  // ============================================================
  let pdfjsLoaded = false;
  function ensurePdfJs() {
    if (pdfjsLoaded) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.min.js`;
      script.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.js`;
        pdfjsLoaded = true;
        resolve();
      };
      script.onerror = () => reject(new Error("Couldn't load the PDF rendering library."));
      document.head.appendChild(script);
    });
  }

  async function renderPdf() {
    await ensurePdfJs();
    const base64 = doc.pdfDataUrl.split(",")[1];
    const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    const pdf = await window.pdfjsLib.getDocument({ data: bytes }).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1.5 });
    el.pdfCanvas.width = viewport.width;
    el.pdfCanvas.height = viewport.height;
    el.pageCanvasContainer.style.width = viewport.width + "px";
    await page.render({ canvasContext: el.pdfCanvas.getContext("2d"), viewport }).promise;
    renderFields();
  }

  function myFields() { return doc.fields.filter(f => f.assignedSignerId === signerId); }

  function renderFields() {
    el.pageCanvasContainer.querySelectorAll(".fillable-field").forEach(f => f.remove());
    const rect = el.pageCanvasContainer.getBoundingClientRect();
    myFields().forEach(f => {
      const div = document.createElement("div");
      div.className = "fillable-field" + (f.value ? " filled" : "");
      div.style.left = (f.xPct * rect.width) + "px";
      div.style.top = (f.yPct * rect.height) + "px";
      div.style.width = (f.wPct * rect.width) + "px";
      div.style.height = (f.hPct * rect.height) + "px";

      if (f.value && f.type === "signature") {
        const img = document.createElement("img");
        img.src = f.value;
        div.appendChild(img);
      } else if (f.value && f.type === "checkbox") {
        div.textContent = "\u2713";
      } else if (f.value) {
        div.textContent = f.value;
      } else {
        const labels = { signature: "Click to sign", initial: "Click to initial", date: "Click for date", text: "Click to fill", checkbox: "Click to check" };
        div.textContent = labels[f.type] || "Click to fill";
      }

      div.addEventListener("click", () => openFieldModal(f.id));
      el.pageCanvasContainer.appendChild(div);
    });
    updateProgress();
  }

  function updateProgress() {
    const fields = myFields();
    const filled = fields.filter(f => f.value).length;
    el.fieldsRemainingLabel.textContent = filled + " / " + fields.length + " fields completed";
    el.finishSigningBtn.disabled = filled < fields.length;
    el.finishSigningBtn.textContent = filled < fields.length ? "Complete all fields to finish signing" : "Complete signing";
  }

  // ============================================================
  // Field fill modal
  // ============================================================
  let activeFieldId = null;
  let sigMode = "draw";
  let sigDrawing = false;
  let sigHasContent = false;
  let sigCtx = null;

  function openFieldModal(fieldId) {
    activeFieldId = fieldId;
    const field = doc.fields.find(f => f.id === fieldId);
    el.signatureFillArea.style.display = "none";
    el.textFillArea.style.display = "none";
    el.checkboxFillArea.style.display = "none";

    if (field.type === "signature" || field.type === "initial") {
      el.fieldModalTitle.textContent = field.type === "signature" ? "Sign here" : "Initial here";
      el.signatureFillArea.style.display = "block";
      setupSigPad();
    } else if (field.type === "date") {
      el.fieldModalTitle.textContent = "Confirm date";
      el.textFillArea.style.display = "block";
      el.textFillInput.value = new Date().toLocaleDateString();
      el.textFillInput.readOnly = true;
    } else if (field.type === "text") {
      el.fieldModalTitle.textContent = "Enter text";
      el.textFillArea.style.display = "block";
      el.textFillInput.readOnly = false;
      el.textFillInput.value = field.value || "";
    } else if (field.type === "checkbox") {
      el.fieldModalTitle.textContent = "Confirm";
      el.checkboxFillArea.style.display = "block";
      el.checkboxFillInput.checked = !!field.value;
    }
    el.fieldModal.classList.add("show");
  }
  el.closeFieldModalBtn.addEventListener("click", () => el.fieldModal.classList.remove("show"));

  function setupSigPad() {
    sigMode = "draw";
    sigHasContent = false;
    document.querySelectorAll(".sig-pad-tab").forEach(t => t.classList.toggle("active", t.getAttribute("data-mode") === "draw"));
    el.sigPadCanvas.style.display = "block";
    el.sigTypedInput.style.display = "none";

    const canvas = el.sigPadCanvas;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    sigCtx = canvas.getContext("2d");
    sigCtx.scale(2, 2);
    sigCtx.fillStyle = "#fff";
    sigCtx.fillRect(0, 0, rect.width, rect.height);
    sigCtx.strokeStyle = "#1a1a2e";
    sigCtx.lineWidth = 2.2;
    sigCtx.lineCap = "round";
  }

  function sigPointerPos(e) {
    const rect = el.sigPadCanvas.getBoundingClientRect();
    const point = e.touches && e.touches.length ? e.touches[0] : e;
    return { x: point.clientX - rect.left, y: point.clientY - rect.top };
  }
  function sigStart(e) {
    if (e.cancelable) e.preventDefault();
    sigDrawing = true;
    sigHasContent = true;
    const p = sigPointerPos(e);
    sigCtx.beginPath();
    sigCtx.moveTo(p.x, p.y);
  }
  function sigMove(e) {
    if (!sigDrawing) return;
    if (e.cancelable) e.preventDefault();
    const p = sigPointerPos(e);
    sigCtx.lineTo(p.x, p.y);
    sigCtx.stroke();
  }
  function sigEnd() { sigDrawing = false; }
  el.sigPadCanvas.addEventListener("mousedown", sigStart);
  el.sigPadCanvas.addEventListener("mousemove", sigMove);
  el.sigPadCanvas.addEventListener("mouseup", sigEnd);
  el.sigPadCanvas.addEventListener("touchstart", sigStart, { passive: false });
  el.sigPadCanvas.addEventListener("touchmove", sigMove, { passive: false });
  el.sigPadCanvas.addEventListener("touchend", sigEnd);

  document.querySelectorAll(".sig-pad-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      sigMode = tab.getAttribute("data-mode");
      document.querySelectorAll(".sig-pad-tab").forEach(t => t.classList.toggle("active", t === tab));
      el.sigPadCanvas.style.display = sigMode === "draw" ? "block" : "none";
      el.sigTypedInput.style.display = sigMode === "type" ? "block" : "none";
    });
  });
  el.clearSigBtn.addEventListener("click", () => {
    if (sigMode === "draw") setupSigPad();
    else el.sigTypedInput.value = "";
  });

  el.saveFieldBtn.addEventListener("click", () => {
    const field = doc.fields.find(f => f.id === activeFieldId);
    if (field.type === "signature" || field.type === "initial") {
      if (sigMode === "draw") {
        if (!sigHasContent) { alert("Please draw your " + field.type + " first."); return; }
        field.value = el.sigPadCanvas.toDataURL("image/png");
      } else {
        if (!el.sigTypedInput.value.trim()) { alert("Please type your name."); return; }
        field.value = renderTypedSignatureToDataUrl(el.sigTypedInput.value.trim());
      }
    } else if (field.type === "text") {
      if (!el.textFillInput.value.trim()) { alert("Please enter a value."); return; }
      field.value = el.textFillInput.value.trim();
    } else if (field.type === "date") {
      field.value = el.textFillInput.value;
    } else if (field.type === "checkbox") {
      field.value = el.checkboxFillInput.checked ? "checked" : null;
      if (!field.value) { alert("Please check the box to confirm."); return; }
    }
    el.fieldModal.classList.remove("show");
    persistDoc();
    renderFields();
  });

  function renderTypedSignatureToDataUrl(text) {
    const canvas = document.createElement("canvas");
    canvas.width = 400; canvas.height = 120;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#1a1a2e";
    ctx.font = "48px 'Brush Script MT', cursive";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    return canvas.toDataURL("image/png");
  }

  function persistDoc() {
    const docs = loadAllDocuments();
    const idx = docs.findIndex(d => d.id === doc.id);
    if (idx >= 0) docs[idx] = doc;
    saveAllDocuments(docs);
  }

  // ============================================================
  // Consent + completion
  // ============================================================
  el.agreeConsentBtn.addEventListener("click", async () => {
    signer.status = "viewed";
    signer.consentGivenAt = new Date().toISOString();

    let ip = null;
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      if (res.ok) ip = (await res.json()).ip;
    } catch (e) { /* best-effort only; server-side capture from request headers is the reliable real-world approach */ }
    signer.ipNote = ip;

    await window.AIGSignCrypto.appendAuditEvent(doc.auditChain, {
      action: "consent_given", actor: signer.email, ip: ip || "not captured", userAgent: navigator.userAgent
    });
    persistDoc();

    el.signingDocTitle.textContent = doc.title || "Untitled document";
    showState("signingState");
    await renderPdf();
  });

  el.finishSigningBtn.addEventListener("click", async () => {
    signer.status = "signed";
    signer.signedAt = new Date().toISOString();

    await window.AIGSignCrypto.appendAuditEvent(doc.auditChain, {
      action: "document_signed", actor: signer.email, fieldsCompleted: myFields().length
    });

    if (doc.signers.every(s => s.status === "signed")) {
      doc.status = "completed";
      doc.completedAt = new Date().toISOString();
      await window.AIGSignCrypto.appendAuditEvent(doc.auditChain, { action: "document_completed", actor: "system" });
    } else {
      doc.status = "partially_signed";
    }

    persistDoc();
    showState("completedState");
  });

  // ============================================================
  // Init
  // ============================================================
  if (loadAndValidate()) {
    el.consentDocTitle.textContent = doc.title || "Untitled document";
    showState("consentState");
  }
})();
