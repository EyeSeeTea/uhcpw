import React, { useRef } from "react";
import styled from "styled-components";
import { Button, Typography } from "@material-ui/core";
import i18n from "../../../locales";
import InfoIcon from "@material-ui/icons/Info";
import DownloadIcon from "@material-ui/icons/CloudDownload";
import { downloadHtmlElement } from "../../utils/downloadHtmlElement";

interface ChartProps {
    name: string;
    image: string;
}

export const ChartFake: React.FC<ChartProps> = React.memo(({ name, image }) => {
    const ref = useRef<HTMLDivElement>(null);

    const handleDownload = React.useCallback(() => {
        if (ref.current)
            downloadHtmlElement(ref.current, name, {
                backgroundColor: "#f1f9fc",
                exclusionClasses: ["download-button"],
            });
    }, [ref, name]);

    return (
        <ChartContainer ref={ref}>
            <DataHeader>
                <Row>
                    <Row>
                        <Typography variant="h6" color="textPrimary" style={{ marginLeft: 20 }}>
                            {name}
                        </Typography>
                        <Button>
                            <InfoIcon color="primary" />
                        </Button>
                    </Row>
                    <Row>
                        <CustomButton
                            variant="contained"
                            startIcon={<DownloadIcon />}
                            color="primary"
                            style={{ marginLeft: 20 }}
                            onClick={handleDownload}
                            className="download-button"
                        >
                            {i18n.t("Download")}
                        </CustomButton>
                    </Row>
                </Row>
            </DataHeader>
            <Row>
                <img src={image} alt={name} />

                {/* <Column>
                    {Object.keys(visualizationCustomizations[visualization.id]?.colors || {}).map(id => {
                        return (
                            <Row key={id} justifyContent={"start"} marginBottom={"8px"}>
                                <Box
                                    width={15}
                                    height={15}
                                    bgcolor={visualizationCustomizations[visualization.id]?.colors[id]}
                                    borderColor={"red"}
                                />
                                <Box width={5} />
                                <Typography variant="caption">{analytics.metaData.items[id]?.name}</Typography>
                            </Row>
                        );
                    })}
                    <br />
                    <span>
                        <CreditsText variant="caption">{i18n.t("Source: ")}</CreditsText>
                        <Link href="#">
                            <Typography variant="caption">{i18n.t("Tambor and Pavlova (2020)")}</Typography>
                        </Link>
                    </span>
                    <br />
                    <span>
                        <CreditsText variant="caption">{i18n.t("Last updated: ")}</CreditsText>
                        <CreditsText variant="caption">{i18n.t("15 June 2020")}</CreditsText>
                    </span>
                </Column> */}
            </Row>
        </ChartContainer>
    );
});

const ChartContainer = styled.div`
    margin-top: 48px;
    background: #f1f9fc;
    padding: 0px 32px 32px 32px;
`;

const DataHeader = styled.div`
    padding: 48px 0px;
`;

const CustomButton = styled(Button)`
    border-radius: 10px;
    padding: 0px 16px;
`;

// const CreditsText = styled(Typography)`
//     color: black;
// `;

// const Link = styled.a`
//     text-decoration: none;
// `;

// const Column = styled.div`
//     padding: 64px 30px 64px 64px;
//     display: flex;
//     flex-direction: column;
// `;

const Row = styled.div<{ justifyContent?: string; marginBottom?: string }>`
    display: flex;
    flex-direction: row;
    justify-content: ${props => props.justifyContent || "space-between"}};
    margin-bottom: ${props => props.marginBottom || "0px"}};
`;
