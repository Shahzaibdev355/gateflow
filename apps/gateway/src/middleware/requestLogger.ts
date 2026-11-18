import pinoHttp from "pino-http";
import { randomUUID } from "node:crypto";

export const requestLogger = pinoHttp({
  genReqId(req, res) {
    const id = randomUUID();

    res.setHeader("X-Request-ID", id);

    return id;
  },
});
