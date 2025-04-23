import { useCallback, useEffect, useMemo, useState } from "react";
import { Option } from "../../dropdown/Option";
import { useHistory, useLocation } from "react-router-dom";
import { useAppContext } from "../../../contexts/app-context";
import useBreakpoint from "../../../common/hooks/screen/useBreakpoint";

export function useAppHeader() {
    const history = useHistory();
    const { pathname } = useLocation();
    const { compositionRoot } = useAppContext();
    const { isXs } = useBreakpoint();

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

    const goToHome = useCallback(
        (closeMenu?: boolean) => {
            history.push("/");
            if (closeMenu) {
                handleClose();
            }
        },
        [handleClose, history]
    );

    const handleMenuItemClick = useCallback(
        (link: string) => {
            history.push(link);
            handleClose();
        },
        [history, handleClose]
    );

    const handleCountryClick = useCallback(
        (country: Option<string>) => {
            history.push(`/country-page?country=${country.value}`);
            handleClose();
        },
        [handleClose, history]
    );

    const isHomePage = useMemo(() => pathname === "/", [pathname]);

    const logoWidth = useMemo(() => (isXs ? 100 : 150), [isXs]);

    useEffect(() => {
        compositionRoot.home.getRegionalReportLink.execute().run(
            regionalReportLink => setRegionalReport(regionalReportLink),
            error => {
                setRegionalReport("");
                console.error(error);
            }
        );
    }, [compositionRoot.home.getRegionalReportLink]);

    return {
        regionalReport,
        anchorEl,
        isHomePage,
        logoWidth,
        goToHome,
        handleCountryClick,
        handleMenuItemClick,
        handleClose,
        handleSetAnchorEl,
    };
}
