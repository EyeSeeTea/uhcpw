/// <reference types="@welldone-software/why-did-you-render" />

import React from "react";

export async function initializeProfiling() {
    const { default: whyDidYouRender } = await import("@welldone-software/why-did-you-render");
    whyDidYouRender(React, {
        trackAllPureComponents: true,
    });
}
