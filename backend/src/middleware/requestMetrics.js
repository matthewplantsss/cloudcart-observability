import {
  httpErrorCounter,
  httpRequestCounter,
  httpRequestDuration,
} from "../services/metrics.js";

export function requestMetrics(req, res, next) {
  const startedAt = process.hrtime.bigint();

  res.on("finish", () => {
    const elapsed = process.hrtime.bigint() - startedAt;
    const durationSeconds = Number(elapsed) / 1_000_000_000;

    const route =
      req.route?.path ||
      req.baseUrl ||
      req.path ||
      "unknown";

    const labels = {
      method: req.method,
      route,
      status_code: String(res.statusCode),
    };

    httpRequestCounter.inc(labels);
    httpRequestDuration.observe(labels, durationSeconds);

    if (res.statusCode >= 400) {
      httpErrorCounter.inc(labels);
    }
  });

  next();
}
