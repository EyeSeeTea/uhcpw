import React, { useRef, useState } from "react";
import styled from "styled-components";
import { Box, Button, Typography } from "@material-ui/core";
import i18n from "../../../locales";
import InfoIcon from "@material-ui/icons/Info";
import DownloadIcon from "@material-ui/icons/CloudDownload";
import { downloadHtmlElement } from "../../utils/downloadHtmlElement";
import { NotesDialog } from "../dialog/NotesDialog";

interface ChartProps {
    name: string;
    image: string;
    dialogInfo: {
        title?: string;
        infoNotes: string[];
        sourceName: string;
        sourceLink: string;
    };
}

export const ChartFake: React.FC<ChartProps> = React.memo(({ name, image, dialogInfo }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleDownload = React.useCallback(() => {
        if (ref.current)
            downloadHtmlElement(ref.current, name, {
                backgroundColor: "#f1f9fc",
                exclusionClasses: ["download-button", "info-button"],
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
                        <Button onClick={() => setIsOpen(true)}>
                            <CustomInfoIcon color="primary" className="info-button" htmlColor="#185698" />
                        </Button>
                    </Row>

                    <Row>
                        <DownloadButton
                            variant="contained"
                            startIcon={<DownloadIcon />}
                            color="primary"
                            style={{ marginLeft: 20 }}
                            onClick={handleDownload}
                            className="download-button"
                        >
                            {i18n.t("Download")}
                        </DownloadButton>
                    </Row>
                </Row>
            </DataHeader>
            <div>
                <img width={"100%"} src={image} alt={name} />
                <Box height={32} />
            </div>
            <NotesDialog isOpen={isOpen} setIsOpen={setIsOpen} dialogInfo={dialogInfo} />
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

const DownloadButton = styled(Button)`
    border-radius: 20px;
    padding: 0px 32px;
    height: 42px;
    background: #185698;
`;

const CustomInfoIcon = styled(InfoIcon)`
    color: #185698;
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
    justify-content: ${props => props.justifyContent || "space-between"};
    margin-bottom: ${props => props.marginBottom || "0px"};
    align-items: center;
`;
