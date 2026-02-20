// lib/timelineScale.ts

// Constants for the timeline span
export const TIMELINE_MIN = -10000;
export const TIMELINE_MAX = 2026;

// The pivot points
// PIVOT 1: The invention of writing (approx 3200 BC)
export const PIVOT_1 = -3200;
// PIVOT 2: Year 0
export const PIVOT_2 = 0;

// The percentage of the slider width for each segment
export const WIDTH_1 = 100 / 6; // ~16.66% (TIMELINE_MIN to PIVOT_1)
export const WIDTH_2 = 100 / 6; // ~16.66% (PIVOT_1 to PIVOT_2)
export const WIDTH_3 = 100 * (4 / 6); // ~66.66% (PIVOT_2 to TIMELINE_MAX)

/**
 * Converts a historical year to a percentage value (0-100) for the slider.
 * Uses a 3-segment piecewise linear scale.
 */
export function yearToPercent(year: number): number {
    // Clamp the year
    const safeYear = Math.max(TIMELINE_MIN, Math.min(TIMELINE_MAX, year));

    if (safeYear <= PIVOT_1) {
        // Segment 1: [TIMELINE_MIN, PIVOT_1] -> [0, WIDTH_1]
        const range = PIVOT_1 - TIMELINE_MIN;
        const offset = safeYear - TIMELINE_MIN;
        return (offset / range) * WIDTH_1;
    } else if (safeYear <= PIVOT_2) {
        // Segment 2: [PIVOT_1, PIVOT_2] -> [WIDTH_1, WIDTH_1 + WIDTH_2]
        const range = PIVOT_2 - PIVOT_1;
        const offset = safeYear - PIVOT_1;
        return WIDTH_1 + ((offset / range) * WIDTH_2);
    } else {
        // Segment 3: [PIVOT_2, TIMELINE_MAX] -> [WIDTH_1 + WIDTH_2, 100]
        const range = TIMELINE_MAX - PIVOT_2;
        const offset = safeYear - PIVOT_2;
        return WIDTH_1 + WIDTH_2 + ((offset / range) * WIDTH_3);
    }
}

/**
 * Converts a percentage value (0-100) from the slider back to a historical year.
 * Uses a 3-segment piecewise linear scale.
 */
export function percentToYear(percent: number): number {
    // Clamp the percent
    const safePercent = Math.max(0, Math.min(100, percent));

    if (safePercent <= WIDTH_1) {
        // Segment 1: [0, WIDTH_1] -> [TIMELINE_MIN, PIVOT_1]
        const ratio = safePercent / WIDTH_1;
        const range = PIVOT_1 - TIMELINE_MIN;
        return Math.round(TIMELINE_MIN + (ratio * range));
    } else if (safePercent <= WIDTH_1 + WIDTH_2) {
        // Segment 2: [WIDTH_1, WIDTH_1 + WIDTH_2] -> [PIVOT_1, PIVOT_2]
        const ratio = (safePercent - WIDTH_1) / WIDTH_2;
        const range = PIVOT_2 - PIVOT_1;
        return Math.round(PIVOT_1 + (ratio * range));
    } else {
        // Segment 3: [WIDTH_1 + WIDTH_2, 100] -> [PIVOT_2, TIMELINE_MAX]
        const ratio = (safePercent - (WIDTH_1 + WIDTH_2)) / WIDTH_3;
        const range = TIMELINE_MAX - PIVOT_2;
        return Math.round(PIVOT_2 + (ratio * range));
    }
}
