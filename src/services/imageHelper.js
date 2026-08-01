// High-quality food images - All actual dishes, consistent across views
const PREMIUM_FOOD_IMAGES = {
  pizza: [
    "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=600&h=400&fit=crop&q=85&auto=format",
    "https://images.unsplash.com/photo-1528840042246-12123dd332d7?w=600&h=400&fit=crop&q=85&auto=format",
  ],
  burger: [
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop&q=85&auto=format",
    "https://images.unsplash.com/photo-1550547990-25967503ec28?w=600&h=400&fit=crop&q=85&auto=format",
  ],
  biryani: [
    "https://images.unsplash.com/photo-1585521537066-5e3fbe96a3f5?w=600&h=400&fit=crop&q=85&auto=format",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop&q=85&auto=format",
  ],
  chinese: [
    "https://images.unsplash.com/photo-1585521537066-5e3fbe96a3f5?w=600&h=400&fit=crop&q=85&auto=format",
    "https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=600&h=400&fit=crop&q=85&auto=format",
  ],
  indian: [
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop&q=85&auto=format",
    "https://images.unsplash.com/photo-1596040694117-ca1f60531033?w=600&h=400&fit=crop&q=85&auto=format",
  ],
  continental: [
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop&q=85&auto=format",
    "https://images.unsplash.com/photo-1547521064-7290893494e1?w=600&h=400&fit=crop&q=85&auto=format",
  ],
  desserts: [
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop&q=85&auto=format",
    "https://images.unsplash.com/photo-1578519034014-ae4a0ea0a79e?w=600&h=400&fit=crop&q=85&auto=format",
  ],
  cafe: [
    "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&h=400&fit=crop&q=85&auto=format",
    "https://images.unsplash.com/photo-1559056199-641a0ac8b3f4?w=600&h=400&fit=crop&q=85&auto=format",
  ],
  bakery: [
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop&q=85&auto=format",
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop&q=85&auto=format",
  ],
  seafood: [
    "https://images.unsplash.com/photo-1580959375944-abd7e991d971?w=600&h=400&fit=crop&q=85&auto=format",
    "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&h=400&fit=crop&q=85&auto=format",
  ],
  noodles: [
    "https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=600&h=400&fit=crop&q=85&auto=format",
    "https://images.unsplash.com/photo-1626082927389-6cd097cda687?w=600&h=400&fit=crop&q=85&auto=format",
  ],
  curry: [
    "https://images.unsplash.com/photo-1596040694117-ca1f60531033?w=600&h=400&fit=crop&q=85&auto=format",
    "https://images.unsplash.com/photo-1585521537066-5e3fbe96a3f5?w=600&h=400&fit=crop&q=85&auto=format",
  ],
  soup: [
    "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop&q=85&auto=format",
    "https://images.unsplash.com/photo-1476124369162-f4978d4b012f?w=600&h=400&fit=crop&q=85&auto=format",
  ],
};

// Consistent fallback food images (all actual dishes)
const FALLBACK_FOOD_IMAGES = [
  "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600&h=400&fit=crop&q=85&auto=format", // plate
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop&q=85&auto=format", // salad
  "https://images.unsplash.com/photo-1504674900306-873d5cfd7f94?w=600&h=400&fit=crop&q=85&auto=format", // noodles
  "https://images.unsplash.com/photo-1493516861933-586cb221d7d7?w=600&h=400&fit=crop&q=85&auto=format", // dish
  "https://images.unsplash.com/photo-1511689915659-309d19dda911?w=600&h=400&fit=crop&q=85&auto=format", // curry
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop&q=85&auto=format", // burger
  "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=600&h=400&fit=crop&q=85&auto=format", // pizza
  "https://images.unsplash.com/photo-1585521537066-5e3fbe96a3f5?w=600&h=400&fit=crop&q=85&auto=format", // food
  "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop&q=85&auto=format", // platter
  "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop&q=85&auto=format", // dessert
];

// Cache to ensure same restaurant always shows same image
const imageCache = new Map();

export function getRestaurantImage(restaurant, index = 0) {
  // Check cache first - ensures consistency across views
  const cacheKey = `${restaurant.id || restaurant.name}`;
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey);
  }

  let selectedImage = null;

  // Try restaurant's own logo first
  if (restaurant.logo && isValidUrl(restaurant.logo) && isActualFoodImage(restaurant.logo)) {
    selectedImage = restaurant.logo;
  }

  // Try by cuisine type
  if (!selectedImage) {
    const cuisine = String(restaurant.cuisine || "").toLowerCase().trim();
    if (cuisine && PREMIUM_FOOD_IMAGES[cuisine]) {
      const images = PREMIUM_FOOD_IMAGES[cuisine];
      selectedImage = images[(index || 0) % images.length];
    }
  }

  // Try by restaurant name matching cuisine keywords
  if (!selectedImage) {
    const name = String(restaurant.name || "").toLowerCase();
    for (const [key, images] of Object.entries(PREMIUM_FOOD_IMAGES)) {
      if (name.includes(key)) {
        selectedImage = images[(index || 0) % images.length];
        break;
      }
    }
  }

  // Use consistent fallback image based on restaurant ID
  if (!selectedImage) {
    const fallbackIndex = (index || 0) % FALLBACK_FOOD_IMAGES.length;
    selectedImage = FALLBACK_FOOD_IMAGES[fallbackIndex];
  }

  // Cache the selected image for this restaurant
  imageCache.set(cacheKey, selectedImage);
  return selectedImage;
}

export function getRestaurantBackground(restaurant, index) {
  const image = getRestaurantImage(restaurant, index);
  return `linear-gradient(135deg, rgba(15, 23, 42, 0.85), rgba(30, 41, 59, 0.85)), url('${image}')`;
}

function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// Filter out non-food images (phones, devices, etc.)
function isActualFoodImage(url) {
  const nonFoodKeywords = ['phone', 'device', 'tablet', 'screen', 'display', 'laptop', 'computer', 'kitchen-tool', 'utensil'];
  const lowerUrl = String(url).toLowerCase();
  return !nonFoodKeywords.some(keyword => lowerUrl.includes(keyword));
}

export function restaurantWithImage(restaurant, index) {
  return {
    ...restaurant,
    image: getRestaurantImage(restaurant, index),
  };
}
