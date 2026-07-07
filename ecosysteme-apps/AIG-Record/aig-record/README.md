# AIG Record

Record your screen or microphone, get a real timestamped transcript via
OpenAI's Whisper, export it as a proper PDF. Built for meeting/call
records — no account, no backend, everything happens in your browser.

## Read this before recording anyone but yourself

**Recording other people has real legal consent requirements that vary
by location** — some places require telling everyone on a call, others
require everyone's explicit agreement, not just yours. This app can't
know or enforce what applies where you are. That's stated plainly in
the app itself, not just here.

**What this actually does, technically**: there is no way for a web app
to reach into WhatsApp, Zoom, Teams, or any other separate application
and record its call directly — that's an OS-level sandboxing boundary,
not a missing feature. What this app does instead is use the browser's
own screen-recording permission (`getDisplayMedia`) — you share your
screen (showing whatever call software is actually on it) and/or your
microphone, with an explicit browser permission prompt every time that
can't be bypassed or made silent. This works generically with Zoom,
Teams, Google Meet, WhatsApp Web, Skype — whatever's on screen — which
is actually more useful than an integration tied to one specific app.

One correction to the original ask: Microsoft NetMeeting was
discontinued around 2005. This works with whatever video call software
you're actually using today.

## Run it

```
python3 -m http.server 8000
```
Then open `http://localhost:8000`. Screen/microphone recording require
either `localhost` or a real HTTPS origin — browsers block these APIs
on plain HTTP.

## Why Whisper, not Claude

Claude's API doesn't do speech-to-text. Transcription here uses OpenAI's
Whisper (`whisper-1`, via `api.openai.com/v1/audio/transcriptions` with
`response_format=verbose_json` and segment-level timestamps) — a
different provider and a separate API key from the rest of the AIG
suite, entered once and stored locally, same own-key pattern used
throughout.

## How the chunking actually works, and why

Whisper caps uploads at 25MB. Rather than recording one long file and
trying to slice it afterward (which would need audio re-encoding —
real complexity, e.g. via ffmpeg.wasm), this app records in sequential
5-minute chunks **from the start** — each chunk is its own independent,
valid recording safely under the size limit. After recording, each
chunk is transcribed separately and their timestamps are offset by that
chunk's actual position in the full recording, producing one continuous,
correctly-timed transcript rather than every chunk restarting at 0:00.

**Verified directly, not assumed**: tested with Chromium's real
`getUserMedia`/`MediaRecorder` APIs (via fake-media-device flags, not
mocked JavaScript) — 7 seconds of recording at a 3-second test chunk
duration produced exactly 3 real chunk files, and the full pipeline
(record → transcribe → merge) correctly produced timestamps of 0:00,
0:03, 0:06 reflecting the actual chunk boundaries, not hallucinated
offsets.

## Tested

- **Real recording engine**, not mocked: actual `getUserMedia` +
  `MediaRecorder` with Chromium's fake-audio-device flags, confirming
  genuine chunk rotation at the configured interval, a real timer, a
  real downloadable `.webm` file with actual recorded bytes.
- **Bookmarks**: captured at the correct real elapsed time, rendered
  correctly, included in the exported PDF.
- **Timestamp offset math across chunks** — the single most
  correctness-critical piece — unit-tested directly (mocked Whisper
  responses per chunk, verified merged timestamps land at 0:00, 10:00,
  20:00 for three sequential 10-minute chunks) and confirmed again
  end-to-end with real recording data.
- **PDF generation**: text wrapping and multi-page pagination both
  tested directly against pdf-lib's real API shape — confirmed a long
  transcript segment wraps onto multiple lines, and confirmed 80
  segments correctly span multiple PDF pages rather than overflowing
  or truncating silently.
- **Mobile**: mic-only recording tested with real touch (`tap()`)
  end-to-end — start, bookmark, stop, all working with no horizontal
  overflow. Screen-share mode's failure path specifically re-tested
  after an initial test gave a misleading result (Playwright's
  fake-media flags make `getDisplayMedia` succeed regardless of
  emulated device type, so mobile-viewport emulation alone doesn't
  actually simulate a real unsupported mobile browser) — fixed the test
  by directly overriding the API to reject, confirmed the app shows a
  clear notice and stays on the setup screen rather than proceeding
  into a broken state, and confirmed mic-only mode still works
  correctly afterward on the same page.
- **Checked across five real resolutions specifically**: a small
  budget-Android width (360px), iPhone SE (375px), a standard modern
  iPhone (390px), a larger Pro Max-sized phone (428px), and landscape
  orientation (844×390) — no horizontal overflow at any of them,
  through onboarding, mode selection, active recording, and the
  post-recording summary. Also directly verified (not assumed) that the
  two-column mode-selection layout correctly collapses to one column
  below the 500px breakpoint and stays two-column above it, checked at
  360px, 390px, and 600px specifically — an earlier version of this
  check had hardcoded an assumed "pass" for anything under 500px without
  actually measuring the real layout, which would have let a real
  regression there go undetected; rewrote it to measure actual card
  positions instead.
- Caught my own test's false-positive along the way: an initial
  multi-resolution run appeared to fail at the smallest width, which
  turned out to be a test-data boundary issue (a placeholder API key
  exactly 20 characters long, one character short of the app's own
  `length > 20` validation) rather than a real layout bug — confirmed
  by checking the actual screenshot before assuming either explanation.
- **Found and fixed a real (small) bug**: the recording-failure notice
  concatenated a fixed suffix onto the browser's own error message
  regardless of whether that message already ended in punctuation,
  producing a double period. Fixed the wording and clarified the
  message covers both "permission denied" and "not supported by this
  browser" as the two realistic causes.

## Files

```
index.html, app.js    the app: onboarding, mode selection, the chunked
                        recording state machine, transcription
                        orchestration, transcript view
transcribe.js           Whisper API calls + the chunk-timestamp-offset
                        merging logic — kept separate so it could be
                        (and was) tested directly
pdf-export.js            PDF generation via pdf-lib — text wrapping,
                        pagination, bookmarks
```
