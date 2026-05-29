export const LEGEND_SYMBOL_SIZE = 13;
export const LEGEND_SYMBOL_RADIUS = Math.ceil(LEGEND_SYMBOL_SIZE / 2);
export const MARKER_RADIUS = LEGEND_SYMBOL_SIZE / 2;

// Highcharts auto-enables Boost (canvas raster rendering) past this series count,
// which causes pixelated markers on high-DPI screens. Raise it so dense
// "by country" charts stay in SVG mode while keeping Boost as a safety net.
export const BOOST_SERIES_THRESHOLD = 500;
