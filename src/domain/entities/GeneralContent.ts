import { Maybe } from "../../types/utils";

export type GeneralContent = {
    footer: FooterContent;
    aboutUs: AboutUsContent;
    cookies: CookiesDisclaimerContent;
    abbreviations: FileContent;
    glossary: FileContent;
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

type FileContent = {
    file: Maybe<File>;
};

export type File = {
    name: string;
    contentType: string;
    content: Blob;
};
