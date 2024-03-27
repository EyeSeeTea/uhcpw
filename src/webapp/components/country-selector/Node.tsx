import React, { useCallback } from "react";
import { Typography, Checkbox } from "@material-ui/core";
import { TreeItem } from "@material-ui/lab";
import UnCheckedIcon from "material-ui/svg-icons/toggle/check-box-outline-blank";
import styled from "styled-components";
import i18n from "../../../locales";

interface NodeProps {
    nodeId: string;
    name: string;
    selectedCount: number;
    selected?: boolean;
    disabled?: boolean;
    onSelectedChange?: (nodeId: string, selected: boolean) => void;
    hasSelectAll?: boolean;
}

export const Node: React.FC<NodeProps> = ({
    nodeId,
    name,
    selectedCount,
    children,
    onSelectedChange,
    selected = false,
    disabled = false,
    hasSelectAll = false,
}) => {
    const handleCheckboxClick = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onSelectedChange && onSelectedChange(nodeId, event.target.checked);
        },
        [nodeId, onSelectedChange]
    );

    const handleLabelClick = useCallback(
        (event: React.MouseEvent<Element, MouseEvent>) => {
            if (hasSelectAll && !disabled) {
                event.preventDefault();
                onSelectedChange && onSelectedChange(nodeId, !selected);
            }
        },
        [hasSelectAll, nodeId, onSelectedChange, selected, disabled]
    );

    return (
        <StyledTreeItem
            nodeId={nodeId}
            onLabelClick={handleLabelClick}
            label={
                <Row>
                    {hasSelectAll && !disabled && (
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
                    <NodeText>{name}</NodeText>
                    <SelectedText>{i18n.t(`({{count}} selected)`, { count: selectedCount })}</SelectedText>
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
`;

const NodeText = styled(Typography)`
    margin-right: 5px;
`;

const SelectedText = styled(Typography)`
    color: #008ad7;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;
