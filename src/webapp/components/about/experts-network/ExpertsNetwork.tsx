import { Box, Button, Grid, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import i18n from "../../../../locales";
import { ItemPerson } from "../person/ItemPerson";
import { CountryFilterState } from "../../../common/state/state";
import { CountrySelector } from "../../country-selector/CountrySelector";
import { PersonState } from "../../../pages/about/AboutState";

export interface ExpertsNetworkProps {
    members: PersonState[];
    countryFilter: CountryFilterState;
    filters: string[];
    selectedFilter: string;
    onFilterChange: (value: string) => void;
}

export const ExpertsNetwork: React.FC<ExpertsNetworkProps> = React.memo(
    ({ members, countryFilter, filters, selectedFilter, onFilterChange }) => {
        return (
            <>
                <ItemsTitleContainer>
                    <Title variant="h3">{i18n.t("The European Financial Protection Network")}</Title>
                    <Subtitle variant="h5">
                        {i18n.t(
                            "Experts working with the WHO Barcelona Office to assess financial protection and coverage policy at country level"
                        )}
                    </Subtitle>
                </ItemsTitleContainer>

                <Row style={{ padding: "16px 32px" }}>
                    <CountrySelector
                        countries={countryFilter.options}
                        selectedIds={countryFilter.selected}
                        onSelectedIdsChange={countryFilter.onSelectedChange}
                        placeholder="Select country"
                        disabledTextfield={false}
                    />

                    <Box width={4} />

                    {filters.map(filter => {
                        return (
                            <FilterButton
                                key={filter}
                                selected={filter === selectedFilter}
                                onClick={() => onFilterChange(filter)}
                            >
                                {filter}
                            </FilterButton>
                        );
                    })}
                </Row>

                <Grid container spacing={8} style={{ marginBottom: 6 }}>
                    {members.map((item, index) => {
                        return (
                            <Grid key={index} item xs={6} md>
                                <ItemPerson person={item} isExpert />
                            </Grid>
                        );
                    })}
                </Grid>
            </>
        );
    }
);

const ItemsTitleContainer = styled.div`
    padding: 64px 32px 16px 32px;
`;

const Title = styled(Typography)`
    font-weight: 500;
`;

const Subtitle = styled(Typography)`
    color: rgba(36, 38, 38, 0.7);
    max-width: 50%;
    margin-top: 10px;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    align-items: end;
    flex-wrap: wrap;
`;

export const FilterButton = styled(Button)<{ selected: boolean }>`
    background: ${props => (props.selected ? "#e7f3fc" : undefined)};
    color: ${props => (props.selected ? "#1150b8" : "black")};
    min-width: 40px;
    padding: 2px;
    margin: 4px 4px 10px;
    font-size: 16px;
`;
