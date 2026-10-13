import { css } from "styled-components";

// The PNG has a transparent strip on its left (3.37% of its width); the negative margin makes the visible logo start
// at the edge of its container. The logo sets its width in --who-logo-width.
export const whoLogoEdgeAlignment = css`
    margin-inline-start: calc(var(--who-logo-width) * -0.0337);
`;
