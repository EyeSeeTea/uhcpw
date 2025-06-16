import { Grid, GridProps, GridSize } from "@material-ui/core";
import _ from "lodash";
import React from "react";

type VerticalGridProps = GridProps & {
    columns: 1 | 2 | 3 | 4 | 6;
    items: React.ReactNode[];
};

export function VerticalGrid(props: VerticalGridProps) {
    const { columns, items, ...gridProps } = props;

    const size = Math.ceil(items.length / columns);
    const columnedData = _.chunk(items, size);
    const columnWidth = (12 / columns) as GridSize;

    return (
        <Grid container spacing={5} {...gridProps}>
            {columnedData.map((colItems, colIndex) => (
                <Grid item xs={12} sm={columnWidth} key={colIndex}>
                    <Grid container direction="column" spacing={5}>
                        {colItems.map(item => item)}
                    </Grid>
                </Grid>
            ))}
        </Grid>
    );
}
