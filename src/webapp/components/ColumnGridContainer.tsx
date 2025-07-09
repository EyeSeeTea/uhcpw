import React from "react";
import styled from "styled-components";
import { Grid, GridProps } from "@material-ui/core";

type VerticalGridProps = GridProps & {
    columns: number;
    children: React.ReactNode;
};

export function ColumnGridContainer(props: VerticalGridProps) {
    const { columns, children, ...gridProps } = props;
    const items = React.Children.toArray(children);
    const rows = Math.ceil(items.length / columns);

    return (
        <ColumnGrid container columns={columns} rows={rows} {...gridProps}>
            {children}
        </ColumnGrid>
    );
}

const ColumnGrid = styled(Grid)<{ columns: number; rows: number }>`
    display: grid !important;
    grid-template-columns: repeat(${props => props.columns}, 1fr);
    grid-template-rows: repeat(${props => props.rows}, auto);
    grid-auto-flow: column;

    @media (max-width: 600px) {
        grid-template-columns: 1fr !important;
        grid-auto-flow: row !important;
    }
`;
