import styled from "styled-components";
import { Typography, Checkbox } from "@material-ui/core";
import { TreeItem } from "@material-ui/lab";
import UnCheckedIcon from "material-ui/svg-icons/toggle/check-box-outline-blank";

interface NodeProps {
    nodeId: string;
    name: string;
    isSelectable?: boolean;
    selected?: boolean;
    onSelectedChange?: (nodeId: string, selected: boolean) => void;
}

export const Node: React.FC<NodeProps> = ({
    nodeId,
    name,
    isSelectable = false,
    selected,
    onSelectedChange,
    children,
}) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSelectedChange && onSelectedChange(nodeId, event.target.checked);
    };

    return (
        <StyledTreeItem
            nodeId={nodeId}
            label={
                <Row>
                    {isSelectable ? (
                        <Checkbox
                            color="primary"
                            style={{ padding: "2px" }}
                            icon={<UnCheckedIcon style={{ fill: "gray" }} />}
                            checked={selected}
                            onChange={handleChange}
                            inputProps={{ "aria-label": `Select all ${name}` }}
                        />
                    ) : (
                        <Typography>{name}</Typography>
                    )}
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

const Row = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;
