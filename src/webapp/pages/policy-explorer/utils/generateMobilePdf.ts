import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { marked } from "marked";

import {
    PolicyExplorer,
    PolicyExplorerCell,
    PolicyExplorerCellType,
} from "../../../../domain/entities/policy-explorer/PolicyExplorer";

const markdownToText = (markdown: string): string => {
    const html = marked.parse(markdown);
    const tmpEl = document.createElement("div");
    tmpEl.innerHTML = html;
    return tmpEl.textContent || tmpEl.innerText || "";
};

export const generateMobilePdf = (policyExplorer: PolicyExplorer) => {
    console.log("policyExplorer", policyExplorer);

    const pdf = new jsPDF("p", "mm", "a4");

    pdf.setFontSize(14);
    pdf.text("Policy Explorer", 10, 10);

    let y = 20;

    Object.entries(policyExplorer.tables).forEach(([category, rows]) => {
        pdf.setFontSize(12);
        pdf.text(`Category: ${category}`, 10, y);
        y += 6;

        const firstRow = rows[0];
        if (!rows || !firstRow || rows.length === 0) {
            pdf.text("No data available", 10, y);
            y += 10;
            return;
        }

        const head: string[] = firstRow.map(cell => cell.value);
        console.log("head", head);

        const body: string[][] = rows.slice(1).map(row =>
            row.map((cell: PolicyExplorerCell) => {
                const text =
                    cell.references && cell.references.trim() !== ""
                        ? `${cell.value} (ref: ${cell.references})`
                        : cell.value;

                if (cell.type === PolicyExplorerCellType.HEADER) {
                    return markdownToText(text);
                } else {
                    return markdownToText(text);
                }
            })
        );
        console.log("body", body);

        autoTable(pdf, {
            startY: y,
            head: [head],
            body: body,
            theme: "grid",
            headStyles: {
                fillColor: [30, 144, 255],
                textColor: 255,
            },
            bodyStyles: {
                textColor: [50, 50, 50],
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245],
            },
            tableWidth: "wrap",
        });
    });

    pdf.save("policy-explorer.pdf");
};
