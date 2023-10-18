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
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSelectedChange(nodeId, event.target.checked);
    };

    const handleClick = () => {
        !disabled && onSelectedChange(nodeId, !selected);
    };

    return (
        <StyledTreeItem
            nodeId={nodeId}
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
