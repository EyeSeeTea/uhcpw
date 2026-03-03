import { useCallback } from "react";
import styled from "styled-components";
import { Typography, Checkbox } from "@material-ui/core";
import { TreeItem } from "@material-ui/lab";
import UnCheckedIcon from "material-ui/svg-icons/toggle/check-box-outline-blank";

interface NodeProps {
    nodeId: string;
    name: string;
    selected?: boolean;
    disabled?: boolean;
    onSelectedChange?: (nodeId: string, selected: boolean) => void;
}

export const Node: React.FC<NodeProps> = ({ nodeId, name, selected, onSelectedChange, children, disabled = false }) => {
    const handleCheckboxClick = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onSelectedChange && onSelectedChange(nodeId, event.target.checked);
        },
        [nodeId, onSelectedChange]
    );

    const handleLabelClick = useCallback(
        (event: React.MouseEvent<Element, MouseEvent>) => {
            if (!disabled) {
                event.preventDefault();
                onSelectedChange && onSelectedChange(nodeId, !selected);
            }
        },
        [nodeId, onSelectedChange, selected, disabled]
    );

    return (
        <StyledTreeItem
            nodeId={nodeId}
            onLabelClick={handleLabelClick}
            label={
                <Row>
                    {!disabled && (
                        <Checkbox
                            color="primary"
                            style={{ padding: "2px" }}
                            icon={<UnCheckedIcon style={{ fill: "gray" }} />}
                            checked={selected}
                            onChange={handleCheckboxClick}
                            inputProps={{ "aria-label": `Select all ${name}` }}
                            disabled={disabled}
                        />
                    )}
                    <StyledTypography $disabled={disabled}>{name}</StyledTypography>
                </Row>
            }
        >
            {children}
        </StyledTreeItem>
    );
};

const StyledTreeItem = styled(TreeItem)`
    .MuiTreeItem-label {
        padding: 8px;
        font-weight: 500;
        font-size: 14px;
    }
    .MuiTreeItem-content {
        align-items: baseline;
    }
    .MuiTreeItem-iconContainer {
        align-self: flex-start;
        margin-top: 13px;
    }
`;

const StyledTypography = styled(Typography)<{ $disabled?: boolean }>`
    color: ${props => (props.$disabled ? "#8e8e8e" : undefined)};
    margin: 0;
    padding-top: 3px;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
`;
