# Faceoff IQ — Product Plan

> Phone-first lacrosse stat + video app → full AI video-analytics platform for parents, players, and coaches.
> Built on the working ZENITH engine (zenith.robcolosky.com) — in-browser player/ball tracking, team clustering, play breakdown.
> Status: DRAFT v1 · 2026-06-10

## 1. Product Requirements Document (PRD)

### One-line pitch
**Faceoff IQ turns a parent's phone into a lacrosse stat crew and film room** — record, tag, and understand every faceoff, goal, and ground ball, with an AI engine (born from the working ZENITH prototype) that grows from clip analysis today into full game breakdowns tomorrow.

### Problem
Youth and HS lacrosse stats are a mess: a parent with a paper sheet, a coach reconstructing the game from memory, and 40 minutes of shaky phone video nobody ever watches. Hudl-class tools are priced and designed for football programs, not a U13 club team. Faceoff specialists — the most stat-hungry players in the sport — have *no* dedicated tool tracking FO%, clamp vs. counter tendencies, or wing-ball outcomes. The video exists (every sideline has six phones pointed at the field); the structure doesn't.

### Who it's for
- **Parent (primary buyer/recorder):** The sideline parent who already films every game and wants their kid's FO%, GBs, and goals in a profile they can actually show — plus a highlight clip for the group chat and recruiting.
- **Coach (primary retainer):** A volunteer or part-time club/HS coach who needs team stats, faceoff analytics, and film review without a Hudl budget or a stats intern.
- **Player (the reason both stay):** A middle/high-school player — especially a FOGO — who checks their own dashboard, watches their clips, and tracks progress across the season.

### Why now
1. On-device CV is finally good enough and free: ZENITH already proves player detection, ball tracking, possession/faceoff heuristics, and speed estimation run **100% client-side at $0/clip** in a browser tab.
2. Every game is already filmed — by multiple phones — and that footage is stranded in camera rolls.
3. Lacrosse is the fastest-growing US team sport with no down-market video-analytics incumbent; Hudl's pricing leaves the entire club/youth tier open.
4. The founder has shipped the hard part (the CV engine) before writing a line of app code. The risk left is product packaging, not science.

### Goals
1. Make manual stat tagging during a live game faster than a paper sheet (one-thumb tagging, < 3 seconds per event).
2. Make every tagged stat optionally video-backed: a stat is a timestamp into film.
3. Ship the ZENITH analyzer as an in-app "AI assist" so the product has a wow moment from day one — clearly labeled beta, never blocking the manual workflow.
4. Own the faceoff niche: FO%, clamp/counter outcomes, wing GBs — depth no general tool offers.
5. Keep marginal cost per game near zero (client-side compute, Cloudflare R2 storage, edge workers).

### Non-goals (MVP — explicit)
- **No live streaming.** This is record-then-review, not broadcast.
- **No automatic stats at launch.** AI assists review; humans tag stats. Auto-stats are Phase 4.
- **No multi-angle sync** (Phase 2), **no external/mounted cameras** (Phase 3).
- No scheduling, messaging, payments, or team-ops features — we are not TeamSnap.
- No leagues/tournaments admin layer; the unit is a single team.
- No Android-first polish: iOS (Expo) first, web fallback for everyone else.

### Core user stories

**Parent**
1. As a parent, I record my kid's game from my phone and the video lands in the team's game automatically.
2. As a parent, I tag my son's faceoffs (win/loss, clamp or counter) live with one thumb so I can finally answer "what's his FO% this season?"
3. As a parent, I open my kid's profile and see game, season, and faceoff stats with the clips behind each number.
4. As a parent, I share a highlight clip with a stat overlay card to the family group chat in two taps.
5. As a parent, I see coach feedback and a progress report so I know what my kid is working on.

**Coach**
1. As a coach, I set up my roster once and assign jersey numbers so anyone tagging stats picks players, not names from memory.
2. As a coach, I review the game summary postgame — score flow, FO%, GBs, clears, turnovers — without having kept a sheet myself.
3. As a coach, I open game film, jump straight to every tagged event (all faceoffs, all turnovers), and add a coaching note on a clip.
4. As a coach, I compare my two FOGOs' FO% and clamp-vs-counter splits to decide who takes the X on Saturday.
5. As a coach, I approve which parent-submitted video becomes the official film for a game (Phase 2 readiness baked into the data model from day one).

**Player**
1. As a player, I log in and see my own dashboard — goals, assists, GBs, FO% — updated after every game.
2. As a FOGO, I see my faceoff splits (clamp vs. counter, FO% by game) and how they trend over the season.
3. As a player, I watch my tagged clips and the AI-assisted breakdown of my speed and possessions on a clip.
4. As a player, I read my coach's notes and development recommendations in one place.
5. As a player, I build a season highlight reel from my tagged clips for recruiting.

### Success metrics
| Metric | Definition | Target (first season) |
|---|---|---|
| **Activation** | New team logs a full game (roster + ≥ 15 tagged events) within 7 days of signup | ≥ 50% |
| **Weekly games logged** | Games with ≥ 15 tagged events per active team per week | ≥ 1.0 (in-season) |
| **Clips tagged per game** | Stat events linked to a video timestamp | ≥ 10 |
| **Parent WAU** | Parents opening a profile/clip weekly | ≥ 40% of registered parents in-season |
| **Coach retention** | Coaches logging games 6+ weeks after first game | ≥ 60% |
| **AI-assist usage** | Games where the ZENITH analyzer is run on ≥ 1 clip | ≥ 30% (leading indicator for Phase 4 demand) |

### Key risks & mitigations
| Risk | Why it bites | Mitigation |
|---|---|---|
| **Chicken-and-egg team adoption** | Parents won't tag into an empty team; coaches won't adopt an app with no parents | Single-parent mode is fully useful solo (my kid, my stats, my clips). Team features layer on top; a parent can invite the coach, not only the reverse. Land via FOGO families — the most motivated niche. |
| **Video storage cost** | A season of 1080p game film per team destroys a free-tier budget | Clips, not games: upload tagged 10–30s clips by default; full game video stays on-device/iCloud in Phase 1. R2 has zero egress fees; transcode to 720p clips client-side before upload. Storage caps per team until paid tiers exist. |
| **AI accuracy expectations** | One bad auto-call ("that wasn't a goal") torches trust in the whole product | AI is *assistive and labeled beta*: it suggests, humans confirm. Manual tagging is the source of truth through Phase 3. Confidence thresholds tuned for precision over recall; every AI suggestion is one-tap dismissible. |
| **Privacy / minors** | Video of children + names + stats = COPPA/CIPA exposure and parent backlash | Parent-managed player profiles (no direct child accounts under 13); video private to team by default; explicit per-clip consent to share publicly; signed URLs on R2, no public buckets; data deletion on request from day one. |
| **Solo-founder bandwidth** | Scope creep kills the season window (spring season is the deadline) | Hard MVP cut-line (§2), phases gated on exit criteria (§3), reuse of existing stack (Expo, Next.js/tRPC, Cloudflare) — zero new infrastructure to learn. |

---

## 2. MVP Scope (Phase 1, phone-only)

### IN — feature list with acceptance criteria

