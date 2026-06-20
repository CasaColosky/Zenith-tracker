# Faceoff IQ — Snap-In Platform Blueprint (red-teamed)

Date: 2026-06-20 · Source: multi-agent design + adversarial red-team, grounded in `index.html` + `docs/FACEOFF_IQ_PLAN.md`.

## Vision
Every youth-sports parent gets a genuinely shareable pride artifact — a **pick-your-kid highlight reel with a broadcast overlay** — from the phone in their hand TODAY, and the experience deepens automatically as better cameras snap in underneath it. The lock-in is **two architectural decisions, not a feature**: (1) **jersey number** (supplied by a human now, OCR later) is the cross-tier identity key so CV id-instability never strands a stat; (2) **one `game_ms` timeline** so multi-cam is always a fill-in. Tier 1 sells the reel, not fake CV stats; real numbers/spatial/machine-identity arrive honestly at Tier 3.

## The decisive findings (what the red-team overturned)
1. **Identity must come from a human-tapped jersey number, NOT a CV track id.** Tracks reset every analysis (`nextTrackId=1`), cap at 12 live / 60 archived, die after 6 coasted frames — one player becomes 3–5 ephemeral ids per clip, zero carry across clips. So **do not freeze a GameFeed "1.0" that canonizes temp-id garbage.** CV ids are *evidence* (clip_id + bbox), never identity.
2. **Tier-1 "broadcast" is hollow if sold as CV stats.** No goal detector exists; the scorebug shows possession %, not score; the lower-third shows `P7` unless a human labeled it; speed needs scale and self-flags `scaleLikelyWrong`. **The honest Tier-1 wow is the one-tap pick-your-kid auto-cut reel with the name the PARENT typed.**
3. **Validate before plumbing.** Put live `zenith.robcolosky.com` in 5–10 parents' hands at one tournament; measure ONE number — did ≥30% voluntarily **share** the reel to a group chat? Gate all platform build on that. Everything else is speculative until it passes.
4. **Incumbents are NOW** (GameChanger free + DICK'S-owned, Veo, Trace already do consumer "broadcast"). The wedge is a **12–18 month window to be lacrosse-native fast**, not a durable moat. Flip the funnel: free single-parent pick-kid+reel+share tool is the wedge; the $299 coach console is the expansion.
5. **Capability manifest, not a 13-stat vocabulary.** The phone honestly emits possession intervals, pass count, faceoff-*candidate* (won=null), per-player touches/speed. Everything else is "not-captured-at-this-tier" (distinct from "low confidence").

## The next move (decided)
Make the **one-tap "pick your kid"** real so the validation test is real (~1 day, $0, no contract): tap the kid → type their name/number → the existing reel auto-cuts T-12s..T+5s around their touches with spotlight + lower-third showing the **typed** name → a shareable pride artifact. Do NOT start with "serialize `S.*` and POST it." Write GameFeed as a one-page doc + nullable forward-fields; build the serializer the week a SECOND capture source (a cheap GoPro, Tier-1.5) exists.

## Capture-tier ladder
- **Tier 1 — single phone ($0, today):** a manual-stat tool with a CV-powered HIGHLIGHT. Pick-your-kid reel + broadcast overlay; possession%/passes/faceoff-candidate/touches/speed as evidence. No goal/shot/save/turnover detector — those are manual-only.
- **Tier 1.5 — phone + one fixed GoPro (~$150):** ~60–70% of Tier-3 benefit; stable elevated `is_official` angle; **first moment the GameFeed serializer earns its keep.** Manual offset sync first.
- **Tier 2 — multi-phone (~$0):** 2–6 sideline phones on one `game_ms`; angle-switcher; multi-angle corpus collected (fusion deferred).
- **Tier 3 — fixed/elevated cam + server AI ($300–800 hw):** homography → real heat maps/shot-location; jersey-number **OCR** → IdentityResolution (a real-number→roster join); homography speed; ~85–90% goal detection. **First tier where machine identity, real spatial, and real speed exist.**
- **Tier 4 — multi-cam/360 + full server AI ($2–5k hw, $15–30/game):** auto event detection, cross-angle re-ID, burned-in broadcast video + LLM narration, AI coaching drafts — all human-confirmed.

## Phases
- **Phase -1 (this weekend):** validate the wow — one-tap pick-kid + reel; ≥30% voluntary share gate.
- **Phase 0 (this month, only if -1 passes):** lock identity-source (human jersey number; CV→evidence) + `game_timeline` segment model; capability manifest; GameFeed as a one-page doc + nullable forward-fields; store raw analysis as a versioned ARTIFACT. **No serializer/blob/read-path yet.**
- **Phase 1 (8–12 wks):** FREE Expo app: pick-kid + auto-cut reel + share (identity by tap); separate opt-in one-thumb 9-stat tagging (faceoff won/technique = manual); My-Kid card; Broadcast Mode; manual-goal-fed scorebug; embedded ZENITH analyzer (Beta).
- **Phase 2:** multi-phone + cheap GoPro — build the GameFeed serializer/ingest/read-path HERE; manual offset sync first; paid coach console ($299/season).
- **Phase 3:** fixed cam + first server AI — homography, OCR identity, real speed.
- **Phase 4:** multi-cam/360 + full server AI — trained YOLO/ByteTrack + re-ID on collected corrections.

## Data contract (one-page, write don't build yet)
`StatEvent`: id, game_id, **t_ms on monotonic game_ms**, type, **player_id = roster jersey number a human tapped (or OCR at Tier 3)**, source (manual|ai_suggested|ai_confirmed), confidence (numeric, required iff ai), detail jsonb, **evidence jsonb (artifact_id+track_id+bbox — CV is evidence, never identity)**, clip_id, device_id+client_seq. Plus `GameTimeline` (segments[] with media-range + offset onto game_ms), `BallEntity` (track in normalized 0–1 image space + `scale_source` ∈ {manual_ppm, auto_player_height, homography}), `IdentityResolution` (Tier-3 OCR→roster), `FieldRegistration` (NULL until Tier 3), `VideoAsset` (angle, is_official, offset_ms, drift_ppm), `AnalysisArtifact` (versioned raw capture, separate from editable stat_events; provenance pointer on every row). Three rules: provenance on every row; t_ms always on game_ms via the segment model; identity = human/OCR jersey number.

## Biggest risks
Identity-source (#1) · Tier-1 wow hollow on gated CV (sell the reel, not fake stats) · scale incomparability across tiers · incumbents now · wedge-user (FOGO parent) ≠ wedge-buyer (coach) · the "data moat" is circular (good labels only arrive at Tier 3 nobody reaches). **Mitigation through-line: ship the free pick-kid reel, validate the share, and only platformize once a second camera exists.**
