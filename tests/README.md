# Zenith Smoke Tests

Start the static app:

```bash
python3 -m http.server 4174
```

Run a clip through the real browser flow:

```bash
node tests/zenith-smoke.mjs /absolute/path/to/clip.mp4
```

The script requires Playwright to be available in the local Node environment and
uses system Chrome by default. Override with:

```bash
ZENITH_URL=http://127.0.0.1:4174 CHROME_PATH="/path/to/chrome" node tests/zenith-smoke.mjs /path/to/clip.mp4
```

The important output is `snapshot.diagnostics.trust`. A non-lacrosse or bad
clip should report `valid: false`; a usable centered field play should report
`valid: true` before stats or reels are trusted.
