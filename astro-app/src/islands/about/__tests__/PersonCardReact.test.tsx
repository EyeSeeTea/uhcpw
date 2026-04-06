import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PersonCardReact } from "../PersonCardReact";

const basePerson = {
    image: "https://example.com/photo.jpg",
    firstName: "Jane",
    lastName: "Doe",
    position: "Senior Researcher",
    institution: "WHO",
    countryName: "Spain",
};

describe("PersonCardReact", () => {
    it("renders person name, position, institution and country", () => {
        render(<PersonCardReact person={basePerson} />);

        expect(screen.getByText("Jane")).toBeInTheDocument();
        expect(screen.getByText("Doe")).toBeInTheDocument();
        expect(screen.getByText("Senior Researcher")).toBeInTheDocument();
        expect(screen.getByText("WHO")).toBeInTheDocument();
        expect(screen.getByText("Spain")).toBeInTheDocument();
    });

    it("renders image with correct alt text", () => {
        render(<PersonCardReact person={basePerson} />);

        const img = screen.getByRole("img", { name: "Jane Doe" });
        expect(img).toHaveAttribute("src", "https://example.com/photo.jpg");
    });

    it("sets role listitem on the container", () => {
        render(<PersonCardReact person={basePerson} />);
        expect(screen.getByRole("listitem")).toBeInTheDocument();
    });

    it("splits position by escaped newlines into separate paragraphs", () => {
        const person = { ...basePerson, position: "Line one\\nLine two" };
        render(<PersonCardReact person={person} />);

        expect(screen.getByText("Line one")).toBeInTheDocument();
        expect(screen.getByText("Line two")).toBeInTheDocument();
    });

    it("splits institution by escaped newlines into separate paragraphs", () => {
        const person = { ...basePerson, institution: "Dept A\\nDept B" };
        render(<PersonCardReact person={person} />);

        expect(screen.getByText("Dept A")).toBeInTheDocument();
        expect(screen.getByText("Dept B")).toBeInTheDocument();
    });

    it("does not render institution section when institution is undefined", () => {
        const person = { ...basePerson, institution: undefined };
        render(<PersonCardReact person={person} />);

        expect(screen.queryByText("WHO")).not.toBeInTheDocument();
    });

    it("swaps to placeholder on image error", () => {
        render(<PersonCardReact person={basePerson} />);

        const img = screen.getByRole("img", { name: "Jane Doe" });
        fireEvent.error(img);

        expect(img.getAttribute("src")).toBe("/images/avatar-empty.png");
    });
});
