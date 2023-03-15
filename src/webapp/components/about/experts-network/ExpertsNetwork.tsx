import { DropdownItem } from "@eyeseetea/d2-ui-components";
import { Box, Button, Grid, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import i18n from "../../../../locales";
import { Person } from "../../../pages/about/AboutState";
import { SelectDropdown } from "../../select-dropdown/SelectDropdown";
import { ItemPerson } from "../person/ItemPerson";

export interface ExpertsNetworkProps {
    members: Person[];
    selectCountries: DropdownItem<string>[];
    selectedCountry: string | undefined;
    onCountryChange: (value: string | undefined) => void;
    filters: string[];
    selectedFilter: string;
    onFilterChange: (value: string) => void;
}

export const ExpertsNetwork: React.FC<ExpertsNetworkProps> = React.memo(
    ({ members, selectCountries, selectedCountry, onCountryChange, filters, selectedFilter, onFilterChange }) => {
        return (
            <>
                <ItemsTitleContainer>
                    <Title>{i18n.t("Experts network")}</Title>
                </ItemsTitleContainer>

                <Row>
                    <SelectDropdown
                        label={i18n.t("Countries")}
                        items={selectCountries}
                        value={selectedCountry}
                        onChange={onCountryChange}
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

                <Grid container spacing={5} style={{ marginBottom: 4 }}>
                    {members.map((item, index) => {
                        return (
                            <Grid key={index} item lg={4} md={6} xs={12}>
                                <ItemPerson person={item} />
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
    font-size: 20px;
    font-weight: normal;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    align-items: end;
    flex-wrap: wrap;
`;

const FilterButton = styled(Button)<{ selected: boolean }>`
    background: ${props => (props.selected ? "#e7f3fc" : undefined)};
    color: ${props => (props.selected ? "#1150b8" : "black")};
    min-width: 40px;
    padding: 2px;
    margin: 4px;
`;
