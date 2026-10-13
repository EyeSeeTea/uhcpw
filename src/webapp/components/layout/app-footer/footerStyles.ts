import { css } from "styled-components";

// The client's line breaks need columns at least 370px wide: three of them, the gaps, the side padding and the scrollbar
// take 1320px. Below that the desktop footer lets its texts flow and wrap like any other paragraph.
export const narrowDesktopFooterQuery = "(max-width: 1319px)";

// The PNG has a transparent strip on its left (3.37% of its width); the negative margin makes the visible logo start
// at the edge of its container. The logo sets its width in --who-logo-width.
export const whoLogoEdgeAlignment = css`
    margin-inline-start: calc(var(--who-logo-width) * -0.0337);
`;
