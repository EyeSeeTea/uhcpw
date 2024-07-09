import React from "react";
import { Typography, Checkbox } from "@material-ui/core";
import { TreeItem } from "@material-ui/lab";
import UnCheckedIcon from "material-ui/svg-icons/toggle/check-box-outline-blank";
import styled from "styled-components";
import { Leaf } from "./Leaf";
import { Id } from "../../../domain/entities/Ref";

interface ChildAndSubChildrenProps {
    nodeId: string;
    name: string;
    selected: boolean;
    onSelectedChange: (nodeId: string, selected: boolean) => void;
    selectedIds: string[];
    subChildren: { id: string; name: string; code: string }[];
    disabled?: boolean;
    disabledItems?: string[];
    maxSelection?: number;
}

export const ChildAndSubChildren: React.FC<ChildAndSubChildrenProps> = ({
    nodeId,
    name,
    selected,
    onSelectedChange,
    disabled = false,
    subChildren,
    selectedIds,
    disabledItems,
    maxSelection,
}) => {
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

    const isSubChildSelected = React.useCallback((subChildId: Id) => selectedIds.includes(subChildId), [selectedIds]);

    const isSubChildDisabled = React.useCallback(
        (subChildId: Id) =>
            disabledItems?.includes(subChildId) ||
            (!isSubChildSelected(subChildId) && !!maxSelection && maxSelection === selectedIds.length),
        [disabledItems, isSubChildSelected, maxSelection, selectedIds.length]
    );

    return (
        <StyledTreeItem
            nodeId={nodeId}
            onLabelClick={handleLabelClick}
            aria-disabled={disabled}
            label={
                <Row>
                    {!disabled && (
                        <Checkbox
                            color="primary"
                            style={{ padding: "2px" }}
                            icon={<UnCheckedIcon style={{ fill: "gray" }} />}
                            checked={selected}
                            onChange={handleChange}
                            inputProps={{ "aria-label": `Select all ${name} children` }}
                            disabled={disabled}
                        />
                    )}
                    <StyledTypography onClick={handleClick} $disabled={disabled} aria-disabled={disabled}>
                        {name}
                    </StyledTypography>
                </Row>
            }
        >
            {subChildren.map(subChild => (
                <Leaf
                    key={`subchildren-${subChild.id}`}
                    nodeId={subChild.id}
                    name={subChild.name}
                    selected={isSubChildSelected(subChild.id)}
                    onSelectedChange={onSelectedChange}
                    disabled={isSubChildDisabled(subChild.id)}
                />
            ))}
        </StyledTreeItem>
    );
};

const StyledTreeItem = styled(TreeItem)<{ $disabled?: boolean }>`
    .MuiTreeItem-label {
        font-weight: normal;
        font-size: 14px;
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
