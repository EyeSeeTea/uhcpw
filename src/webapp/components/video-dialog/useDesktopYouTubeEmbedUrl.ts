import { getYouTubeEmbedUrl } from "../../../domain/entities/YouTubeVideo";
import { Maybe } from "../../../types/utils";
import { useIsSmallScreen } from "../../common/hooks/screen/useIsSmallScreen";

export function useDesktopYouTubeEmbedUrl(link: Maybe<string>): Maybe<string> {
    const isSmallScreen = useIsSmallScreen();
    return link && !isSmallScreen ? getYouTubeEmbedUrl(link) : undefined;
}
