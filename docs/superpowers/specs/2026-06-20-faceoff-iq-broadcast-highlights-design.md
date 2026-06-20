# Faceoff IQ — #40 Broadcast Highlights (design)

Date: 2026-06-20 · App: `index.html` (single-file, 100% client-side, $0/clip) · Live: zenith.robcolosky.com

## Goal
A parent at a game loads a phone clip, taps their kid (#40), and gets an **ESPN-style highlight reel of his plays** — every time he touches the ball, cut together and played back with a broadcast overlay. Only the players *in play* are tracked (no sideline/crowd). Ball speed is trustworthy and surfaced as a broadcast callout.

Approved direction (user, 2026-06-20): "work on the highlights and accuracy of the ball speed running, don't worry about people on the sidelines, only the people in play, make it seem like sports entertainment like ESPN."

## Four pillars

### 1. In-play filter (drop the sidelines)
- **Green-field foot test.** During the analyze pass we already hold the frame's pixel buffer (`actx` / AW×AH). For each person detection, sample a small patch at the **feet** (bottom-center of bbox) and keep the detection only if that patch is grass/turf-green.
- **Viability gate (graceful degrade).** First measure global green fraction of the frame on a sparse grid. Only filter when the scene is actually a green field (fraction ≥ threshold); otherwise keep everyone (indoor/non-green clips behave exactly as today — no regression). Mirrors the existing "teams unclear" fallback philosophy.
- Wired into `dedupPersons()` so counts, tracking, possession, and teams are all in-play. The "Players" headline becomes in-play players.

### 2. #40 Highlight reel
- `buildHighlights(playerId)` → padded, merged possession segments for that player (from `buildPlayBreakdown().intervals`), plus any face-off he's in. Pad pre 0.8s / post 1.2s, merge gaps < 0.7s, clamp to clip. Each segment carries its peak ball speed.
- **Name-based recall:** segments are gathered for every track id whose label equals the selected player's name, so if id-swap splits #40 across fragments the user labels both "40" and the reel still catches them.
- **Reel engine** drives the existing `<video>`: intro card (~1.4s) → seek to seg 0 → play → on `currentTime ≥ seg.end` jump-cut to next seg → end. Overlay markers are drawn from cached tracks (`sampleAt` at `currentTime`), so playback is smooth with no re-detect.

### 3. ESPN broadcast overlay (`drawBroadcast()`, active during reel)
- Intro card: big `#40 · NAME`, `HIGHLIGHTS`, `N PLAYS · TOP ⚡ X MPH`.
- Spotlight: dim everyone except #40; glowing pulsing ring at his feet.
- Lower-third banner: `#40 · NAME · TEAM`.
- Shot callout: `⚡ XX MPH` chip from live ball speed; big flash when it crosses a shot threshold.
- Scorebug: possession split (when teams known) + `FACEOFF IQ` corner bug + `● ON AIR · 2/5` pill.

### 4. In-play ball speed
- `ballSpeedAt(t)` / `ballPeakBetween(t0,t1)` reuse the existing trajectory-fit + ball ceiling clamp on `S.ballTrack`.
- **In-play ball gate** in `ballAnalyzeFrame`: when ≥3 in-play players exist, reject ball candidates outside the player cluster bbox (generous margins, extra headroom upward so airborne shots survive). Kills crowd/flag motion that caused bogus speed spikes.

## Touch points in `index.html`
`S` (add `reel`, field flags) · `dedupPersons` (field filter) · `ballAnalyzeFrame` (cluster gate, receives persons) · `analyzePass` (pass persons to ball) · `loop()` (reel advance + `drawBroadcast`) · `drawPlayers` (spotlight/dim) · `pointerdown` (reel stops on tap) · `resetTrajectory`/`newClip` (reset reel) · player card (Highlights button + moments list) · new `#reelBar` DOM + CSS.

## Non-goals (v1)
Exported MP4 file (fast-follow — use iOS screen-record for now); live real-time tracking; cross-clip season profile. Honest limit: geometry-only tracking still swaps ids in scrums; name-based recall is the mitigation.

## Test
Headless Chrome CDP smoke (synthetic state): field foot-test math, `buildHighlights` segmentation/merge, ball speed helpers, reel start/advance/stop state machine, `drawBroadcast`/`drawPlayers` throw nothing, zero console exceptions. Then deploy to Pages and verify the unique build string at `zenith.robcolosky.com`.
