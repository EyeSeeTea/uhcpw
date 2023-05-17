import { Box, Button, Grid, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import i18n from "../../../../locales";
import { Person } from "../../../pages/about/AboutState";
import { Dropdown } from "../../dropdown/Dropdown";
import { Option } from "../../dropdown/Option";
import { ItemPerson } from "../person/ItemPerson";
import { colors } from "../../../pages/app/themes/dhis2.theme";

export interface ExpertsNetworkProps {
    members: Person[];
    selectCountries: Option<string>[];
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
                    <Title>{i18n.t("Financial protection expert network")}</Title>
                    <Subtitle style={{ maxWidth: "480px" }}>
                        {i18n.t(
                            "Experts working with the WHO Barcelona Office to access finantial protection and coverage policy at country level"
                        )}
                    </Subtitle>
                </ItemsTitleContainer>

                <Row>
                    <StyledDropdown
                        placeholder={i18n.t("Select Countries")}
                        label={i18n.t("Countries")}
                        options={selectCountries}
                        value={selectedCountry}
                        onChange={onCountryChange}
                        width="250px"
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
                            <Grid key={index} item>
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
    font-size: 35px;
`;

const Subtitle = styled(Typography)`
    font-size: 17px;
    color: ${colors.grey};
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
    margin: 4px 4px 10px;
`;

const StyledDropdown = styled(Dropdown)`
    max-width: 200px;
`;
