import { Maybe } from "../../types/utils";

export type GeneralContent = {
    footer: FooterContent;
    aboutUs: AboutUsContent;
    cookies: CookiesDisclaimerContent;
    abbreviations: FileUrl;
    glossary: FileUrl;
};

export type FooterContent = {
    disclaimer: string;
};

export type AboutUsContent = {
    title: string;
    subtitle: string;
};

export type CookiesDisclaimerContent = {
    policyUrl: string;
};

export type FileUrl = {
    url: Maybe<string>;
};
