# Detection reality check + the validation decision

Date: 2026-06-22 · Build: `hl-r` (zenith.robcolosky.com)

## What we set out to brainstorm
"Far/wide footage gives no stats — how do we detect tiny distant players on a phone, $0, client-side?"

## What the real data showed (premise was wrong)
Ran the actual analyzer (headless rig, `/tmp/zenith_real.mjs`) against the user's real clips for the first time:

| metric | Close (IMG_0898) | Far (IMG_3435, 720p) |
|---|---|---|
| players detected (best frame) | 4 | 5 |
| detected player height | 26% of frame | 30% of frame |
| ball frames tracked | 196 | 213 |
| stats produced | ✅ peak 9 mph, calibrated | ✅ peak 6 mph, calibrated |
| exceptions | 0 | 0 |

**The far clip detects as well as (slightly better than) the close one.** Reason: the phone is **portrait**, the clip is **landscape**, so the app's cover-scaling **crops to the center** of the frame — effectively zooming into the action and making center players big enough for COCO-SSD-lite. The "tiny distant players" fear doesn't hold for the central action a parent cares about.

## Corrected root cause of "no stats"
It was the **play-vs-Analyze button** confusion (user tapped ▶ preview instead of the green Analyze), already fixed in `hl-r` (prominent pulsing "▸ Analyze Clip", ▶ relabeled "preview", clean result summary, honest "no players tracked — film larger" message). **Not** a detection failure.

## The honest remaining limit
Detection is **sparse** — reliably ~1–5 players per frame, not all ~15 on the field. Enough for a **single-kid reel** (tap your kid in the central action); the kid may track a little choppily. Improving density (higher analyze res / lower threshold / tiling) is **marginal CV tuning** and was explicitly deferred.

## Decision (user, 2026-06-22): GO VALIDATE, don't tune
The app produces stats + reels on real footage. The make-or-break question is unchanged from the platform blueprint: **do parents voluntarily share the output?** Tuning detection before that signal is premature.

## The field-test playbook
- **Who:** 3–5 *other* parents at the next game (strangers, not just the builder).
- **Flow per parent:** open `zenith.robcolosky.com` → Load Clip (their kid, a play that's reasonably centered) → tap the green **▸ Analyze Clip** → tap their kid → name → **▶ Make Reel** → the slow-mo ending + stat card → **⤓ Save / Share**.
- **The one metric:** did they, *unprompted*, want to send/share it? **Gate: ≥30%** → green light to build the platform layer. <30% → the emotional-payoff thesis needs rework, cheaply, before more build.
- **Also note:** where each parent gets stuck (UX friction to fix) and whether the slow-mo ending gets a "whoa."

## Next (only after the field signal)
If validated: the snap-in platform layer (accounts, persistent gallery, the cloud TTS announcer voice in the export). If not: revisit the artifact, not the detector.
