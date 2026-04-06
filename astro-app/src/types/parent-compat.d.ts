/**
 * Type compatibility shims for parent SPA code checked under Astro's TypeScript.
 *
 * The astro-app imports shared code from the parent SPA (../src/). Some type
 * incompatibilities arise because the parent was written against React 17 types
 * (where React.FC implicitly included `children` in props). React 18's
 * @types/react removed this implicit children prop.
 *
 * This augmentation adds an overloaded call signature to FunctionComponent that
 * includes `children`, fixing JSX call-site errors when passing children to
 * parent SPA components (e.g. tree-selector/Node).
 *
 * Note: the destructuring site inside the component function still reports
 * TS2339 because TypeScript resolves the parameter as a union of the two
 * overload signatures. This is a known limitation — we can't fully fix parent
 * files without modifying them.
 */

import "react";

declare module "react" {
    interface FunctionComponent<P = {}> {
        (props: P & { children?: React.ReactNode }): React.ReactNode;
    }
}
