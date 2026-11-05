import { fullUrlForPath } from "../../../utils/fullUrlForPath";

type ReferenceLink = {
    href: string;
};

type State = {
    abbreviationsLink: ReferenceLink;
    glossaryLink: ReferenceLink;
};

export function useReferenceLinks(): State {
    return {
        abbreviationsLink: { href: fullUrlForPath("/abbreviations") },
        glossaryLink: { href: fullUrlForPath("/glossary") },
    };
}
