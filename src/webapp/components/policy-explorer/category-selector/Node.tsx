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
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSelectedChange && onSelectedChange(nodeId, event.target.checked);
    };

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
`;

const StyledTypography = styled(Typography)<{ $disabled?: boolean }>`
    color: ${props => (props.$disabled ? "#8e8e8e" : undefined)};
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;
