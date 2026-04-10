export const appConfig: AppConfig = {
    appKey: "uhcpw-app",
    gaTagId: "G-NMLFDE4DY7", // Prod: G-NMLFDE4DY7, Dev: G-5DKB563RGC
    basePath: process.env.REACT_APP_BASE_PATH || "/",
};

export interface AppConfig {
    appKey: string;
    gaTagId: string;
    basePath: string;
}
