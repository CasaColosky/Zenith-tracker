(function () {
  function fmtValue(value) {
    if (value === true) return "yes";
    if (value === false) return "no";
    if (value == null || value === "") return "—";
    if (typeof value === "number") return Number.isFinite(value) ? String(Math.round(value * 100) / 100) : "—";
    return String(value);
  }

  function renderDiagnostics(target, rows) {
    if (!target) return;
    target.innerHTML = rows
      .map(
        ([key, value, tone]) =>
          '<div class="diag-row' +
          (tone ? " " + tone : "") +
          '"><span>' +
          key +
          "</span><b>" +
          fmtValue(value) +
          "</b></div>",
      )
      .join("");
  }

  window.ZenithDiagnostics = { render: renderDiagnostics };
})();
