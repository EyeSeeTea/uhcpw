import { useCallback } from "react";
import { Checkbox, Typography } from "@material-ui/core";
import { TreeItem } from "@material-ui/lab";
import UnCheckedIcon from "material-ui/svg-icons/toggle/check-box-outline-blank";
import styled from "styled-components";

interface LeafProps {
    nodeId: string;
    parentId: string;
    name: string;
    selected: boolean;
    disabled?: boolean;
    onSelectedChange: (parentId: string, nodeId: string, selected: boolean) => void;
}

export const Leaf: React.FC<LeafProps> = ({ nodeId, name, parentId, selected, onSelectedChange, disabled = false }) => {
    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onSelectedChange(parentId, nodeId, event.target.checked);
        },
        [nodeId, onSelectedChange, parentId]
    );

    const handleClick = useCallback(() => {
        !disabled && onSelectedChange(parentId, nodeId, !selected);
    }, [disabled, nodeId, onSelectedChange, parentId, selected]);

    return (
        <StyledTreeItem
            nodeId={nodeId}
            label={
                <Row>
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
