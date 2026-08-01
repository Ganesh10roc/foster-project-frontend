// Security: Configuration for HTTP security headers
// These should be implemented on the server/backend

export const SECURITY_HEADERS = {
  // Content Security Policy: Prevent XSS attacks
  "Content-Security-Policy":
    "default-src 'self'; " +
    "script-src 'self'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self'; " +
    "connect-src 'self' https://api.example.com; " +
    "frame-ancestors 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self'",

  // HTTP Strict Transport Security: Force HTTPS
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",

  // Prevent clickjacking
  "X-Frame-Options": "DENY",

  // Prevent MIME type sniffing
  "X-Content-Type-Options": "nosniff",

  // Enable XSS protection
  "X-XSS-Protection": "1; mode=block",

  // Referrer Policy: Limit referrer information
  "Referrer-Policy": "strict-origin-when-cross-origin",

  // Feature Policy: Control browser features
  "Permissions-Policy": "geolocation=(), microphone=(), camera=()",

  // Prevent caching of sensitive data
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

/**
 * Application-level security configuration
 */
export const SECURITY_CONFIG = {
  // CSRF Protection
  CSRF_TOKEN_HEADER: "X-CSRF-Token",
  CSRF_TOKEN_COOKIE: "csrf-token",

  // Session Security
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours

  // Password/Auth Security
  MIN_PASSWORD_LENGTH: 8,
  REQUIRE_UPPERCASE: true,
  REQUIRE_NUMBERS: true,
  REQUIRE_SPECIAL_CHARS: true,

  // API Security
  API_TIMEOUT: 10000, // 10 seconds
  ENABLE_API_RATE_LIMITING: true,
  MAX_REQUESTS_PER_MINUTE: 100,

  // Content Security
  ALLOWED_IMAGE_DOMAINS: [
    "images.unsplash.com",
    "cdn.example.com",
  ],

  // Sensitive fields that should never be logged
  SENSITIVE_FIELDS: [
    "password",
    "token",
    "creditCard",
    "cvv",
    "ssn",
    "apiKey",
    "secret",
  ],
};

/**
 * Logging configuration - what can and cannot be logged
 */
export const LOGGING_CONFIG = {
  // Do NOT log these fields
  blacklist: [
    "password",
    "token",
    "accessToken",
    "refreshToken",
    "creditCard",
    "cvv",
    "ssn",
    "apiKey",
    "secret",
    "authorization",
  ],

  // Can log these with caution
  sensitive: [
    "email",
    "phone",
    "address",
    "name",
  ],

  // Safe to log
  safe: [
    "action",
    "status",
    "timestamp",
    "userId",
    "endpoint",
    "method",
  ],
};

/**
 * Get security headers for API requests
 */
export function getSecurityHeaders() {
  return {
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/json",
    // Add CSRF token if available
    [SECURITY_CONFIG.CSRF_TOKEN_HEADER]: getCsrfToken(),
  };
}

/**
 * Get CSRF token from cookie
 */
export function getCsrfToken() {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    const [name, value] = cookie.split("=");
    if (name === SECURITY_CONFIG.CSRF_TOKEN_COOKIE) {
      return decodeURIComponent(value);
    }
  }
  return "";
}

/**
 * Check if data is sensitive and should not be logged
 */
export function isSensitiveData(key) {
  const lowerKey = key.toLowerCase();
  return LOGGING_CONFIG.blacklist.some(
    (sensitiveKey) => lowerKey.includes(sensitiveKey)
  );
}

/**
 * Sanitize data before logging (remove sensitive fields)
 */
export function sanitizeForLogging(data) {
  if (typeof data !== "object" || data === null) return data;

  const sanitized = { ...data };
  for (const key in sanitized) {
    if (isSensitiveData(key)) {
      sanitized[key] = "[REDACTED]";
    }
  }
  return sanitized;
}

export default {
  SECURITY_HEADERS,
  SECURITY_CONFIG,
  LOGGING_CONFIG,
  getSecurityHeaders,
  getCsrfToken,
  isSensitiveData,
  sanitizeForLogging,
};
