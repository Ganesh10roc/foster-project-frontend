// Security: Input sanitization to prevent XSS attacks
// OWASP: Always sanitize user-supplied data before rendering

const DANGEROUS_CHARS = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
};

/**
 * Escapes HTML special characters to prevent XSS
 * @param {string} input - User input to sanitize
 * @returns {string} Sanitized string safe for HTML rendering
 */
export function sanitizeHtml(input) {
  if (!input || typeof input !== "string") return "";
  return input.replace(/[&<>"'\/]/g, (char) => DANGEROUS_CHARS[char] || char);
}

/**
 * Validates and sanitizes phone numbers
 * @param {string} phone - Phone number input
 * @returns {string} Sanitized phone number (only digits)
 */
export function sanitizePhoneNumber(phone) {
  if (!phone || typeof phone !== "string") return "";
  // Remove all non-digit characters
  return phone.replace(/\D/g, "");
}

/**
 * Validates and sanitizes OTP code
 * @param {string} otp - OTP input
 * @returns {string} Sanitized OTP (only digits)
 */
export function sanitizeOTP(otp) {
  if (!otp || typeof otp !== "string") return "";
  // Remove all non-digit characters
  return otp.replace(/\D/g, "");
}

/**
 * Validates and sanitizes search queries
 * @param {string} search - Search query
 * @returns {string} Sanitized search string
 */
export function sanitizeSearch(search) {
  if (!search || typeof search !== "string") return "";
  // Remove dangerous characters, limit length
  const cleaned = search.replace(/[&<>"'\/]/g, (char) => DANGEROUS_CHARS[char] || char);
  return cleaned.substring(0, 100); // Max 100 chars
}

/**
 * Validates email format (basic)
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email format
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates Indian phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Is valid Indian mobile number
 */
export function isValidIndianPhone(phone) {
  if (!phone || typeof phone !== "string") return false;
  // Indian mobile numbers: 10 digits, starting with 6-9
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.trim());
}

/**
 * Validates OTP format
 * @param {string} otp - OTP to validate
 * @returns {boolean} Is valid 6-digit OTP
 */
export function isValidOTP(otp) {
  if (!otp || typeof otp !== "string") return false;
  return /^\d{6}$/.test(otp.trim());
}

/**
 * Prevents DOM-based XSS by validating URLs
 * @param {string} url - URL to validate
 * @returns {boolean} Is valid safe URL
 */
export function isValidUrl(url) {
  if (!url || typeof url !== "string") return false;
  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Security: Content Security Policy helper
 * Validates script execution contexts
 */
export const CSP_DIRECTIVES = {
  "default-src": "'self'",
  "script-src": "'self' 'unsafe-inline'", // TODO: Remove unsafe-inline in production
  "style-src": "'self' 'unsafe-inline'",
  "img-src": "'self' data: https:",
  "font-src": "'self' data:",
  "connect-src": "'self' https://api.example.com",
  "frame-ancestors": "'none'",
  "base-uri": "'self'",
  "form-action": "'self'",
};

export default {
  sanitizeHtml,
  sanitizePhoneNumber,
  sanitizeOTP,
  sanitizeSearch,
  isValidEmail,
  isValidIndianPhone,
  isValidOTP,
  isValidUrl,
};
