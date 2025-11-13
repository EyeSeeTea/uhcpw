import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Option } from "../../dropdown/Option";
import { useHistory, useLocation } from "react-router-dom";
import { useAppContext } from "../../../contexts/app-context";
import useBreakpoint from "../../../common/hooks/screen/useBreakpoint";
import { useIsSmallScreen } from "../../../common/hooks/screen/useIsSmallScreen";
import { formatCountryOrRegionParamName } from "../../../utils/formatCountryOrRegionParamName";
import { usePageType } from "../../../pages/country-or-regional/usePageType";

export function useAppHeader(isScreenRotated?: boolean) {
    const history = useHistory();
    const { pathname } = useLocation();
    const { compositionRoot } = useAppContext();
    const { isXs } = useBreakpoint();
    const isSmallScreen = useIsSmallScreen();
    const pageType = usePageType();

    const menuRef = useRef<HTMLDivElement>(null);

    const [openForSmallScreens, setOpeForSmallScreens] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [regionalReport, setRegionalReport] = useState<string>("");

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleSetAnchorEl = useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
            setAnchorEl(event.currentTarget);
        },
        [setAnchorEl]
    );

    const onToggleForSmallScreens = useCallback(() => {
        setOpeForSmallScreens(prev => !prev);
    }, []);

    const onCloseMenu = useCallback(() => {
        setOpeForSmallScreens(false);
    }, []);

    const goToHome = useCallback(
        (closeMenu?: boolean) => {
            history.push("/");
            if (closeMenu) {
                handleClose();
                onCloseMenu();
            }
        },
        [handleClose, history, onCloseMenu]
    );

    const handleMenuItemClick = useCallback(
        (link: string) => {
            history.push(link);
            handleClose();
            onCloseMenu();
        },
        [history, handleClose, onCloseMenu]
    );

    const handleCountryClick = useCallback(
        (country: Option<string>) => {
            const countryName = country.text;
            const countryNameInFilter = formatCountryOrRegionParamName(countryName);
            history.push(`/${countryNameInFilter}`);
            handleClose();
            onCloseMenu();
        },
        [handleClose, history, onCloseMenu]
    );

    const isHomePage = useMemo(() => pathname === "/", [pathname]);

    const isCountryPage = useMemo(() => pageType === "country", [pageType]);

    const whoLogoWidth = useMemo(() => (isXs ? 100 : 150), [isXs]);

    const uhcwLogoWidth = useMemo(() => (isXs ? 130 : 180), [isXs]);

    useEffect(() => {
        compositionRoot.home.getRegionalReportLink.execute().run(
            regionalReportLink => setRegionalReport(regionalReportLink),
            error => {
                setRegionalReport("");
                console.error(error);
            }
        );
    }, [compositionRoot.home.getRegionalReportLink]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onCloseMenu();
            }
        };

        if (openForSmallScreens) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onCloseMenu, openForSmallScreens]);

    const open = useMemo(
        () => (isSmallScreen && isScreenRotated ? openForSmallScreens : Boolean(anchorEl)),
        [anchorEl, isScreenRotated, isSmallScreen, openForSmallScreens]
    );

    return {
        regionalReport,
        anchorEl,
        isHomePage,
        isCountryPage,
        whoLogoWidth,
        uhcwLogoWidth,
        menuRef,
        open,
        onToggleForSmallScreens,
        goToHome,
        handleCountryClick,
        handleMenuItemClick,
        handleClose,
        handleSetAnchorEl,
    };
}
