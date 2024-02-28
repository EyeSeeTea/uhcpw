import React from "react";
import { Checkbox, Typography } from "@material-ui/core";
import { TreeItem } from "@material-ui/lab";
import UnCheckedIcon from "material-ui/svg-icons/toggle/check-box-outline-blank";
import styled from "styled-components";

interface LeafProps {
    nodeId: string;
    name: string;
    selected: boolean;
    onSelectedChange: (nodeId: string, selected: boolean) => void;
    disabled?: boolean;
}

export const Leaf: React.FC<LeafProps> = ({ nodeId, name, selected, onSelectedChange, disabled = false }) => {
    const handleChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            !disabled && onSelectedChange(nodeId, event.target.checked);
        },
        [disabled, nodeId, onSelectedChange]
    );

    const handleClick = React.useCallback(() => {
        !disabled && onSelectedChange(nodeId, !selected);
    }, [disabled, nodeId, onSelectedChange, selected]);

    const handleLabelClick = React.useCallback(
        (event: React.MouseEvent<Element, MouseEvent>) => {
            event.preventDefault();
            !disabled && onSelectedChange(nodeId, !selected);
        },
        [disabled, nodeId, onSelectedChange, selected]
    );

    return (
        <StyledTreeItem
            nodeId={nodeId}
            onLabelClick={handleLabelClick}
            label={
                <Row role="checkbox">
                    {!disabled && (
                        <Checkbox
                            color="primary"
                            style={{ padding: "2px" }}
                            icon={<UnCheckedIcon style={{ fill: "gray" }} />}
                            checked={selected}
                            onChange={handleChange}
                            inputProps={{ "aria-label": name }}
                            disabled={disabled}
                        />
                    )}
                    <StyledTypography onClick={handleClick} $disabled={disabled}>
                        {name}
                    </StyledTypography>
                </Row>
            }
        />
    );
};

const StyledTreeItem = styled(TreeItem)`
    .MuiTreeItem-label {
        font-weight: normal;
        font-size: 14px;
    }
    .MuiTreeItem-label {
    }
`;

const StyledTypography = styled(Typography)<{ $disabled?: boolean }>`
    color: ${props => (props.$disabled ? "#8e8e8e" : undefined)};
`;
const Row = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;
