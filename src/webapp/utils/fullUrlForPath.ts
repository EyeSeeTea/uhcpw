import { appConfig } from "../../app-config";

export function fullUrlForPath(path: string): string {
    const basePath = appConfig.basePath.replace(/\/$/, "");
    return `${window.location.origin}${basePath}${path}`;
}

export function openInNewTab(path: string): void {
    window.open(fullUrlForPath(path), "_blank", "noopener,noreferrer");
}
