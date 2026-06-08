import "./bootstrapPublicPath";
import "./webapp/utils/wdyr";
import { Provider } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import { init } from "d2";
import _ from "lodash";
import ReactDOM from "react-dom";
import { Instance } from "./data/entities/Instance";
import { getD2APiFromInstance } from "./utils/d2-api";
import { App } from "./webapp/pages/app/App";
import { D2Api } from "./types/d2-api";
import CircularProgress from "@material-ui/core/CircularProgress";
import { colors } from "./webapp/pages/app/themes/dhis2.theme";

declare global {
    interface Window {
        api: D2Api;
    }
}

// DHIS2 launches the app at `/api/apps/<name>/index.html`; strip the trailing
// `index.html` so BrowserRouter sees the canonical `/` route instead of an
// unmatched path.
if (window.location.pathname.endsWith("/index.html")) {
    const stripped = window.location.pathname.slice(0, -"index.html".length);
    window.history.replaceState(null, "", stripped + window.location.search + window.location.hash);
}

const isDev = process.env.NODE_ENV === "development";

async function getBaseUrl() {
    if (isDev) {
        return "/dhis2"; // See src/setupProxy.js
    } else {
        const manifest = await fetch("manifest.webapp").then(res => res.json());
        return manifest.activities.dhis.href;
    }
}

const isLangRTL = (code: string) => {
    const langs = ["ar", "fa", "ur"];
    const prefixed = langs.map(c => `${c}-`);
    return _(langs).includes(code) || prefixed.filter(c => code && code.startsWith(c)).length > 0;
};

const configI18n = ({ keyUiLocale }: { keyUiLocale: string }) => {
    i18n.changeLanguage(keyUiLocale);
    document.documentElement.setAttribute("dir", isLangRTL(keyUiLocale) ? "rtl" : "ltr");
};

const Loading: React.FC = () => {
    return (
        <div
            style={{
                height: "200px",
                display: "flex",
                position: "relative",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <CircularProgress style={{ color: colors.accentPrimary }} />
        </div>
    );
};

async function main() {
    ReactDOM.render(<Loading />, document.getElementById("root"));

    const baseUrl = await getBaseUrl();

    try {
        const d2 = await init({ baseUrl: baseUrl + "/api", schemas: [] });
        const instance = new Instance({ url: baseUrl });
        const api = getD2APiFromInstance(instance);
        if (isDev) window.api = api;

        const userSettings = await api.get<{ keyUiLocale: string }>("/userSettings").getData();
        configI18n(userSettings);

        ReactDOM.render(
            <Provider config={{ baseUrl, apiVersion: 30 }}>
                <App api={api} d2={d2} instance={instance} />
            </Provider>,
            document.getElementById("root")
        );
    } catch (err) {
        console.error(err);
        const error = `${err}`;
        const feedback = error.match("Unable to get schemas") ? (
            <h3 style={{ margin: 20 }}>
                <a rel="noopener noreferrer" target="_blank" href={baseUrl}>
                    Login
                </a>
            </h3>
        ) : (
            <h3>{error}</h3>
        );
        ReactDOM.render(<div>{feedback}</div>, document.getElementById("root"));
    }
}

main();
