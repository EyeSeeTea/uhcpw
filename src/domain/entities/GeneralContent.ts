export type GeneralContent = {
    footer: FooterContent;
    aboutUs: AboutUsContent;
    cookies: CookiesDisclaimerContent;
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
