/**
 * Internal service-to-service authentication middleware.
 * Protects privileged endpoints from external or unauthorized calls.
 */
export const requireInternalAuth = (req, res, next) => {
  const internalKey = process.env.INTERNAL_SERVICE_KEY;
  const providedKey = req.headers["x-internal-service-key"];

  if (!internalKey) {
    console.error("CRITICAL: INTERNAL_SERVICE_KEY is not configured!");
    return res.status(500).json({ message: "Internal authentication not configured on server" });
  }

  if (!providedKey || providedKey !== internalKey) {
    return res.status(403).json({ message: "Forbidden: invalid or missing internal service key" });
  }

  next();
};

export const getInternalAuthHeaders = () => {
  return {
    "x-internal-service-key": process.env.INTERNAL_SERVICE_KEY || "",
  };
};
