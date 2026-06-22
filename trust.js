(function () {
  function assess(input) {
    const frames = input.frames || 0;
    const medianPlayers = input.medianPlayers || 0;
    const trackedPlayers = input.trackedPlayers || 0;
    const ballFrames = input.ballFrames || 0;
    const fieldFrames = input.fieldFrames || 0;
    const fieldHits = input.fieldHits || 0;
    const duration = input.duration || 0;
    const covered = input.covered || 0;
    const reasons = [];

    const fieldRatio = fieldFrames ? fieldHits / fieldFrames : 0;
    const ballRatio = frames ? ballFrames / frames : 0;
    const coverageRatio = duration ? covered / duration : 0;

    if (frames < 18) reasons.push("too few frames analyzed");
    if (coverageRatio && coverageRatio < 0.75) reasons.push("analysis did not cover enough of the clip");
    if (medianPlayers < 2 && trackedPlayers < 2) reasons.push("not enough consistent players");
    if (fieldFrames >= 8 && fieldRatio < 0.18) reasons.push("does not look like field footage");
    if (ballFrames < 6 && ballRatio < 0.04) reasons.push("ball evidence is sparse");

    let score = 0;
    score += Math.min(0.25, frames / 120 * 0.25);
    score += Math.min(0.20, Math.max(medianPlayers, trackedPlayers) / 6 * 0.20);
    score += Math.min(0.20, ballRatio / 0.18 * 0.20);
    score += Math.min(0.20, fieldRatio / 0.30 * 0.20);
    score += Math.min(0.15, coverageRatio * 0.15);

    if (reasons.length) score = Math.min(score, 0.39);

    const valid = reasons.length === 0 && score >= 0.45;
    const label = valid ? (score >= 0.7 ? "TRUSTED" : "ESTIMATED") : "NOT LACROSSE";

    return {
      valid,
      label,
      score: Math.round(score * 100) / 100,
      reasons,
      fieldRatio: Math.round(fieldRatio * 100) / 100,
      ballRatio: Math.round(ballRatio * 100) / 100,
      coverageRatio: Math.round(coverageRatio * 100) / 100,
    };
  }

  window.ZenithTrust = { assess };
})();
