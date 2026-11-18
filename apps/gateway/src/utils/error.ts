import type { ServerResponse } from "node:http";

export function sendGatewayError(
  res: ServerResponse,
  statusCode: number,
  code: string,
  message: string,
): void {
  if (res.headersSent || res.destroyed) {
    res.destroy();
    return;
  }

  const body = JSON.stringify({
    success: false,
    error: {
      code,
      message,
      requestId: res.getHeader("X-Request-ID"),
    },
  });

  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
  });

  res.end(body);
}
