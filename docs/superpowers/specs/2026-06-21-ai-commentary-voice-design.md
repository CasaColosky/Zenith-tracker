# AI Commentary Voice (design + shipped)

Date: 2026-06-21 · App: `index.html` · Shipped: build `hl-o`, live at zenith.robcolosky.com

## Goal
"AI flare on real footage" — make the highlight reel feel like a broadcast by **speaking** the recap, without ever touching the real play. Governing principle: **the game is real; the broadcast around it (intro, voice, graphics, music) can be AI.**

## Decision (locked by user "make this happen")
v1 = **live, on-device commentary** via the browser Web Speech API. When a reel plays, it speaks the Claude-written broadcast recap (already produced by the narrator) in an energetic voice. Free, instant, no new keys/backend, reads only the real stats.

## Why Web Speech (not cloud TTS) for v1
- **$0, instant, no new API key** (the Anthropic key can't do TTS; cloud TTS = OpenAI/ElevenLabs/Google = new key + credits).
- The Claude recap line already exists from the narrator.
- HONEST LIMIT, accepted for v1: **Web Speech audio cannot be captured into the MediaRecorder export** (it plays to the speakers, not routable into a MediaStream). So the *saved MP4 won't carry the voice yet.* The live in-app reel proves the feel.

## Implementation
- `S._recap` captured in `renderBreakdown` when `narrate()` resolves (Claude line or local fallback).
- `reelLine()` = `S._recap` || an honest stat line built from the selected player's stats.
- `speakReel()` (called INSIDE the Make-Reel tap so iOS permits speechSynthesis): `cancel()` then `speak()` a `SpeechSynthesisUtterance` (rate 1.06), preferring an en-US natural/cloud voice via `pickCommentaryVoice()`.
- Hooked into `startReel` + `buildReelFor` (go); `stopReelVoice()` on `endReel` + `stopReelQuiet`.
- `🔊 Voice` toggle in the reel options (`S.reelVoice`, default on); off cancels speech.
- Fully guarded (`'speechSynthesis' in window`, try/catch) — can't break the reel.

## Honest limits / next step
- iOS Safari `speechSynthesis` is historically flaky (gesture-gated, can be silent/cut off) — verify on a real iPhone.
- **The export-voice upgrade (v2):** cloud TTS (OpenAI/ElevenLabs) via the existing Worker pattern → fetch audio → play through the existing `_audioDest` AudioContext graph so it's **captured into the saved mp4** alongside game audio. Needs a TTS API key. This is the path to a shareable clip that *talks*.

## Non-goals
Play-by-play timed per moment (v1 is one recap line); any AI that alters/invents the play (the cliff).
