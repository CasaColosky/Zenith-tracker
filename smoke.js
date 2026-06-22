(function () {
  function snapshot() {
    const api = window.ZenithApp || {};
    return api.snapshot ? api.snapshot() : { ok: false, reason: "app api unavailable" };
  }

  async function waitFor(predicate, timeoutMs) {
    const started = Date.now();
    while (Date.now() - started < timeoutMs) {
      if (predicate(snapshot())) return snapshot();
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return snapshot();
  }

  window.ZenithSmoke = { snapshot, waitFor };
})();
