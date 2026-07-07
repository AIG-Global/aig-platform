// ============================================================
// AIG Record — main app.
//
// Records in sequential timed chunks from the start (not one long
// recording sliced afterward) so each chunk is independently a valid,
// under-25MB file ready for Whisper — see transcribe.js for why.
// ============================================================

(function () {
  "use strict";

  const KEY_STORAGE = "aigrecord_openai_key_v1";
  const CHUNK_DURATION_SECONDS = 300; // 5 minutes per chunk — conservative for staying under Whisper's 25MB cap even with video

  const state = {
    apiKey: localStorage.getItem(KEY_STORAGE) || "",
    mode: "mic",
    stream: null,
    mediaRecorder: null,
    chunks: [],              // [{blob, startOffsetSeconds}]
    currentChunkStartTime: 0,
    recordingStartTime: null,
    elapsedBeforePause: 0,
    timerInterval: null,
    chunkRotationTimeout: null,
    bookmarks: [],            // [{atSeconds, label}]
    meetingTitle: "",
    transcriptSegments: null,
    recordedAt: null,
    finalDurationSeconds: 0
  };

  const el = {};
  [
    "globalNotice", "onboardView", "onboardError", "onboardKeyInput", "onboardSaveBtn", "setKeyBtn",
    "mainView", "setupSection", "micModeCard", "screenModeCard", "meetingTitleInput", "startRecordingBtn",
    "recordingSection", "recTimer", "recStatusText", "bookmarkBtn", "stopRecordingBtn", "chunkNote", "bookmarkList",
    "transcribeSection", "recordingSummary", "transcribeBtn", "downloadRecordingBtn", "discardBtn",
    "transcribeProgressArea", "transcribeProgressLabel", "transcribeProgressFill",
    "transcriptSection", "transcriptList", "exportPdfBtn", "newRecordingBtn"
  ].forEach(id => { el[id] = document.getElementById(id); });

  function escapeHtml(s) { const d = document.createElement("div"); d.textContent = s == null ? "" : String(s); return d.innerHTML; }
  function showNotice(html) { el.globalNotice.innerHTML = html; el.globalNotice.classList.add("show"); }
  function clearNotice() { el.globalNotice.classList.remove("show"); }

  // ============================================================
  // Onboarding
  // ============================================================
  function looksLikeOpenAiKey(k) { return /^sk-/.test(k.trim()) && k.trim().length > 20; }
  function applyKeyState() {
    const hasKey = !!state.apiKey;
    el.onboardView.style.display = hasKey ? "none" : "block";
    el.mainView.style.display = hasKey ? "block" : "none";
  }
  el.onboardSaveBtn.addEventListener("click", () => {
    el.onboardError.classList.remove("show");
    const value = el.onboardKeyInput.value;
    if (!looksLikeOpenAiKey(value)) { el.onboardError.textContent = "That doesn't look like an OpenAI API key (should start with sk- and be reasonably long)."; el.onboardError.classList.add("show"); return; }
    state.apiKey = value.trim();
    localStorage.setItem(KEY_STORAGE, state.apiKey);
    applyKeyState();
  });
  el.setKeyBtn.addEventListener("click", () => {
    const newKey = prompt("OpenAI API key:", state.apiKey);
    if (newKey === null) return;
    if (!newKey.trim()) { state.apiKey = ""; localStorage.removeItem(KEY_STORAGE); applyKeyState(); return; }
    if (!looksLikeOpenAiKey(newKey)) { alert("That doesn't look like an OpenAI API key."); return; }
    state.apiKey = newKey.trim();
    localStorage.setItem(KEY_STORAGE, state.apiKey);
  });

  // ============================================================
  // Mode selection
  // ============================================================
  el.micModeCard.addEventListener("click", () => selectMode("mic"));
  el.screenModeCard.addEventListener("click", () => selectMode("screen"));
  function selectMode(mode) {
    state.mode = mode;
    el.micModeCard.classList.toggle("selected", mode === "mic");
    el.screenModeCard.classList.toggle("selected", mode === "screen");
  }

  // ============================================================
  // Recording — chunked from the start.
  // ============================================================
  el.startRecordingBtn.addEventListener("click", async () => {
    clearNotice();
    state.meetingTitle = el.meetingTitleInput.value.trim();
    try {
      if (state.mode === "mic") {
        state.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } else {
        state.stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        if (state.stream.getAudioTracks().length === 0) {
          showNotice("<b>No audio track was captured with your screen share.</b> Some systems (notably macOS without extra audio-routing software) don't support sharing system audio this way. The recording will still work, but transcription needs audio — consider \u201cMicrophone only\u201d instead if your calls play through speakers.");
        }
        state.stream.getVideoTracks()[0].addEventListener("ended", () => {
          if (state.mediaRecorder && state.mediaRecorder.state !== "inactive") stopRecording();
        });
      }
    } catch (err) {
      showNotice("<b>Couldn't start recording.</b> " + escapeHtml(err.message) + " (This can mean permission was denied, or that this browser doesn't support the requested capture mode.)");
      return;
    }

    state.chunks = [];
    state.bookmarks = [];
    state.recordingStartTime = Date.now();
    state.recordedAt = new Date();
    el.bookmarkList.innerHTML = "";
    el.setupSection.style.display = "none";
    el.recordingSection.style.display = "block";
    el.chunkNote.textContent = "Recording in " + (CHUNK_DURATION_SECONDS / 60) + "-minute segments so files stay under Whisper's upload limit.";

    startChunk(0);
    state.timerInterval = setInterval(updateTimerDisplay, 250);
  });

  function startChunk(startOffsetSeconds) {
    state.currentChunkStartTime = startOffsetSeconds;
    const recorder = new MediaRecorder(state.stream, { mimeType: pickSupportedMimeType() });
    const localChunks = [];
    recorder.ondataavailable = e => { if (e.data.size > 0) localChunks.push(e.data); };
    recorder.onstop = () => {
      const blob = new Blob(localChunks, { type: recorder.mimeType });
      state.chunks.push({ blob, startOffsetSeconds });
    };
    recorder.start();
    state.mediaRecorder = recorder;

    state.chunkRotationTimeout = setTimeout(() => {
      if (state.mediaRecorder && state.mediaRecorder.state === "recording") {
        state.mediaRecorder.stop();
        startChunk(startOffsetSeconds + CHUNK_DURATION_SECONDS);
      }
    }, CHUNK_DURATION_SECONDS * 1000);
  }

  function pickSupportedMimeType() {
    const candidates = ["video/webm;codecs=vp9,opus", "video/webm", "audio/webm;codecs=opus", "audio/webm"];
    for (const c of candidates) { if (MediaRecorder.isTypeSupported(c)) return c; }
    return "";
  }

  function currentElapsedSeconds() {
    return (Date.now() - state.recordingStartTime) / 1000;
  }

  function updateTimerDisplay() {
    el.recTimer.textContent = window.AIGRecordTranscribe.formatTimestamp(currentElapsedSeconds());
  }

  el.bookmarkBtn.addEventListener("click", () => {
    const label = prompt("Bookmark label (optional):", "");
    if (label === null) return;
    const atSeconds = currentElapsedSeconds();
    state.bookmarks.push({ atSeconds, label: label.trim() || "Bookmark" });
    renderBookmarks();
  });

  function renderBookmarks() {
    el.bookmarkList.innerHTML = state.bookmarks.map(b =>
      "<div class=\"bookmark-item\">\u2605 [" + window.AIGRecordTranscribe.formatTimestamp(b.atSeconds) + "] " + escapeHtml(b.label) + "</div>"
    ).join("");
  }

  el.stopRecordingBtn.addEventListener("click", stopRecording);

  function stopRecording() {
    clearInterval(state.timerInterval);
    clearTimeout(state.chunkRotationTimeout);
    if (state.mediaRecorder && state.mediaRecorder.state !== "inactive") state.mediaRecorder.stop();
    if (state.stream) state.stream.getTracks().forEach(t => t.stop());

    setTimeout(() => {
      el.recordingSection.style.display = "none";
      el.transcribeSection.style.display = "block";
      const totalDuration = currentElapsedSeconds();
      const totalSizeMb = state.chunks.reduce((sum, c) => sum + c.blob.size, 0) / (1024 * 1024);
      el.recordingSummary.innerHTML = "Duration: <b>" + window.AIGRecordTranscribe.formatTimestamp(totalDuration) + "</b> &middot; "
        + state.chunks.length + " chunk" + (state.chunks.length === 1 ? "" : "s") + " &middot; " + totalSizeMb.toFixed(1) + " MB total"
        + (state.bookmarks.length ? " &middot; " + state.bookmarks.length + " bookmark" + (state.bookmarks.length === 1 ? "" : "s") : "");
      state.finalDurationSeconds = totalDuration;
    }, 150);
  }

  // ============================================================
  // Transcription
  // ============================================================
  el.transcribeBtn.addEventListener("click", async () => {
    clearNotice();
    el.transcribeBtn.disabled = true;
    el.transcribeProgressArea.style.display = "block";
    el.transcribeProgressLabel.textContent = "Starting\u2026";
    el.transcribeProgressFill.style.width = "0%";

    try {
      const segments = await window.AIGRecordTranscribe.transcribeAllChunks(state.chunks, state.apiKey, (done, total) => {
        el.transcribeProgressLabel.textContent = "Transcribing chunk " + done + " of " + total + "\u2026";
        el.transcribeProgressFill.style.width = Math.round((done / total) * 100) + "%";
      });
      state.transcriptSegments = segments;
      renderTranscript();
      el.transcribeSection.style.display = "none";
      el.transcriptSection.style.display = "block";
    } catch (err) {
      showNotice("<b>Transcription failed:</b> " + escapeHtml(err.message));
    } finally {
      el.transcribeBtn.disabled = false;
    }
  });

  function renderTranscript() {
    el.transcriptList.innerHTML = state.transcriptSegments.map(seg =>
      "<div class=\"transcript-segment\"><div class=\"transcript-ts\">" + window.AIGRecordTranscribe.formatTimestamp(seg.start)
      + "</div><div class=\"transcript-text\">" + escapeHtml(seg.text) + "</div></div>"
    ).join("");
  }

  // ============================================================
  // Download raw recording
  // ============================================================
  el.downloadRecordingBtn.addEventListener("click", () => {
    const combined = new Blob(state.chunks.map(c => c.blob), { type: (state.chunks[0] && state.chunks[0].blob.type) || "video/webm" });
    const url = URL.createObjectURL(combined);
    const a = document.createElement("a");
    a.href = url;
    a.download = (state.meetingTitle || "recording") + ".webm";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  });

  el.discardBtn.addEventListener("click", () => { if (confirm("Discard this recording?")) resetToSetup(); });
  el.newRecordingBtn.addEventListener("click", resetToSetup);

  function resetToSetup() {
    state.chunks = [];
    state.bookmarks = [];
    state.transcriptSegments = null;
    el.meetingTitleInput.value = "";
    el.transcribeSection.style.display = "none";
    el.transcriptSection.style.display = "none";
    el.recordingSection.style.display = "none";
    el.setupSection.style.display = "block";
    el.transcribeProgressArea.style.display = "none";
  }

  // ============================================================
  // PDF export
  // ============================================================
  el.exportPdfBtn.addEventListener("click", async () => {
    el.exportPdfBtn.disabled = true;
    el.exportPdfBtn.textContent = "Generating PDF\u2026";
    try {
      const pdfBytes = await window.AIGRecordPdf.generateTranscriptPdf({
        title: state.meetingTitle || "Meeting Transcript",
        recordedAt: state.recordedAt,
        durationSeconds: state.finalDurationSeconds || 0,
        segments: state.transcriptSegments,
        bookmarks: state.bookmarks
      });
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = (state.meetingTitle || "transcript") + ".pdf";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (err) {
      showNotice("<b>Couldn't generate the PDF:</b> " + escapeHtml(err.message));
    } finally {
      el.exportPdfBtn.disabled = false;
      el.exportPdfBtn.textContent = "Export as PDF";
    }
  });

  // ============================================================
  // Init
  // ============================================================
  applyKeyState();
})();
