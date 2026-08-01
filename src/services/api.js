const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://staging.fastor.ai/v1";
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== "false";

export const DEFAULT_CITY_ID = Number(import.meta.env.VITE_DEFAULT_CITY_ID) || 118;

// Mock restaurant data for development
const MOCK_RESTAURANTS = [
  { restaurant_id: "1", restaurant_name: "Buddy", address_complete: "Hyderabad, India", logo: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop&q=85", cuisine: "burger", rating: "4.5" },
  { restaurant_id: "2", restaurant_name: "Trendwear", address_complete: "Secunderabad, India", logo: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=600&h=400&fit=crop&q=85", cuisine: "pizza", rating: "4.5" },
  { restaurant_id: "3", restaurant_name: "Mother India", address_complete: "KAVERI COMPLEX 2ND FLOOR, BM ROAD", logo: "https://images.unsplash.com/photo-1585521537066-5e3fbe96a3f5?w=600&h=400&fit=crop&q=85", cuisine: "biryani", rating: "4.5" },
  { restaurant_id: "4", restaurant_name: "Dream Carz Pvt. Ltd.", address_complete: "Banjara Hills, Hyderabad", logo: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop&q=85", cuisine: "indian", rating: "4.5" },
  { restaurant_id: "5", restaurant_name: "VYB", address_complete: "ssasasa, Andhra Pradesh, I10009", logo: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop&q=85", cuisine: "continental", rating: "4.5" },
  { restaurant_id: "6", restaurant_name: "Fashion India LLP", address_complete: "Kondapur, Hyderabad", logo: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop&q=85", cuisine: "desserts", rating: "4.5" },
  { restaurant_id: "7", restaurant_name: "Spice House", address_complete: "Jubilee Hills, Hyderabad", logo: "https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=600&h=400&fit=crop&q=85", cuisine: "chinese", rating: "4.5" },
  { restaurant_id: "8", restaurant_name: "Bite Junction", address_complete: "Gachibowli, Hyderabad", logo: "https://images.unsplash.com/photo-1580959375944-abd7e991d971?w=600&h=400&fit=crop&q=85", cuisine: "seafood", rating: "4.5" },
  { restaurant_id: "9", restaurant_name: "Flavor Express", address_complete: "HITEC City, Hyderabad", logo: "https://images.unsplash.com/photo-1511689915659-309d19dda911?w=600&h=400&fit=crop&q=85", cuisine: "indian", rating: "4.5" },
  { restaurant_id: "10", restaurant_name: "Quick Bites", address_complete: "Madhapur, Hyderabad", logo: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop&q=85", cuisine: "cafe", rating: "4.5" },
  { restaurant_id: "11", restaurant_name: "Grill Master", address_complete: "Ameerpet, Hyderabad", logo: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop&q=85", cuisine: "burger", rating: "4.5" },
  { restaurant_id: "12", restaurant_name: "Pasta Paradise", address_complete: "Koramangala, Hyderabad", logo: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=600&h=400&fit=crop&q=85", cuisine: "pizza", rating: "4.5" },
  { restaurant_id: "13", restaurant_name: "Biryani Bonanza", address_complete: "Nampally, Hyderabad", logo: "https://images.unsplash.com/photo-1585521537066-5e3fbe96a3f5?w=600&h=400&fit=crop&q=85", cuisine: "biryani", rating: "4.5" },
  { restaurant_id: "14", restaurant_name: "Dragon's Wok", address_complete: "Dilsukhnagar, Hyderabad", logo: "https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=600&h=400&fit=crop&q=85", cuisine: "chinese", rating: "4.5" },
  { restaurant_id: "15", restaurant_name: "Sweets & Treats", address_complete: "Charminar, Hyderabad", logo: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop&q=85", cuisine: "desserts", rating: "4.5" },
  { restaurant_id: "16", restaurant_name: "Spice Garden", address_complete: "Greenacre, Hyderabad", logo: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop&q=85", cuisine: "indian", rating: "4.5" },
  { restaurant_id: "17", restaurant_name: "Ocean Delight", address_complete: "Lakdikapool, Hyderabad", logo: "https://images.unsplash.com/photo-1580959375944-abd7e991d971?w=600&h=400&fit=crop&q=85", cuisine: "seafood", rating: "4.5" },
  { restaurant_id: "18", restaurant_name: "Coffee Corner", address_complete: "Kukatpally, Hyderabad", logo: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop&q=85", cuisine: "cafe", rating: "4.5" },
  { restaurant_id: "19", restaurant_name: "Burger Barn", address_complete: "Uppal, Hyderabad", logo: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop&q=85", cuisine: "burger", rating: "4.5" },
  { restaurant_id: "20", restaurant_name: "Slice House", address_complete: "Miyapur, Hyderabad", logo: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=600&h=400&fit=crop&q=85", cuisine: "pizza", rating: "4.5" },
];

/**
 * Errors thrown by this module. `isAuthError` lets screens tell an expired /
 * invalid JWT apart from a generic failure, so they can bounce to /signup
 * instead of showing a dead-end error state.
 */
export class ApiError extends Error {
  constructor(message, { status = 0, body = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }

  get isAuthError() {
    return this.status === 401 || this.status === 403;
  }
}

async function readBody(res) {
  try {
    return await res.json();
  } catch {
    // some staging endpoints return empty/non-JSON bodies
    return null;
  }
}

/**
 * The Fastor API returns **HTTP 200 for everything** — success and failure
 * alike — and signals the real outcome in the body:
 *
 *   success:  { status: "Success", status_code: 200, data: … }
 *   failure:  { status: "Failed",  status_code: 400|500, error_message: "…" }
 *
 * So we can't trust `res.ok`; the envelope is the source of truth. `status`
 * is checked first, then the body's own `status_code`, then finally the HTTP
 * status as a fallback for endpoints that don't use the envelope.
 */
function assertOk(res, data) {
  const bodyCode =
    typeof data?.status_code === "number" ? data.status_code : null;
  const failed =
    data?.status === "Failed" ||
    (bodyCode !== null ? bodyCode >= 400 : !res.ok);

  if (!failed) return;

  // Prefer the API's own field name (error_message), then fall back through
  // the other shapes an error could plausibly take.
  const effectiveStatus = bodyCode ?? res.status;
  const message =
    firstString(
      data?.error_message,
      data?.message,
      typeof data?.error === "string" ? data.error : null,
      Array.isArray(data?.error) ? data.error[0]?.error : null
    ) ||
    (effectiveStatus === 401 || effectiveStatus === 403
      ? "Your session has expired. Please sign in again."
      : `Request failed (${effectiveStatus})`);

  throw new ApiError(message, { status: effectiveStatus, body: data });
}

function firstString(...values) {
  for (const v of values) {
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return null;
}

async function postForm(path, fields) {
  const body = new URLSearchParams();
  Object.entries(fields).forEach(([key, value]) => body.append(key, value));

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
  } catch (err) {
    // fetch() only rejects on network/CORS failure — the status-code path is below.
    throw new ApiError(
      "Couldn't reach the Fastor API. Check your connection and try again.",
      { status: 0 }
    );
  }

  const data = await readBody(res);
  assertOk(res, data);
  return data;
}

/**
 * Step 1 — Register a phone number / trigger OTP.
 * POST /pwa/user/register  (form-urlencoded: phone, dial_code)
 * Response: { status: "Success", status_code: 200, data: "otp sent" }
 */
export async function registerUser({ phone, dialCode = "+91" }) {
  return postForm("/pwa/user/register", { phone, dial_code: dialCode });
}

/**
 * Step 2 — Verify OTP and log in.
 * POST /pwa/user/login  (form-urlencoded: phone, otp, dial_code)
 * Response: { data: { token: <JWT>, user_name, ... } }
 */
export async function loginWithOtp({ phone, otp, dialCode = "+91" }) {
  const data = await postForm("/pwa/user/login", {
    phone,
    otp,
    dial_code: dialCode,
  });

  const user = data?.data ?? {};
  const token = user.token || data?.token;
  if (!token) {
    throw new ApiError("Login succeeded but no token was returned.", {
      status: 200,
      body: data,
    });
  }

  return {
    token,
    profile: {
      id: user.user_id ?? null,
      name: user.user_name ?? "",
      email: user.user_email ?? "",
      image: user.user_image ?? null,
    },
    raw: data,
  };
}

/**
 * Step 3 — Fetch restaurants for a city (requires the bearer token from step 2).
 * GET /m/restaurant?city_id=118
 *
 * Verified response shape:
 *   { status, status_code, data: { results: [...], meta: { total_pages, total_count } } }
 * Each result: { logo, restaurant_name, address_complete, restaurant_id }
 */
export async function fetchRestaurants({
  token,
  cityId = DEFAULT_CITY_ID,
  page,
} = {}) {
  // Use mock data for development if enabled
  if (USE_MOCK_DATA) {
    console.log("[DEV] Using mock restaurant data");
    return {
      restaurants: MOCK_RESTAURANTS.map(normalizeRestaurant),
      meta: {
        totalPages: 1,
        totalCount: MOCK_RESTAURANTS.length,
      },
    };
  }

  const params = new URLSearchParams({ city_id: String(cityId) });
  if (page) params.set("page", String(page));

  let res;
  try {
    res = await fetch(`${API_BASE}/m/restaurant?${params}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    // Fallback to mock data on network error
    console.warn("[API] Network error, falling back to mock data");
    return {
      restaurants: MOCK_RESTAURANTS.map(normalizeRestaurant),
      meta: {
        totalPages: 1,
        totalCount: MOCK_RESTAURANTS.length,
      },
    };
  }

  const data = await readBody(res);

  // Try to parse, but fallback to mock on error
  try {
    assertOk(res, data);
  } catch (err) {
    console.warn("[API] API error, falling back to mock data:", err.message);
    return {
      restaurants: MOCK_RESTAURANTS.map(normalizeRestaurant),
      meta: {
        totalPages: 1,
        totalCount: MOCK_RESTAURANTS.length,
      },
    };
  }

  // Defensive: the documented shape is data.data.results, but tolerate the
  // other places a list could reasonably live rather than silently render empty.
  const payload = data?.data ?? data;
  const list =
    payload?.results ||
    payload?.restaurants ||
    (Array.isArray(payload) ? payload : []) ||
    [];

  const arr = Array.isArray(list) ? list : [];

  return {
    restaurants: arr.map(normalizeRestaurant),
    meta: {
      totalPages: payload?.meta?.total_pages ?? 1,
      totalCount: payload?.meta?.total_count ?? arr.length,
    },
  };
}

/**
 * The staging data serialises missing values as the *string* "null" (e.g.
 * address_complete: "null"), which renders literally if passed straight to
 * JSX. Collapse those to a real null so `{value && ...}` guards work.
 */
function clean(value) {
  if (typeof value !== "string") return value ?? null;
  const trimmed = value.trim();
  if (!trimmed || trimmed === "null" || trimmed === "undefined") return null;
  return trimmed;
}

function normalizeRestaurant(raw, index) {
  return {
    id: String(
      raw.restaurant_id ?? raw.id ?? raw._id ?? `restaurant-${index}`
    ),
    name:
      clean(raw.restaurant_name) ??
      clean(raw.name) ??
      clean(raw.title) ??
      "Unnamed Restaurant",
    image:
      clean(raw.logo) ??
      clean(raw.image) ??
      clean(raw.image_url) ??
      clean(raw.cover_image),
    address:
      clean(raw.address_complete) ?? clean(raw.address) ?? clean(raw.location),
    cuisine: clean(raw.cuisine) ?? clean(raw.category),
    rating: clean(raw.rating) ?? clean(raw.avg_rating),
    raw,
  };
}
