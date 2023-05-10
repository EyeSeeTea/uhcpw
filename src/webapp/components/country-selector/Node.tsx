import { Typography } from "@material-ui/core";
import { TreeItem } from "@material-ui/lab";
import styled from "styled-components";
import i18n from "../../../locales";

interface NodeProps {
    nodeId: string;
    name: string;
    selectedCount: number;
}

export const Node: React.FC<NodeProps> = ({ nodeId, name, selectedCount, children }) => {
    return (
        <StyledTreeItem
            nodeId={nodeId}
            label={
                <Row>
                    <NodeText>{name}</NodeText>
                    &nbsp;
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

const NodeText = styled(Typography)``;

const SelectedText = styled(Typography)`
    color: #008ad7;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;
