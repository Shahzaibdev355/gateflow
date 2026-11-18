import { Router } from "express";
import { ServerResponse } from "node:http";

import { createProxyMiddleware } from "http-proxy-middleware";

import { SERVICES } from "../config/service";
import { sendGatewayError } from "../utils/error";

const router: Router = Router();

// Forward requests to User Service.
router.use(
  "/users",
  createProxyMiddleware({
    target: SERVICES.USERS,

    changeOrigin: true,

    proxyTimeout: 5000,
    timeout: 5000,

    on: {
      proxyReq(proxyReq, req) {
        proxyReq.setHeader("x-request-id", String(req.id));

        if (req.headers["x-user-id"]) {
          proxyReq.setHeader("x-user-id", String(req.headers["x-user-id"]));
        }

        if (req.headers["x-user-role"]) {
          proxyReq.setHeader("x-user-role", String(req.headers["x-user-role"]));
        }
      },

      error(error, req, res) {
        console.error("User Service proxy error:", {
          requestId: req.id,
          message: error.message,
        });

        // res is a Socket on websocket upgrades, so it has no HTTP response methods.
        if (!(res instanceof ServerResponse)) {
          res.destroy();
          return;
        }

        sendGatewayError(
          res,
          502,
          "UPSTREAM_SERVICE_ERROR",
          "Unable to reach User Service",
        );
      },
    },
  }),
);

// Forward requests to Order Service.
router.use(
  "/orders",
  createProxyMiddleware({
    target: SERVICES.ORDERS,

    changeOrigin: true,

    proxyTimeout: 5000,
    timeout: 5000,

    on: {
      proxyReq(proxyReq, req) {
        proxyReq.setHeader("x-request-id", String(req.id));

        if (req.headers["x-user-id"]) {
          proxyReq.setHeader("x-user-id", String(req.headers["x-user-id"]));
        }

        if (req.headers["x-user-role"]) {
          proxyReq.setHeader("x-user-role", String(req.headers["x-user-role"]));
        }
      },

      error(error, req, res) {
        console.error("Order Service proxy error:", {
          requestId: req.id,
          message: error.message,
        });

        // res is a Socket on websocket upgrades, so it has no HTTP response methods.
        if (!(res instanceof ServerResponse)) {
          res.destroy();
          return;
        }

        sendGatewayError(
          res,
          502,
          "UPSTREAM_SERVICE_ERROR",
          "Unable to reach Order Service",
        );
      },
    },
  }),
);

export default router;
