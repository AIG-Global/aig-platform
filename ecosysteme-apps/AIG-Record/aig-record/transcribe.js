// ============================================================
// AIG Record — transcription core.
//
// Uses OpenAI's Whisper API (api.openai.com/v1/audio/transcriptions,
// model=whisper-1, response_format=verbose_json, segment timestamps) —
// this is a real, verified endpoint shape, not guessed. Requires the
// user's own OpenAI API key, entered once and stored locally, same
// own-key pattern as the rest of the AIG app family. Claude's API does
// not do speech-to-text, which is why this is a different provider
// than the rest of the suite.
//
// Whisper caps uploads at 25MB. Rather than trying to slice an
// already-recorded file after the fact (which would need audio
// re-encoding via something like ffmpeg.wasm), this app records in
// sequential timed CHUNKS from the start — each chunk is its own
// independent, valid recording under the size limit. This file's job
// is to take each chunk's Whisper response and correctly offset its
// segment timestamps by that chunk's position in the overall
// recording, so the final merged transcript has one continuous,
// correct timeline rather than every chunk restarting at 0:00.
// ============================================================

(function () {
  "use strict";

  const WHISPER_ENDPOINT = "https://api.openai.com/v1/audio/transcriptions";

  /**
   * Transcribes a single recording chunk (a Blob) via Whisper, with
   * segment-level timestamps.
   * @returns {Promise<{language: string, duration: number, segments: Array<{start:number, end:number, text:string}>}>}
   */
  async function transcribeChunk(blob, apiKey, filename) {
    const form = new FormData();
    form.append("file", blob, filename || "audio.webm");
    form.append("model", "whisper-1");
    form.append("response_format", "verbose_json");
    form.append("timestamp_granularities[]", "segment");

    const res = await fetch(WHISPER_ENDPOINT, {
      method: "POST",
      headers: { "Authorization": "Bearer " + apiKey },
      body: form
    });

    if (!res.ok) {
      let detail = "";
      try {
        const body = await res.json();
        detail = body && body.error && body.error.message ? body.error.message : "";
      } catch (e) { /* not JSON */ }
      const statusHint = res.status === 401 ? " (check that your OpenAI API key is correct)"
        : res.status === 413 ? " (file too large — this shouldn't happen with chunking; please report this as a bug)"
        : res.status === 429 ? " (rate limit or insufficient credit — check your OpenAI billing)"
        : "";
      throw new Error("Whisper API error " + res.status + statusHint + (detail ? ": " + detail : ""));
    }
    return res.json();
  }

  /**
   * Transcribes a full ordered list of recording chunks and returns one
   * merged, correctly-offset transcript. Each chunk is transcribed
   * sequentially (not in parallel) so progress can be reported
   * meaningfully and a failure on chunk N doesn't waste API calls on
   * chunks after it.
   *
   * @param {Array<{blob: Blob, startOffsetSeconds: number}>} chunks
   * @param {string} apiKey
   * @param {(done: number, total: number) => void} onProgress
   * @returns {Promise<Array<{start:number, end:number, text:string}>>}
   */
  async function transcribeAllChunks(chunks, apiKey, onProgress) {
    const allSegments = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const result = await transcribeChunk(chunk.blob, apiKey, "chunk-" + i + ".webm");
      const offset = chunk.startOffsetSeconds;
      (result.segments || []).forEach(seg => {
        allSegments.push({ start: seg.start + offset, end: seg.end + offset, text: seg.text.trim() });
      });
      if (onProgress) onProgress(i + 1, chunks.length);
    }
    return allSegments;
  }

  function formatTimestamp(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);
    const pad = n => String(n).padStart(2, "0");
    return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
  }

  window.AIGRecordTranscribe = { transcribeChunk, transcribeAllChunks, formatTimestamp, WHISPER_ENDPOINT };
})();
