// constants.ts
export const TICK_MS = 500;
export const TOTAL_SECONDS = 20;
export const TOTAL_STEPS = (TOTAL_SECONDS * 1000) / TICK_MS; // 40

// Log order (left → right)
export const LOG_ORDER = [
  "b6", "b3", "b7", "4", "1", "5", "2", "6", "3", "7",
];

// Draft irrational digits (π, 40 digits)
export const DIGITS =
  "3141592653589793238462643383279502884197";

// Flame limits
export const MAX_FLAMES_PER_LOG = 4;