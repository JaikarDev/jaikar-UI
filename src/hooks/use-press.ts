import { useCallback, useState } from "react";

/**
 * Press-highlight state for touch/tablet, where there is no hover cursor.
 * Spread the returned handlers on any interactive element and style with
 * `data-pressed="true"` (see the `press-tile` utility).
 */
export function usePress() {
  const [pressed, setPressed] = useState(false);
  const clear = useCallback(() => setPressed(false), []);
  return {
    pressed,
    pressProps: {
      "data-pressed": pressed ? "true" : "false",
      onPointerDown: () => setPressed(true),
      onPointerUp: clear,
      onPointerCancel: clear,
      onPointerLeave: clear,
      onBlur: clear,
    },
  };
}
