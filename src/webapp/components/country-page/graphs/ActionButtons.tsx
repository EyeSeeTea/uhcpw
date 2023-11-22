import { IconButton } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import GetAppIcon from "@material-ui/icons/GetApp";
import styled from "styled-components";
import { MouseEventHandler } from "react";

type ActionButtonType = {
    onIconButtonClick: MouseEventHandler<HTMLButtonElement>;
    graphImage: string;
};

export const ActionButtons: React.FC<ActionButtonType> = ({ onIconButtonClick, graphImage }) => {
    return (
        <Container>
            <IconButton style={{ padding: "5px", color: "#0360a7" }} onClick={onIconButtonClick}>
                <StyledInfoIcon />
            </IconButton>
            <a href={graphImage} download>
                <IconButton style={{ padding: "10px" }}>
                    <StyledGetAppIcon />
                </IconButton>
            </a>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-wrap: nowrap;
`;

const StyledInfoIcon = styled(InfoIcon)`
    font-size: 30px;
    margin-right: -10px;
`;

const StyledGetAppIcon = styled(GetAppIcon)`
    color: white;
    background-color: #0360a7;
    border-radius: 50%;
    padding: 4px;
    font-size: 17px;
`;
