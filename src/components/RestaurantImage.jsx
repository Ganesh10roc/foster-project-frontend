import React, { useEffect, useState } from "react";
import { placeholderFor } from "../utils/placeholder.js";

/**
 * <img> that falls back to a tinted initial tile when the source won't load.
 *
 * The fallback lives in state rather than in an onError handler that assigns
 * to `event.currentTarget.src` — React restores `src` from props on the next
 * render, which would undo a direct DOM mutation.
 */
export default function RestaurantImage({
  src,
  name,
  className,
  wide = false,
  ...rest
}) {
  const [failed, setFailed] = useState(false);

  // A new restaurant in the same slot deserves a fresh attempt at its logo.
  useEffect(() => {
    setFailed(false);
  }, [src]);

  const resolved = !src || failed ? placeholderFor(name, { wide }) : src;

  return (
    <img
      src={resolved}
      alt={name}
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  );
}
