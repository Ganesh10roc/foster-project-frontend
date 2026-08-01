// Security: Rate limiting to prevent brute force attacks
// OWASP: Implement rate limiting on critical operations

class RateLimiter {
  constructor() {
    this.attempts = {}; // { 'key': [timestamp1, timestamp2, ...] }
  }

  /**
   * Check if action is rate limited
   * @param {string} key - Unique identifier (e.g., phone number)
   * @param {number} maxAttempts - Max attempts allowed
   * @param {number} windowMs - Time window in milliseconds
   * @returns {object} { allowed: boolean, remaining: number, retryAfter: number }
   */
  checkLimit(key, maxAttempts = 5, windowMs = 15 * 60 * 1000) {
    if (!key) return { allowed: false, remaining: 0, retryAfter: 0 };

    const now = Date.now();
    if (!this.attempts[key]) {
      this.attempts[key] = [];
    }

    // Remove old attempts outside the window
    this.attempts[key] = this.attempts[key].filter(
      (timestamp) => now - timestamp < windowMs
    );

    const currentAttempts = this.attempts[key].length;

    if (currentAttempts >= maxAttempts) {
      // Rate limited
      const oldestAttempt = this.attempts[key][0];
      const retryAfter = Math.ceil((windowMs - (now - oldestAttempt)) / 1000);
      return {
        allowed: false,
        remaining: 0,
        retryAfter: retryAfter,
        message: `Too many attempts. Please try again in ${retryAfter} seconds.`,
      };
    }

    // Record this attempt
    this.attempts[key].push(now);

    return {
      allowed: true,
      remaining: maxAttempts - currentAttempts - 1,
      retryAfter: 0,
      message: "",
    };
  }

  /**
   * Reset rate limit for a key
   */
  reset(key) {
    delete this.attempts[key];
  }

  /**
   * Clear all rate limits
   */
  clearAll() {
    this.attempts = {};
  }
}

// Singleton instance
const rateLimiter = new RateLimiter();

// Common rate limit configurations
export const RATE_LIMITS = {
  OTP_REQUEST: { maxAttempts: 3, windowMs: 5 * 60 * 1000 }, // 3 requests per 5 minutes
  OTP_VERIFICATION: { maxAttempts: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
  CHECKOUT: { maxAttempts: 10, windowMs: 60 * 1000 }, // 10 checkouts per minute
  API_GENERAL: { maxAttempts: 100, windowMs: 60 * 1000 }, // 100 requests per minute
};

export default rateLimiter;
