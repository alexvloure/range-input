export const isTouchDevice: () => boolean = () =>
  'touchstart' in window || navigator.maxTouchPoints > 0;