| # | Feature | Acceptance criteria (1 line) |
|---|---|---|
| 1 | **Record / import video** | User records in-app or imports from camera roll; video is attached to a game and scrubbable within 5s of import. |
| 2 | **Game creation** | Coach or parent creates a game (opponent, date, home/away) in < 30s; games list shows score and tagged-event count. |
| 3 | **Manual stat tagging — 9 core stats** | One-thumb live tagging of **goals, assists, ground balls (GB), shots, saves, clears, turnovers, penalties, faceoffs**, each attributed to a rostered player in ≤ 3 taps, with undo. |
| 4 | **Faceoff detail** | Every faceoff event captures **win/loss** plus technique (**clamp / counter / other**) and optional wing-GB credit; FO% computes per game and season. |
| 5 | **Clip tagging** | Any stat event tagged during/against video gets a timestamp; tapping the stat jumps to T-minus-5s in the clip; events tagged live can be linked to video afterward. |
| 6 | **Player profiles** | Each rostered player has a profile showing per-game and season totals for all 9 stats, FO% with clamp/counter split, and their clip reel. |
| 7 | **Parent + player login** | Parent signs up, joins a team via invite code, and is linked to ≥ 1 player; sees only their team's content. Players 13+ get an optional read-only login (player role) onto the same parent-app views, scoped to themselves. |
| 8 | **Coach login + minimal console** | Coach role can create/edit roster and games and add coaching notes — in-app and via a minimal web console (roster, game summaries, AI-suggestion lane over uploaded clips); role enforced server-side. Upload approval is Phase 2 (the `approved_by` field ships in the data model from day one). |
| 9 | **Game summary** | Auto-generated postgame view: final score, team FO%, GB count, shots, turnovers, penalties, per-player lines — shareable as an image card (reusing ZENITH's share-card export). |
| 10 | **Progress report** | Per-player season trend view (stat-by-game sparkline + plain-English recap via the ZENITH narrator seam — the local template narrator ships in v1; the Cloudflare Worker LLM is a post-MVP prose upgrade). |
| 11 | **AI-assisted review (ZENITH embedded)** | From any clip, "Analyze with AI" runs the ZENITH engine client-side (player detection, ball tracking, possession %, speed, faceoff heuristic) and renders its stat cards + recap in-app, labeled **Beta**, in ≤ 2× clip duration on a modern phone (bar validated by the week-1 WebView benchmark spike; fallback if mobile perf misses: upload the clip and analyze it in the web console). |

### OUT — deferred (and which phase picks it up)
| Deferred feature | Picked up in |
|---|---|
| Multi-phone same-game recording, clip-to-game association, official-feed approval workflow | **Phase 2** |
| Cross-angle AI comparison | **Phase 4** (Phase 2 only collects sibling-angle clips as the multi-view corpus) |
| GoPro / Mevo / Hudl-Focus-style / RTSP-IP camera ingest; designated main sideline camera | **Phase 3** |
| Full-game AI processing: auto-detected possessions, shots, goals, faceoffs, GBs, clears, rides, turnovers, penalties | **Phase 4** |
| Stat overlays rendered onto video; auto-generated player highlight reels | **Phase 4** (carve-out: a simple client-side caption/score-bug overlay on 17s share clips ships in Phase 2) |
| Heat maps, possession charts, player comparison views, development recommendations (full coach console) | **Phase 3–4** (a minimal coach console — roster, game summaries, AI-suggestion lane over uploaded clips — ships in Phase 1; film review + approvals grow in Phase 2) |
| EMO / man-down situational tagging and splits | **Phase 2** (pure data-model addition once core tagging is proven) |
| Live streaming | **Never** (explicit non-goal) |
| Payments / paid tiers | After Phase 2 retention proof |

### MVP cut-line rationale — why this ships in 8–12 weeks solo
1. **The hardest component already exists and is live.** Feature #11 is an embed of ZENITH (zenith.robcolosly.com) — proven TF.js/COCO-SSD pipeline, SORT-style tracking, team clustering, recap narrator, share cards. The port is a WebView/web-embed plus a postMessage bridge — but ZENITH's perf was proven in a desktop browser, so **week 1 is a spike** that benchmarks TF.js inference and camera-roll-video piping through the WebView bridge on a real phone; if it misses the ≤ 2× clip-duration bar, the documented fallback is "upload the clip, analyze it in the coach console" on desktop, where the engine is already proven.
2. **Everything else is CRUD + video playback** on a stack the founder has shipped twice: Expo (tesla-sounds) for the mobile app, Next.js on Cloudflare Pages (casa-os muscle memory) for the coach console, Cloudflare Workers + Hono with a typed client for the API, Neon Postgres + Drizzle for the database, Clerk for auth, and Cloudflare R2 for clip storage (§10) — zero new infrastructure, near-zero fixed cost.
3. **Manual tagging is the trust anchor.** By making humans the source of truth, the MVP needs no model accuracy bar to be useful — the AI is a delighter, not a dependency, which removes the single biggest schedule risk.
4. **Clips-not-games storage** keeps R2 usage in free/cheap territory for the entire beta, deferring all monetization pressure.
5. **One niche, one wedge:** faceoff depth (FO%, clamp/counter) is small to build but creates a user — the FOGO family — who has literally no alternative and will evangelize to the team. That's the Phase 2 adoption engine.

Rough sequencing: week 1 ZENITH WebView benchmark spike alongside project setup; weeks 1–3 auth/roster/games/tagging; weeks 4–6 video import + clip linking + profiles; weeks 7–8 summaries, progress reports, ZENITH embed (or console fallback); weeks 9–12 polish, TestFlight beta with 3 real teams during the season.

---

## 3. Phase Roadmap (1 → 4)

### Phase 1 — Phone-only MVP: "the stat sheet that's also a film room"
- **Goal:** One phone replaces the paper stat sheet and makes the footage useful — record, tag the 9 core stats (with faceoff clamp/counter depth), see profiles and summaries.
- **Headline features:** In-app/camera-roll video per game; one-thumb manual tagging; clip-linked stats; player dashboards; parent + coach logins; game summary share cards; season progress reports; embedded ZENITH clip analyzer (Beta).
- **What unlocks it:** Nothing external — ZENITH exists, the stack is known. Adoption precondition: 3 friendly beta teams recruited before the season window.
- **Exit criteria:** 3 teams each logging ≥ 1 game/week for 4 consecutive weeks; ≥ 10 clip-linked stats per game; ≥ 1 parent per team active besides the tagger; coach retention ≥ 60% at week 6.
- **Rough effort:** 8–12 weeks solo.
- **Primary risk:** Tagging UX too slow on the sideline → parents revert to paper. Mitigate with live-game usability tests in week 5, not week 11.

### Phase 2 — Multi-phone: "the whole sideline is the camera crew"
- **Goal:** Aggregate the six phones already filming every game into one organized game record with an official feed.
- **Headline features:** Multiple parents upload to the same game; automatic clip-to-game association (team + date/time + geofence hint); main team account approves/attaches parent clips as official; angle picker on events ("see this goal from 3 angles") — sibling-angle clips are collected as the multi-view corpus, with cross-angle AI fusion deferred to Phase 4; coach web console grows film review, the approval queue, and team stats (on top of the minimal Phase-1 console); EMO/man-down situational tags; simple client-side caption/score-bug overlays on 17s share clips.
- **What unlocks it (tech):** R2 upload pipeline with per-team quotas + client-side 720p transcode; rough time-alignment of clips (metadata timestamps + audio-peak alignment, not frame-level sync). **Adoption precondition:** Phase 1 exit — teams with multiple active parents, proving the multi-uploader demand is real.
- **Exit criteria:** ≥ 50% of active games receive video from 2+ phones; coach approval flow used weekly; storage cost per team-season measured and under target (informs pricing).
- **Rough effort:** 4–6 weeks.
- **Primary risk:** Storage cost curve — multi-uploader teams 10× the video volume. Mitigate: clips-first defaults, quotas, and this phase is where the paid team tier gets validated.

### Phase 3 — External cameras: "the team gets a real broadcast angle"
- **Goal:** Teams plug in dedicated sideline hardware — GoPro, Mevo, Hudl-Focus-style units, RTSP/IP cameras — and designate one as the official feed; parent phones fill the gaps.
- **Headline features:** External-camera ingest (file import for GoPro/Mevo; RTSP pull via a small local relay or post-game upload); "official camera" designation per team; full-game film in the coach console with event-jump navigation; first heat maps and possession charts (from manually tagged + ZENITH-assisted events); player comparison views; coaching notes and development recommendations mature into the full coach console.
- **What unlocks it (tech):** Full-game storage economics solved (R2 + lifecycle policies + paid tier from Phase 2); chaptered upload for 60–90 min files; a watch-while-tagging review UI. **Adoption precondition:** teams retained through a full season and willing to spend $300–500 on hardware — i.e., proven Phase 2 paying teams.
- **Exit criteria:** ≥ 10 teams running an official external camera; full-game review sessions weekly per team; the official-feed footage quality (stable, elevated, wide) validated as good enough for Phase 4's automated pipeline.
- **Rough effort:** 6–8 weeks (the console matures here too).
- **Primary risk:** Hardware support sprawl (every camera is a special snowflake). Mitigate: bless exactly two reference setups (GoPro on a mast; Mevo) and treat everything else as "import the file."

### Phase 4 — AI-rendered game video + stats: ZENITH grows up and moves server-side
- **Goal:** The official game feed goes in; a stat-overlaid game, auto-detected events, highlight reels, and coaching reports come out. **This is explicitly the server-side evolution of the existing ZENITH client engine** — the same pipeline (detection → SORT-style tracking → team clustering → possession/event heuristics → narrator), re-hosted where it can run bigger models on longer video.
- **Headline features:** AI processes the main game video end-to-end: players, ball movement, field position, possessions, shots, goals, faceoffs, GBs, clears, rides, turnovers, penalty flags; stat overlays rendered onto video; auto-cut player-specific highlight reels; coaching reports + player development insights (the Worker-LLM narrator, now fed rich event streams instead of clip-level summaries); human-in-the-loop correction UI that doubles as training-data collection.
- **What unlocks it (tech):** ZENITH's heuristics upgraded to trained models — and the moat is the data: **every manually tagged, clip-linked event from Phases 1–3 is a labeled training example** (timestamp + event type + player + video). Stable elevated camera angles from Phase 3 make detection tractable. Batch GPU processing (Workers AI where it fits; spot GPU per game where it doesn't) keeps it pay-per-game, not always-on. **Adoption precondition:** Phase 3 teams generating consistent official feeds and asking for auto-stats (tracked via Phase 1's AI-assist usage metric).
- **Exit criteria (v1 of the platform, not a phase to exit):** auto-detected possessions/faceoffs/goals at precision high enough that coaches correct < 20% of calls; per-game processing cost below the per-game price; highlight reels shared by ≥ 50% of parents on processed games.
- **Rough effort:** 1–2 quarters to first useful auto-stats; ongoing model iteration thereafter — this becomes the product's permanent R&D track.
- **Primary risk:** Accuracy-versus-expectation gap at full-game scale. Mitigate exactly as ZENITH already does in miniature — plausibility clamps, confidence gating, suggest-then-confirm — and keep the Phase 1 manual workflow as the always-available fallback and correction layer.

**The through-line:** ZENITH proves the engine → Phase 1 wraps it in a product and starts collecting labeled events → Phase 2 collects the footage → Phase 3 standardizes the camera → Phase 4 closes the loop, turning three seasons of human-tagged film into the training set its competitors don't have.

---

## 4. Phone Recording Workflow

The phone is the camera, the stat sheet, and the upload pipe. The workflow has one design rule: **a parent wearing gloves on a cold sideline must be able to tag a faceoff win in two taps without looking away from the field for more than a second.** Everything below serves that.

### 4.1 Pre-Game (60 seconds, done in the parking lot)

1. **Create game.** Coach (or any team admin) creates the game: opponent, date/time, home/away, venue, level (e.g., 14U A). One tap from the team schedule if it was pre-entered. Games get a short join code (`TIGERS-0614`) so anyone on the team can attach to it.
2. **Roster check.** The game inherits the team roster. Coach marks scratches/no-shows so the player picker during the game only shows kids actually playing. This matters: a 22-kid picker is unusable mid-game; a 16-kid grid sorted by jersey number is fine.
3. **Assign recorder(s).** One person gets the **Official Recorder** role for this game (defaults to coach, delegable to a parent). The recorder's video becomes the canonical game film. Anyone else can record — their clips enter the Phase 2 "submitted clips" queue (Section 6.1) rather than the official timeline. The recorder role is a token on the game record, not the account: it can be handed off mid-game (Section 4.5).
4. **Pre-flight check.** Before the whistle, the app runs a silent check: free storage (estimate minutes of recording remaining at current quality), battery %, and whether the user has enabled tag-only fallback. Surface warnings now, not at Q3.

### 4.2 During the Game: Record + Quick-Tag

Two supported modes, both first-class:

- **Record in-app.** Camera view with a tag bar overlaid. Recommended default: 1080p30 (good enough for ZENITH-style CV, ~4–5 GB for a full game, manageable upload). 4K is opt-in for Phase 3/4 ambitions.
- **Tag-only mode.** No video — just the tag bar and a running game clock. Critical for: low battery, full storage, a grandparent who just wants to keep stats, or games where someone else has the camera. Tags are timestamped against the game clock, so they can be married to video later (theirs or anyone's).

**The tag bar** is a single row of big thumb targets, always visible whether recording or tag-only:

| Button | Follow-up | Notes |
|---|---|---|
| **FO** | Win/Loss → FOGO picker → (optional) how won: clamp / counter / fast-break GB | The marquee stat. Two taps minimum (FO → W), refinable post-game. |
| **Goal** | Scorer → (optional) assist | Auto-increments scoreboard. EMO/man-down toggle if a flag is live. |
| **Shot** | Shooter → on-goal / off / pipe | Goals auto-count as shots; don't double-tag. |
| **GB** | Player picker | Ground balls — the hustle stat parents love. |
| **TO** | Player → (optional) caused-turnover credit to defender | |
| **Penalty** | Player → duration (0:30/1:00/2:00/3:00) → releasable? | Starts an on-screen penalty timer; arms the EMO/man-down toggle. |
| **Save** | Goalie picker (defaults to the starting goalie) | Pairs with on-goal shots; powers goalie save % on cards and summaries. |
| **Clear** | Success / fail → (optional) player credit | Team clearing %; a failed clear can chain into a TO tag. |

Mechanics that make this work live:

- **Auto-timestamping with pre-roll.** Every tag captures the video timestamp *and* writes a clip marker from **T−12s to T+5s** (configurable). Parents always tag *after* the play happens; the pre-roll is what makes the highlight actually contain the goal.
- **Player picker = jersey-number grid**, recents bubbled to top, "Unknown #" escape hatch (resolve post-game). Each parent account can pin "my kid" as the first tile.
- **Undo toast.** Every tag shows a 5-second "FO Win — #14 ✕ Undo" toast. Mis-taps die here, not in post-game cleanup.
- **Period markers.** Big Q1/Q2/Q3/Q4/OT chips. Tapping one stamps a period boundary — this is what powers FO%-by-quarter analytics later and lets multi-clip games align (Section 4.5).
- **Camera-roll import.** Forgot to use the app? Record in the native camera, import after. On import, the user drags a single alignment handle ("this moment = opening faceoff" or "= start of Q3") and all tag timestamps map onto the clip. EXIF creation time gives a smart default.

### 4.3 Post-Game: Review → Fill Gaps → Publish

The recorder (or coach) opens the **tag timeline**: a horizontal strip of the game with every tag as a colored pip, grouped by period.

1. **Review pass.** Tap any pip → 17-second clip plays. Fix the three classic live-tagging errors: wrong player, wrong outcome (FO W↔L), timestamp nudge (±15s scrubber).
2. **Fill gaps.** The app flags inconsistencies: scoreboard says 8 goals, only 7 tagged; a penalty with no expiry; FO count ≠ goals + period starts (every goal and period start should have a faceoff — a uniquely lacrosse sanity check that catches missed tags reliably).
3. **Publish summary.** One tap generates the game summary: final score, FO line (e.g., **14/21, 67% — #14 took 18**), goals/assists, GBs, penalties — rendered through the **ZENITH recap narrator** (the local template narrator ships in v1; the Cloudflare Worker LLM seam upgrades the prose later, events-as-text in, paragraph out, key in a Worker secret). Publishing pushes the summary to every parent on the team and freezes the official stat line (coach can still amend with an audit trail).

### 4.4 Offline-First + Storage + Upload

Sidelines have terrible connectivity. The architecture assumes **zero bars until the car ride home**.

- **Tags are an append-only local event log** (SQLite via Expo). Each event: `{game_id, type, player_id, video_ts, wall_clock, period, device_id, seq}`. Sync is last-writer-wins per event with `device_id+seq` dedupe — events are tiny, conflicts are rare, and the coach's post-game edit always wins over a live tag. Tag sync is a few KB and succeeds even on one bar.
- **Video stays on-device** until upload conditions are met. Default policy: **wifi-only, charging-preferred, background upload** of (a) the 17s clips around every tag immediately, (b) full game film second. This ordering is the trick: parents see highlights within minutes of getting home on a few hundred MB, while the 4 GB full-game file trickles up overnight.
- **Chunked + resumable.** Direct-to-R2 multipart upload, presigned per-part by a Cloudflare Worker (8 MB parts, parallelism 3, resume from last completed part). No tus server to run, no egress fees on playback via R2 + Cloudflare CDN — this is the $0-ish pipe the whole cost model leans on.
- **Local retention.** After verified upload, the app offers to delete local copies; default keeps clips, deletes full film after 7 days. Storage meter lives in settings and in the pre-flight check.

### 4.5 Edge Cases (the ones that will actually happen by week 2)

- **Battery dying mid-game.** At 20% the app offers **Eco mode**: drop to 720p, dim viewfinder, disable preview thumbnails. At 10% it offers tag-only mode — *stats survive even if film doesn't.* Tags from tag-only mode can later be aligned to anyone else's video of the same game.
- **Storage full.** Pre-flight estimates minutes remaining; mid-game, at <2 GB free the app warns and offers to drop quality or stop recording while continuing tags. Never silently truncate.
- **Multiple short clips vs. one long recording.** Both are normal — iOS thermal throttling and "I stopped recording during timeouts" guarantee fragmentation. The game model is **a playlist of segments, each with its own offset onto the game clock**, anchored by period markers and the alignment handle. Stats and the tag timeline are computed over the stitched virtual timeline; the user never has to merge files.
- **Halftime.** Tapping the Q2-end marker pauses recording, shows the running stat line as a shareable mid-game card (ZENITH share-card export), and reminds about battery/storage. Q3 marker resumes a new segment — no 12-minute halftime footage bloating the file.
- **Recorder handoff.** "Hand off recorder" sends the token to another team member; their app picks up segment N+1 with the game clock already synced. If two people accidentally record simultaneously, both segments are kept; the official-recorder segment wins for the canonical timeline and the other drops into the Phase 2 submitted-clips queue. Duplicate tags within ±8s of the same type/player are auto-merged with a review flag.
- **App crash / phone dies.** Event log is flushed to disk on every tag; video segments are finalized every 60s (fragmented MP4), so a crash loses at most a minute of film and zero tags.

---

## 5. Parent App Workflow

The parent app is the growth engine. Coaches are acquired one at a time; parents arrive 20 at a time when a coach onboards a team, and parents are the ones who share highlight cards to the team group chat — which is how the *next* coach finds the app. Every screen should end in either pride (view loop) or contribution (contribute loop).

### 5.1 Onboarding: Invite → Claim → Approve

1. **Invite link.** Coach shares one team link (or QR at the team meeting) — into the team group chat, where these things actually spread.
2. **Account + claim kid.** Parent signs up (Apple/Google sign-in — this audience will not do passwords), sees the roster as jersey numbers + first names, and taps "That's my kid" on #14. Multiple parents/grandparents can claim the same player; multi-kid families claim multiple players (each gets its own card).
3. **Coach approval.** Claims sit pending until the coach approves (one tap per claim in the console, batched). This is the trust gate: nobody sees a minor's stats or video without the coach vouching for the link. Until approved, the parent sees only the team schedule and public team results.
4. **First-run prompt.** Immediately after approval: "Tigers vs Ridgewood is Saturday — want to be a recorder?" Convert them to contributors before the novelty fades.

**Parent-as-team-admin path (no coach yet).** A parent can also create the team themselves: they become the team admin (`team_members.role = 'admin'`), their own kid's claim is auto-approved (they created the roster entry), and the app is fully useful solo — my kid, my stats, my clips (the §1 chicken-and-egg mitigation made concrete). The founding parent approves other guardians' claims until a coach is invited; a coach who joins later inherits admin and takes over approvals.

**Player logins (13+).** With guardian and coach approval, a player aged 13 or older gets their own read-only login: the same parent-app views (dashboard, clips, coach feedback, highlights) scoped to themselves, in the `player` role — no tagging, no uploads, no share exports. Under-13 players never get accounts (the §5.5 COPPA posture); their guardians' view is their view.

### 5.2 Home Screen: the "My Kid" Card

One card per claimed kid, above the fold, designed to be screenshotted:

- **Header:** photo/avatar, #14 — name, position (FOGO), team.
- **Last game:** opponent, result, the kid's line: `9/13 FO (69%) · 4 GB · 1 A`.
- **Season FO%** big and bold, with a **trend sparkline** of FO% by game across the season — the "is my kid improving" answer in one glance. Non-FOGOs get a position-appropriate headline stat (goals for attack, GBs/caused TOs for poles, save % for goalies).
- **Unread badges:** new coach feedback, new highlight clips, clip-request updates.

Below the card: team schedule (next game prominent, with "record this game" CTA), latest published game summary, and the contribute shortcuts.

### 5.3 The View Loop

Tabs under the kid's profile, ordered by parent demand:

1. **Game stats.** Per-game box line + the tag timeline filtered to their kid — every tagged moment is a playable 17s clip. This view *is* the product for most parents.
2. **Season stats.** Cumulative line, per-game averages, trend charts (FO% by game, GBs by game), and milestones ("first hat trick", "50th GB") which double as share-card moments.
3. **Faceoff stats** (the namesake, deepest view): season FO%, FO% by opponent, by quarter (does he fade in Q4?), wins by exit type (clamp-and-carry vs. counter vs. wing GB — as tagged or, later, AI-classified), head-to-head vs. specific opposing FOGOs across the season.
4. **Highlights.** Auto-collected reel of every clip where their kid is tagged, newest first, each one share-ready.
5. **Coach feedback.** Notes the coach published to this player (Section 6.3) — clip-anchored when applicable, so "great counter move here" arrives attached to the video of the counter move.
6. **Progress over time.** Season-over-season once year 2 data exists; until then, monthly trend snapshots and coach development goals with status.

### 5.4 The Contribute Loop

- **Record / upload to a team game.** Full Section 4 workflow, available to any approved parent. Their video lands in the game's **submitted clips** queue; the coach attaches what's useful to the official game (Phase 2). Multi-angle association is automatic: clips uploaded against the same `game_id` with aligned period markers are siblings, which is exactly the multi-view corpus the Phase 4 cross-angle AI work needs (Phase 2 only collects it).
- **Tag their child.** In any clip — their own or the official film — parents can drop "my kid at 3:42" markers. Parent tags are *suggestions*, rendered distinctly until coach- or AI-confirmed; confirmed tags flow into the kid's highlight reel. (These confirmations are also free labeled training data for Phase 4 — every parent tagging their kid is annotating the dataset.)
- **Request clips.** "Can I get the clip of his Q3 goal?" becomes a structured request on a stat event with no attached video: it lands in the coach's queue *and* pings other parents who recorded that game window — often another parent has the angle, and the coach never has to be the bottleneck.
- **Share highlights.** The **ZENITH share-card pattern**, productized: any clip or stat milestone exports a branded image card (kid's number/name per privacy settings, stat line, team colors, app watermark + QR) sized for iMessage/Instagram. This is the viral surface — every share card in a team group chat is an ad. Video sharing exports a watermarked clip with a simple client-side caption/score-bug overlay (a Phase 2 carve-out, §2; the full Phase-4 overlay engine's first, simplest customer).

### 5.5 Privacy Model

Non-negotiable, because the subjects are minors:

- **Visibility scopes:** a parent sees **(a)** full stats, clips, and feedback for **their claimed kids only**, **(b)** team-level aggregates (score, team FO%, possession %, team stat leaders *as a coach-controlled toggle*), and **(c)** nothing individual about other kids. Other players appear in shared full-game video by necessity, but other kids' stat lines, profiles, and feedback are never reachable from a parent account.
- **Coach feedback is private** to coach + that kid's guardians. Never team-visible.
- **Sharing permissions per player**, set by guardian and capped by team policy: *Private* (guardians only) / *Team* (visible to teammates' families in-app) / *Shareable* (export allowed). Coach sets the team ceiling; a guardian can always be *more* restrictive. Share cards respect it — a "Team"-scoped kid exports as "#14" with no surname.
- **Submitted video** is visible only to the submitter and coaches until the coach attaches it to the official game.
- **Plumbing:** R2 objects are private; playback via short-lived signed URLs minted by a Worker that enforces scope checks. Hard delete on guardian request (clips, tags, derived stats). No public player pages, ever, for youth teams.

---

## 6. Coach Console Workflow

The coach console is the **review hub** — a web app (Next.js on Cloudflare Pages, same Worker/R2 backend as mobile) built for the Sunday-morning-with-coffee film session. Design target: **a head coach turns a recorded game into reviewed film, corrected stats, and player feedback in under 30 minutes.** The console is also where the human-in-the-loop lives: as the AI stat engine grows from ZENITH heuristics to the Phase 4 pipeline, the coach's corrections are both quality control and the labeled data that makes the engine better. **Phasing:** Phase 1 ships a deliberately minimal console — roster management, published game summaries, and the AI-suggestion lane over uploaded clips (§6.1); the full film-review hub described below grows in across Phases 2–3.

### 6.1 The Review Hub Loop

**Post-game film review.** Open a game → full-width video player with the **tag timeline** below: every event as a colored pip on the scrubber, filterable by type (show only FOs), by player, by period. Keyboard-first: space play/pause, `←/→` ±5s, `J/K/L` shuttle, `F/G/S/B/T/P` to drop a tag at the playhead, number keys for jersey assignment. Coaches review film like editors; give them editor controls.

- Click a pip → jump there with pre-roll, inline edit (player, outcome, FO exit type), or delete.
- **Gap pass:** same consistency checks as Section 4.3 (untagged goals vs. scoreboard, FO count vs. goals + period starts, dangling penalties), presented as a checklist the coach burns down.
- **Telestration-lite:** freeze-frame, draw arrows, save as an annotated frame — feeds directly into coaching notes (6.3).

**Approve parent-submitted clips (Phase 2).** A per-game queue of parent uploads, each pre-aligned to the game clock via period markers. For each: preview at speed, then **Attach** (becomes alternate-angle film, linked to overlapping events — the timeline grows an angle-switcher), **Keep private** (submitter only), or **Decline.** Batch actions, because a popular game will get six uploads. The official-recorder feed stays canonical; attached angles supplement it.

**Validate / correct AI suggestions (the seam to Phase 4).** From day one the console renders a second, visually distinct lane on the timeline: **suggested events**, with confidence scores. In Phase 1 these come from the ZENITH engine run client-side over uploaded clips — full game film stays on-device in Phase 1 (§1), so the lane covers clips only — (possession changes, candidate passes, face-off detections — the heuristics that already exist at zenith.robcolosky.com); in Phase 4 they come from the server-side pipeline. The coach's verbs never change: **Confirm** (promotes to official, one keystroke), **Fix** (edit then confirm), **Reject.** Two rules keep trust: AI suggestions *never* silently enter official stats — a human confirms everything that hits a kid's stat line — and every decision is logged as training signal. Building this lane in Phase 1, when it's only ZENITH heuristics feeding it, means Phase 4 ships into a UI and a habit that already exist.

### 6.2 Analytics Views

All views filter by season / last-N-games / opponent, and every chart exports as an image (the ZENITH share-card exporter, reused server-side... or client-side, same canvas code).

- **Team stats.** Game-by-game: goals for/against, shots and shooting %, team FO%, GB differential (the possession-war stat), clearing % and ride success %, EMO conversion and man-down kill %, turnovers committed/forced, penalties.
- **Individual stats.** Sortable roster table — G/A/Pts, shots/S%, GB, CT, TO, penalty minutes; FOGO block (FO W-L, FO%, FO GBs won self vs. by wings); goalie block (saves, save %, GAA). Click-through to a player page mirroring the parent view plus coach-only layers (notes, development goals, comparison shortlist).
- **Faceoff analytics** — the signature module, deepest by design:
  - FO% **by opponent** (and vs. specific opposing FOGOs across rematches),
  - FO% **by quarter** (conditioning/adjustment fingerprint: a FOGO who wins Q1 and loses Q4 is a conditioning note; one who loses Q1 and wins Q3 is making adjustments),
  - FO% **by technique/exit** as tagged: clamp-and-carry, counter, plunge, wing-GB wins — including wing-play credit, because faceoffs are a 3-man unit and the wings deserve stat credit for FO GBs,
  - violation tracking, and FO→possession→shot conversion: how often does a FO win become a shot inside 30 seconds? That number is what wins coaches over.
- **Heat maps.** Honest phasing: Phase 1 ships *time-based* density (when in the game do our goals/GBs/penalties happen — quarter × event grids). Spatial shot charts arrive with a tap-to-place location picker on a half-field diagram during tagging/review; true positional heat maps from video arrive with Phase 3/4 homography (fixed-camera field registration — the server-side evolution of ZENITH's auto-scale-from-player-height trick). Don't fake spatial data before the pipeline can earn it.
- **Possession charts.** Possession % by period (ZENITH's team possession engine, already clustering light/dark jerseys, productized), possession-time differential, and possession outcome flows: FO win → settled / fast break → shot / TO / clear — a Sankey-style strip per game.
- **Player comparison.** 2–4 players side by side, radar + trend lines, position-normalized. Two FOGOs splitting reps is the canonical use: FO% by quarter and by opposing FOGO answers "who starts Saturday" with data. Comparison views are **coach-only** — never surfaced to parents, for obvious team-chemistry reasons.

### 6.3 Coaching Notes → Parent-Visible Feedback

The flow that closes the loop between film review and player development:

1. While reviewing, coach drops a **note on a clip** (or annotated freeze-frame, or stat trend): "Watch his hands here — clamping late when the whistle's quick. We'll drill quick-whistle reps Tuesday."
2. Each note has a **visibility switch**: *Private* (coach/staff only — scouting notes, lineup thoughts) or *Player feedback*. Private is the default; publishing is deliberate.
3. Publishing pushes it to the kid's guardians: it appears in the parent app's **Coach Feedback** tab, clip attached, and fires the unread badge on the my-kid card. A parent watching the exact clip the coach annotated, with the coach's words on it, is the single highest-retention moment in the product.
4. Notes can carry a **development goal** ("FO% > 55% by June", "10 wing GBs this month"). Goals track automatically against incoming stats and render as progress bars in both apps — this is the seed of the player-development platform, and in Phase 4 the AI's coaching-report generator drafts these notes for the coach to edit and publish (same confirm-before-it-touches-a-kid rule as stats).

### 6.4 Roster + Season Management, Season Reports

- **Roster:** add/import players (CSV or paste from TeamSnap-style lists), jersey #, position, grad year; guardian-claim approvals (5.1); player photo; archive/transfer between seasons. Jersey-number changes are effective-dated so historical film tags stay correct.
- **Season:** create seasons, build the schedule (which pre-creates games, enabling the 60-second pre-game flow in 4.1), set the team privacy ceiling and the team-aggregate visibility toggle (5.5), assign roles (assistant coach = full console; team manager = scheduling + roster, no film edit rights).
- **Season reports:** at season's end (or any time), generate per-player **development reports** — season stat line, trend charts, coach feedback digest, goal outcomes, top-5 clips — rendered through the recap narrator (template now, Worker-LLM prose later) and exported as PDF + share card to guardians. Plus a **team season report**: record, stat leaders, FO/possession/clearing trends, season highlights. This is the artifact a coach forwards to their club director — i.e., the artifact that sells the next five teams.


---

## 7. External Camera Architecture (Phase 3)

Phase 3's job is simple to state: get higher-quality, more reliable angles into the **same game timeline** that phone clips already live in, without making the camera a prerequisite. A team that owns zero hardware must lose nothing; a team with a GoPro on a tripod must get noticeably better film and better Phase-4 AI input.

### 7.1 Three ingest paths

| Path | Hardware | How it gets in | Latency | Notes |
|---|---|---|---|---|
| **File import (post-game)** | GoPro, DSLR, any SD-card cam | Coach plugs in / AirDrops → app or console upload → multipart direct-to-R2 | Post-game | The 80% case. Zero new infra: it's the existing phone-upload path with bigger files (chunked, resumable). GoPro's 4K/60 is the best Phase-4 training fodder. |
| **Streaming cams** | Mevo, RTSP/IP cams, PTZ | **Record-then-upload — no live ingest:** (a) cams that record locally (Mevo et al.) upload their file post-game via the file-import path; (b) a **field box** — a Raspberry Pi/old laptop running a ~200-line relay (`ffmpeg` pull from RTSP → segmented chunks buffered to local disk → uploaded to R2 post-game or opportunistically when connectivity allows) for cams that only speak local RTSP | Post-game | The field box is deliberately dumb: pull, chunk, buffer, upload, retry. No on-box AI, and **no live ingest** — live/near-live viewing stays explicitly deferred (§1, §10). Buffering to disk means a dead sideline hotspot loses nothing — chunks upload when connectivity returns. |
| **Auto-trackers** | Hudl-Focus-style, Veo-style pano cams | Treated as a file source: export/download their MP4 and import. No API integration chasing. | Post-game | Don't build vendor integrations in Phase 3. Their output file is just a very good "official feed" candidate. |

### 7.2 Official feed designation

- Every `video_asset` attaches to a game with an `angle` label (e.g., `sideline-main`, `endline-north`, `parent-bleachers-3`) and a source type.
- The **team account designates exactly one asset as `is_official = true`** per game (default: the highest-resolution, longest-coverage asset; coach can override). This is already the Phase 2 approval model — Phase 3 just adds camera sources to the same flow.
- The official feed is the spine: stat timestamps, the Phase-4 AI pass, and highlight cuts are all expressed against **official-feed time**. Parent phone clips and secondary cams become *supplements* — alternate angles pinned to the same moments.

### 7.3 Multi-angle timeline + clock sync

Every asset gets an `offset_ms` relative to the official feed. Sync strategy, in order of preference:

1. **Audio fingerprinting (primary, automatic).** Whistles, the start horn, and crowd noise are loud, sharp, and shared across every mic on the field. Cross-correlate audio chirp-prints between assets — this is a cheap FFT job that runs in a Worker or even client-side, and whistle transients routinely give sub-100ms alignment.
2. **Scoreboard OCR (secondary, automatic).** If any two angles can see the scoreboard, OCR the game clock at a few sampled frames and solve for offset. Also independently useful: it yields a wall-clock → game-clock mapping (quarters, stoppages) for free.
3. **Manual offset (always-available fallback).** Side-by-side scrub UI: coach drags one video until the faceoff whistle lines up, taps "lock." Thirty seconds of human effort; ship this *first*, then make the automatic paths fill it in.

Once offsets exist, the coach console's game film view becomes a **single timeline with an angle switcher** — click any stat event, see it from every camera that captured it.

### 7.4 Ingest topology

```
  SIDELINE                          EDGE / CLOUD                        CONSUMERS
  ────────                          ────────────                        ─────────
  Parent phones ───(app upload)──┐
                                 │
  GoPro / SD cams ─(post-game ───┤
   / auto-trackers)  file import)│
                                 ├──► Cloudflare Worker ──► R2 (originals, master copies)
  Mevo (record → file upload) ───┤    (auth, signed URLs,        │
                                 │     asset registry)           ├─► Cloudflare Stream
  RTSP/IP cam ──► FIELD BOX ─────┘                               │   (paid-tier full games)
                  (Pi + ffmpeg:                                  │
                   pull → chunk →                                ├─► Sync service
                   buffer → upload                               │   (audio fingerprint /
                   post-game,                                    │    scoreboard OCR
                   survives dead                                 │    → offset_ms)
                   hotspots)                                     │
                                                                 │
                                                                 └─► Phase-4 AI queue
                                                                     (official feed first)
                                          Postgres (Neon): games, video_assets(angle,
                                          offset_ms, is_official), stat_events
```

---

## 8. AI Video Processing Pipeline (Phase 4)

### 8.1 Two tiers, one engine philosophy

**Tier A — Client tier: ZENITH, productized.** The existing engine (zenith.robcolosky.com) already does, in-browser at $0/clip: COCO-SSD player detection, motion-fusion ball tracking, auto-scale from player height, trajectory-fit speed with plausibility clamps, SORT-style multi-player tracking with jersey-color descriptors, automatic light/dark team clustering, possession/pass/faceoff heuristics, per-player stat cards, and a plain-English recap. Phase 4 does not replace it — it **embeds it** as the instant path: a parent tags a 30-second clip, ZENITH runs on-device, and stats/speed/share-card appear in seconds with zero marginal cost. Short clips (≤ ~2 min), single angle, "good enough now" answers. This is also the demo that sells the product on a sideline.

**Tier B — Server tier: the queued full-game pass.** Architecturally, Tier B is ZENITH's pipeline re-implemented server-side with better models and more compute — same stages, same event vocabulary, same output schema. That continuity matters: the heuristics, clamps, and team-clustering logic are already validated; the server tier upgrades each stage rather than inventing a new system.

### 8.2 Server pipeline stages

```
ingest ─► segment ─► detect+track ─► team cluster ─► field registration
   ─► event inference ─► stat assembly + confidence ─► overlay + highlights
   ─► coach validation loop ─► (corrections → training data → better models)
```

1. **Ingest.** Pull official feed from R2; normalize to a fixed fps/resolution proxy (e.g., 720p15 for inference, original kept for rendering).
2. **Scene/segment detection.** Classify live play vs stoppage (whistles via audio, scoreboard-clock OCR, motion energy). Typically cuts a 90-minute file to ~35–45 minutes of live play — *the single biggest cost lever*: everything downstream runs only on live segments.
3. **Detection + tracking.** YOLO-class model (start YOLOv8/v11-nano with the public COCO `person`/`sports ball` classes, then fine-tune on lacrosse footage harvested from the validation loop) detecting players, ball, refs; ByteTrack/SORT for identity persistence — the server-grade version of ZENITH's tracker.
4. **Team/jersey clustering.** ZENITH's light/dark color-descriptor clustering, upgraded with torso-crop embeddings; refs split out by stripe signature. Jersey-number OCR is a later add-on, not a launch dependency — coach-assisted identity mapping covers it.
5. **Field registration.** Homography from detected field lines (restraining lines, crease, midline) to real field coordinates. This is what unlocks **true heat maps, possession charts by zone, clear/ride detection by field-half transitions, and shot-location charts** — the marquee Phase-4 upgrade over ZENITH's pixel-space view.
6. **Event inference.** Possessions from ball-proximity + team ID (ZENITH's heuristic, now in field coordinates). Shots from ball velocity vectors toward the cage. Goals from goal-mouth ball disappearance + play stoppage + celebration/restart signals. Faceoffs from the X-formation at midfield after stoppages. GBs from loose-ball-to-possession transitions. Clears/rides from defensive-half-to-offensive-half possession sequences. Turnovers from possession flips without a shot. Penalties from whistle + flag-color cues + man-up/man-down player-count deltas (EMO/man-down detection is a free byproduct of counting on-field players per team).
7. **Stat assembly + confidence scoring.** Every inferred event becomes a `stat_event` row with `source='ai'` and a 0–1 confidence. Nothing the AI emits is gospel; it's a draft.
8. **Overlay rendering + highlight cutting.** Burn stat overlays/score-bug onto the proxy; auto-cut clips around high-value events (goals, faceoff wins, saves) into per-player highlight reels.
9. **Coach validation loop.** Console shows AI events sorted by confidence-ascending ("check these 12 first"). Confirm/correct/delete in one tap → `source` flips to `ai_confirmed`. **Every correction is labeled training data** — this loop is how a solo founder builds a lacrosse-specific dataset without paying annotators.

### 8.3 Cost model

| Path | Rough cost / game-hour | When |
|---|---|---|
| Client tier (ZENITH) | **$0** | All clips, all phases — forever the default for short video |
| GPU spot (RunPod T4/A10 spot, ~$0.20–0.40/hr) | **~$1–3 per full game** (segment-filtered 720p15 inference runs ~1–2× realtime on the live-play minutes) | Batch overnight processing — the steady-state path |
| Serverless GPU (Modal/Replicate, ~$0.60–1.10/hr equiv., zero idle) | **~$3–6 per full game** | Launch phase + bursty weekends; pay only when a job runs |
| Cloudflare Stream (full-game playback, paid tiers only) | **~$0.45/game-hour-month stored + ~$0.06/viewer-hour delivered** ($5 + $1 per 1,000 min) | Full-game film on paid team tiers (§10, §11) — clips never touch Stream; they play free from R2 signed URLs |

Decisions baked in: **start serverless** (zero idle cost, zero ops, matches weekend-burst usage), move to spot batch when volume justifies it. At $5/game worst case against team-tier SaaS pricing (§11), unit economics work from day one. **What stays client-side and why:** all clip-level analysis (ZENITH), share-card rendering, audio-fingerprint sync, and playback — because the phone's compute is free and Cloudflare's egress is $0. The server tier is reserved for the one thing phones can't do: a full game at consistent quality with field registration. **Human-in-the-loop is the accuracy bridge:** coach validation makes 80%-accurate AI feel like a fast assistant instead of a broken oracle, while quietly building the dataset that closes the gap.

### 8.4 Honest accuracy expectations

| Event | Expected AI accuracy (v1) | Why |
|---|---|---|
| Faceoffs (occurrence + result) | High (~90%+) | Fixed location, fixed formation, fixed restart context; result = who possesses next. This is why the faceoff niche is the wedge. |
| Goals | High (~85–90%) | Multiple converging signals: cage geometry, stoppage, restart, celebration, scoreboard delta. |
| Possessions / clears / rides | Good (~80%) | Team-level + field-half logic is robust even when ball tracking blips. |
| Shots, GBs | Moderate (~70–80%) | Fast ball motion; scrums occlude GBs. |
| Turnovers | Moderate (~70%) | Defined by possession-flip inference — inherits its errors. |
| Penalties | Low-moderate (~60%) | Flags are tiny; rely on whistle + player-count deltas; expect coach confirmation. |
| Ball tracking (continuous) | Hardest problem in sports CV — a 2" white ball at 90 mph, occluded by sticks | Treated as a *signal*, never a single point of failure: every event has non-ball corroborating cues. |

**Graceful degradation is the product contract: AI suggests, human confirms.** Low confidence → event ships as a flagged suggestion, not a stat. AI fully wrong → coach is no worse off than Phase 1 manual tagging, except the film is already cut into reviewable segments. The product never silently publishes a wrong stat to a parent's feed — `ai_confirmed` or `manual` provenance gates what parents see by default.

---

## 9. Database Schema

Postgres on Neon, managed via Drizzle. Governing principle: **every stat row is timestamped and sourced.** No stat exists without (a) a millisecond timestamp against a specific game, (b) a provenance (`manual | ai | ai_confirmed`), and (c) when AI-originated, a confidence score. This one rule makes the coach-validation loop, the training-data harvest, and "parents only see confirmed stats" all trivial queries instead of features.

```sql
-- ── Identity & org ─────────────────────────────────────────────
CREATE TABLE orgs (            -- club / program
  id uuid PRIMARY KEY, name text NOT NULL, created_at timestamptz DEFAULT now()
);
CREATE TABLE teams (
  id uuid PRIMARY KEY, org_id uuid REFERENCES orgs(id),
  name text NOT NULL, age_group text,
  privacy_ceiling text NOT NULL DEFAULT 'shareable',   -- max sharing_scope a guardian may set (§5.5)
  show_team_aggregates boolean NOT NULL DEFAULT true,  -- team-aggregate visibility toggle (§5.5)
  created_at timestamptz DEFAULT now()
);
CREATE TYPE team_role AS ENUM ('admin','coach','parent','player');
CREATE TABLE users (
  id uuid PRIMARY KEY, email text UNIQUE NOT NULL,
  name text, auth_provider_id text,
  -- no global role: roles are strictly per-team via team_members (one user can be
  -- coach on one team and parent on another)
  created_at timestamptz DEFAULT now()
);
CREATE TABLE team_members (    -- user ↔ team w/ per-team role (coach on two teams, etc.)
  team_id uuid REFERENCES teams(id), user_id uuid REFERENCES users(id),
  role team_role NOT NULL,     -- 'admin' = parent-created-team path (§5.1): founding parent
                               -- holds admin; a coach who joins later inherits admin
  PRIMARY KEY (team_id, user_id)
);
CREATE TABLE players (         -- the athlete; may or may not have a login (youth!)
  id uuid PRIMARY KEY, team_id uuid REFERENCES teams(id),
  user_id uuid REFERENCES users(id),          -- nullable: young players have no account
  name text NOT NULL,
  jersey_number int,                          -- current number; history in jersey_history (§6.4)
  position text,                              -- 'FOGO','A','M','D','LSM','G'
  sharing_scope text NOT NULL DEFAULT 'team', -- 'private'|'team'|'shareable' (§5.5), ≤ teams.privacy_ceiling
  grad_year int, created_at timestamptz DEFAULT now()
);
CREATE TABLE jersey_history (  -- effective-dated jersey numbers keep historical film tags correct (§6.4)
  player_id uuid REFERENCES players(id), number int NOT NULL,
  effective_from date NOT NULL,
  PRIMARY KEY (player_id, effective_from)
);
CREATE TABLE parent_player (   -- guardianship requires coach approval (COPPA posture)
  parent_id uuid REFERENCES users(id), player_id uuid REFERENCES players(id),
  approved_by uuid REFERENCES users(id), approved_at timestamptz,
  PRIMARY KEY (parent_id, player_id)
);

-- ── Season & game spine ────────────────────────────────────────
CREATE TABLE seasons (
  id uuid PRIMARY KEY, team_id uuid REFERENCES teams(id),
  name text, starts_on date, ends_on date
);
CREATE TABLE games (
  id uuid PRIMARY KEY, season_id uuid REFERENCES seasons(id),
  opponent text, scheduled_at timestamptz, location text,
  home_away text,                   -- 'home'|'away'|'neutral' (§4.1)
  join_code text UNIQUE,            -- short attach code, e.g. 'TIGERS-0614' (§4.1)
  recorder_user_id uuid REFERENCES users(id),  -- the hand-off-able Official Recorder token (§4.1, §4.5)
  score_us int, score_them int, status text DEFAULT 'scheduled'
);
CREATE TABLE game_roster (          -- per-game active roster: scratches/no-shows (§4.1)
  game_id uuid REFERENCES games(id), player_id uuid REFERENCES players(id),
  active boolean NOT NULL DEFAULT true,
  PRIMARY KEY (game_id, player_id)
);

-- ── Video ──────────────────────────────────────────────────────
CREATE TYPE video_source AS ENUM ('phone','gopro','rtsp','stream_cam','auto_tracker','import');
CREATE TYPE video_status AS ENUM ('uploading','processing','ready','failed','rejected');
CREATE TABLE video_assets (
  id uuid PRIMARY KEY, game_id uuid REFERENCES games(id),
  uploader_id uuid REFERENCES users(id),
  source video_source NOT NULL, status video_status NOT NULL DEFAULT 'uploading',
  angle text,                       -- 'sideline-main','endline-north','parent-3'
  is_official boolean DEFAULT false,
  offset_ms bigint DEFAULT 0,       -- clock sync vs official feed (§7.3)
  r2_key text NOT NULL,             -- canonical original; clips play direct from R2 signed URLs (§4.4)
  stream_uid text,                  -- Cloudflare Stream id — set ONLY for paid-tier full-game assets (§10)
  duration_ms bigint, approved_by uuid REFERENCES users(id),  -- Phase-2 approval
  created_at timestamptz DEFAULT now()
);
CREATE TABLE clips (              -- a time-window of an asset
  id uuid PRIMARY KEY, video_asset_id uuid REFERENCES video_assets(id),
  start_ms bigint NOT NULL, end_ms bigint NOT NULL,
  title text, created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);
CREATE TABLE tags (               -- player ↔ clip ("my kid is in this")
  clip_id uuid REFERENCES clips(id), player_id uuid REFERENCES players(id),
  tagged_by uuid REFERENCES users(id),
  status text NOT NULL DEFAULT 'suggested',  -- 'suggested'|'confirmed' — parent tags render
                                             -- distinctly until coach/AI-confirmed (§5.4)
  confirmed_by uuid REFERENCES users(id),
  PRIMARY KEY (clip_id, player_id)
);

-- ── Stats: the provenance-first event log ──────────────────────
CREATE TYPE stat_type AS ENUM (
  'faceoff','goal','assist','shot','save','ground_ball','turnover',
  'caused_turnover','clear','ride','penalty','emo_goal','man_down_stop'
);
CREATE TYPE stat_source AS ENUM ('manual','ai','ai_confirmed');
CREATE TYPE faceoff_technique AS ENUM ('clamp','rake','plunger','jump','counter','other');
CREATE TABLE stat_events (
  id uuid PRIMARY KEY, game_id uuid REFERENCES games(id) NOT NULL,
  player_id uuid REFERENCES players(id),
  type stat_type NOT NULL,
  t_ms bigint NOT NULL,             -- ms on the OFFICIAL game timeline — always present
  period smallint,                  -- 1–4, 5+ = OT; stamped by the Q1–Q4/OT chips (§4.2) — quarter splits
  source stat_source NOT NULL,      -- manual | ai | ai_confirmed — always present
  confidence real,                  -- required when source='ai'
  detail jsonb,                     -- faceoff: {technique, won, vs_player_id|vs_name,
                                    --           exit_direction, clean_win}
                                    -- shot: {on_cage, location_xy}; penalty: {kind, secs}
  clip_id uuid REFERENCES clips(id),         -- evidence link
  created_by uuid REFERENCES users(id),      -- human OR the ai_job's system user
  confirmed_by uuid REFERENCES users(id), confirmed_at timestamptz,
  device_id text, client_seq bigint,         -- offline-sync origin + per-device sequence (§4.4)
  created_at timestamptz DEFAULT now(),
  UNIQUE (game_id, device_id, client_seq)    -- dedupe for re-uploaded offline events (§4.4)
);

-- ── AI, coaching, sharing ──────────────────────────────────────
CREATE TABLE ai_jobs (
  id uuid PRIMARY KEY, video_asset_id uuid REFERENCES video_assets(id),
  kind text NOT NULL,               -- 'full_game','clip','sync','highlight_cut'
  status text NOT NULL DEFAULT 'queued',  -- queued|running|done|failed
  provider text, cost_cents int, started_at timestamptz, finished_at timestamptz,
  result jsonb, error text
);
CREATE TABLE development_goals (  -- §6.3: structured goals ('FO% > 55% by June') auto-tracked against stats
  id uuid PRIMARY KEY, player_id uuid REFERENCES players(id),
  coach_id uuid REFERENCES users(id),
  metric text NOT NULL,             -- e.g. 'fo_pct','wing_gb_count'
  target_value numeric NOT NULL, due_date date,
  status text NOT NULL DEFAULT 'active',  -- active|met|missed|archived
  created_at timestamptz DEFAULT now()
);
CREATE TABLE coach_notes (
  id uuid PRIMARY KEY, coach_id uuid REFERENCES users(id),
  player_id uuid REFERENCES players(id), game_id uuid REFERENCES games(id),
  clip_id uuid REFERENCES clips(id),
  development_goal_id uuid REFERENCES development_goals(id),  -- a note can carry a goal (§6.3)
  body text NOT NULL, visible_to_parent boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
CREATE TABLE clip_requests (      -- §5.4: structured "can I get the clip of his Q3 goal?" requests
  id uuid PRIMARY KEY, stat_event_id uuid REFERENCES stat_events(id),
  requested_by uuid REFERENCES users(id),
  status text NOT NULL DEFAULT 'open',   -- open|fulfilled|declined
  fulfilled_clip_id uuid REFERENCES clips(id),
  created_at timestamptz DEFAULT now()
);
CREATE TABLE highlights (
  id uuid PRIMARY KEY, player_id uuid REFERENCES players(id),
  clip_id uuid REFERENCES clips(id), title text,
  generated_by stat_source DEFAULT 'manual', created_at timestamptz DEFAULT now()
);
CREATE TABLE shares (             -- public share links w/ expiry (parent virality loop)
  id uuid PRIMARY KEY, highlight_id uuid REFERENCES highlights(id),
  token text UNIQUE NOT NULL, created_by uuid REFERENCES users(id),
  expires_at timestamptz, view_count int DEFAULT 0
);
```

**Critical indexes** (the four queries the whole app hammers):

```sql
CREATE INDEX idx_stat_events_game_time   ON stat_events (game_id, t_ms);          -- game timeline render
CREATE INDEX idx_stat_events_player_type ON stat_events (player_id, type, t_ms);  -- season FO%, GB, trend charts
CREATE INDEX idx_video_assets_game       ON video_assets (game_id, is_official, status); -- film page
CREATE INDEX idx_stat_events_unconfirmed ON stat_events (game_id, confidence)
  WHERE source = 'ai';                                                            -- coach validation queue
```

Notes: faceoff detail lives in `jsonb` rather than 8 nullable columns — FO% by technique is `detail->>'technique'` group-bys, and the shape can evolve without migrations. `stat_events.clip_id` is the evidence link that makes every stat tappable-to-video, which is the product's emotional core for parents. `players.sharing_scope`, `teams.privacy_ceiling`, and `teams.show_team_aggregates` are enforced in the one choke point that matters: the Worker that mints signed playback URLs (§5.5).

---

## 10. Recommended Tech Stack

One stack, no menu. Each pick is the boring option *you already know* — the scarce resource is founder hours, not architecture novelty.

| Layer | Pick | Why (one line) |
|---|---|---|
| Parent/player app | **Expo React Native** | You shipped tesla-sounds on it; camera + upload + push notifications are solved modules, and one codebase hits both sideline platforms. |
| Coach console | **Next.js on Cloudflare Pages** | Your casa-os muscle memory; film-review UIs want a real browser and a big screen anyway. |
| API | **Cloudflare Workers + Hono with a tRPC-style typed client** | Free tier carries you past 100 teams; typed end-to-end like casa-os; escape hatch = the same Hono app on a $5 Bun box if Workers CPU limits ever bite (they won't — heavy compute lives in the GPU queue, not the API). |
| Database | **Neon Postgres + Drizzle** | Free tier, branch-per-PR for safe schema iteration, and Drizzle's SQL-first style matches the §9 schema verbatim. |
| Video storage | **Cloudflare R2** | **Zero egress is the decisive reason** — video apps die on bandwidth bills, and every competitor's S3 bill is your margin. |
| Playback | **R2 signed URLs for clips; Cloudflare Stream for paid-tier full games** | Clips ride the $0-egress R2 pipe (§4.4); Stream's per-minute transcode/adaptive-bitrate is reserved for full-game film on paid team tiers, with its cost priced into the tier (§8.3, §11). |
| Auth | **Clerk** (free ≤10k MAU) | Roles/orgs out of the box maps directly to coach/parent/player + team_members; swap to Lucia-style self-hosted only if pricing ever matters — it won't before product-market fit. |
| Client-tier AI | **ZENITH (TF.js), embedded** | Already built, already validated, $0/clip; ships inside the console via WebView/web today and react-native-fast-tflite later. |
| LLM narration | **Cloudflare Worker, events-as-text** | The seam already exists in ZENITH's narrator; key in a Worker secret; pennies per recap because input is event JSON, not video. |
| Phase-4 GPU | **Modal first, RunPod spot at volume** | Serverless = zero idle cost while jobs are rare; spot batch = ~$1–3/game when weekends fill the queue (§8.3). |

**Where NOT to over-engineer (the solo-founder discipline list):**

1. **No live streaming in Phases 1–3.** Upload-after-the-fact covers the actual job (review + stats). Live is an infra tarpit that Mevo already solves for the few who care.
2. **No custom model training before the coach-validation loop has produced ~50 corrected games.** COCO-SSD/stock YOLO + heuristics + human confirmation is the bridge; training earlier means labeling video by hand for free.
3. **No microservices, no Kubernetes, no event bus.** One Workers API, one Postgres, one GPU queue table (`ai_jobs` *is* the queue — `SELECT ... FOR UPDATE SKIP LOCKED`). Revisit at 1,000 teams, which is a champagne problem.

---

## 11. Startup-Style Feature Roadmap

**The wedge:** faceoff specialists. FOGOs (and their parents) are the most stat-obsessed, most underserved niche in lacrosse — FO% by technique, by opponent, by wing setup is data *nobody* gives them, ZENITH's faceoff heuristics are strongest exactly there (§8.4), and every FOGO's parent talks to every other FOGO's parent at every tournament. Win the X, then expand to the whole field.

### Now / Next / Later → Q1–Q4

| Horizon | Quarter | Theme | Ships |
|---|---|---|---|
| **Now** | **Q1 — "One team plays a full season on it"** | Phone-only MVP (Phase 1) + faceoff wedge | Expo app: record, manual stat tagging (faceoff-first UI: technique, win/loss, vs whom — two taps), clips, player dashboard. Parent + coach login. ZENITH embedded for instant clip analysis + share cards. Minimal coach console (Phase-1 scope, §2): roster, game summaries (FO% / GB / clears), AI-suggestion lane over uploaded clips. Recruit 3 design-partner teams (your network) and live through a real season with them. |
| **Next** | **Q2 — "Every parent in the bleachers is a camera"** | Multi-phone (Phase 2) + sharing loop | Multi-phone game association, coach approval of parent clips, audio-fingerprint sync, child tagging + clip requests, public highlight share links (`shares` table — this is the growth loop), season progress reports, coach notes visible to parents. |
| **Next** | **Q3 — "Real cameras, real film room"** | External cameras (Phase 3) + paid launch | GoPro import, Mevo/RTSP field-box ingest, official-feed designation, multi-angle timeline w/ angle switcher, heat maps + possession charts (manual + ZENITH data), player comparison. **Turn on team billing.** |
| **Later** | **Q4 — "The AI watched the whole game"** | Server-tier AI (Phase 4) **alpha** | Phase-4 **alpha on a handful of official feeds** from design-partner teams: AI-drafted stat events w/ confidence, coach validation queue, auto-cut highlight reels, stat overlays, LLM game recaps. Corrections begin feeding the lacrosse fine-tune dataset. **General Phase-4 beta ships in year 2.** |

**Calendar note:** the quarters are pegged to the lacrosse calendar, not a fiscal one — Q1 = pre-season build + spring season (Phase 1 lives through real games), Q2 = summer club/tournament season (the multi-phone phase needs games being filmed), Q3 = fall ball (camera hardware + billing land while teams evaluate gear), Q4 = off-season (the Phase-4 alpha runs on the season's accumulated official feeds). Slack for beta support, billing launch, and team recruitment lives inside each quarter; §3's own estimates (8–12 + 4–6 + 6–8 weeks, then 1–2 quarters for Phase 4) only fit this year because Q4 carries an alpha, not the full Phase-4 feature set.

### Pricing sketch

| Tier | Price | Gets |
|---|---|---|
| **Parent Free** | $0 forever | Record, tag own kid, view confirmed stats, ZENITH clip analysis, 3 highlight shares/mo. Free tier costs ~nothing (client-side AI + R2 zero egress) and is the acquisition engine. |
| **Parent Plus** | $7/mo | Unlimited highlights/shares, full progress reports, multi-kid. |
| **Team Season** | **$299/season** (~$25/family — less than one tournament fee) | Coach console, unlimited roster/games/video, full-game playback via Cloudflare Stream (its per-minute cost is priced into this tier, §8.3), Phase-3 camera ingest, priority support. |
| **Team AI** | **$599/season** or $15/processed game | Everything + Phase-4 full-game AI passes. At ~$3/game COGS (§8.3), healthy margin from game one. |

### Competitive note

Hudl (~$400–1,500+/yr, institution-sold), Veo (~$1,200 cam + subscription), and Trace all start from the same assumption: *buy our camera / sell to the athletic department.* That assumption excludes exactly the youth/club market, where the parent — not the AD — holds the wallet and is already standing on the sideline holding a 4K camera. Faceoff IQ inverts it: **phone-first means $0 hardware to start, parent-led means bottom-up adoption per team, and the faceoff niche means being the unambiguous best at one thing no incumbent bothers to measure** (technique-level FO splits), instead of a worse Hudl at everything. Cameras become an upgrade path (Phase 3), not a gate — and zero-egress R2 economics let the free tier exist where competitors' bandwidth bills can't.

### North-star metric

**Confirmed stat-events linked to video per active team per week.** It compounds every loop that matters: games recorded (supply), stats tagged or AI-confirmed (engagement + training data), clips attached (the parent emotional payoff), and coach validation (accuracy flywheel). Supporting guardrails: weekly active parents per team (virality) and AI-suggestion confirm rate (model quality trending toward Phase-4 trust).