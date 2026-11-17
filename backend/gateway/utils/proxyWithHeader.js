import proxy from "express-http-proxy";

export const proxyWithHeader = (serviceUrl, options = {}) => {
  return proxy(serviceUrl, {
    timeout: 300000,
    ...options,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      // Strip any client-supplied internal header to prevent spoofing
      delete proxyReqOpts.headers["x-internal-service-key"];

      if (srcReq.user) {
        proxyReqOpts.headers["x-user-id"] = String(srcReq.user.userId);
      }

      return proxyReqOpts;
    },
  });
};
