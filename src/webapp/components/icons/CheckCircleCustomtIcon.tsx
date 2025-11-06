import { SvgIcon } from "material-ui";

import { colors } from "../../pages/app/themes/dhis2.theme";

type CheckCircleCustomtIconPProps = {
    circleColor?: string;
    tickColor?: string;
    width?: string;
    height?: string;
};

export const CheckCircleCustomtIcon: React.FC<CheckCircleCustomtIconPProps> = props => {
    const { circleColor, tickColor, width, height } = props;

    return (
        <SvgIcon
            {...props}
            style={{
                width: width ? width : "24px",
                height: height ? height : "24px",
            }}
            viewBox="0 0 24 24"
        >
            <circle cx="12" cy="12" r="10" fill={circleColor ? circleColor : colors.accentPrimary} />

            <path d="M16.59 7.58L10 14.17l-3.59-3.58L5 12l5 5 8-8z" fill={tickColor ? tickColor : colors.white} />
        </SvgIcon>
    );
};
