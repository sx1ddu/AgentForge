/**
 * Centralized, secure error handler for AgentForge microservices.
 * Prevents stack trace and sensitive credential leakage in responses.
 */
export const errorHandler = (err, req, res, next) => {
  const isProduction = process.env.NODE_ENV === "production";

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error(`[ERROR] ${req.method} ${req.originalUrl || req.url}:`, {
    message: err.message,
    status: statusCode,
    stack: isProduction ? undefined : err.stack,
  });

  return res.status(statusCode).json({
    success: false,
    message: isProduction && statusCode === 500 ? "Internal server error occurred. Please try again later." : message,
    data: err.data || undefined,
    errors: err.errors || undefined,
  });
};
