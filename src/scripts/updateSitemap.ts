import { command, run, string, option } from "cmd-ts";
import path from "path";
import fs from "fs";

function getCurrentDate(): string {
    return new Date().toISOString().split("T")[0] as string;
}

function updateSitemapLastmod(sitemapPath: string): void {
    if (!fs.existsSync(sitemapPath)) {
        throw new Error(`Sitemap file not found at: ${sitemapPath}`);
    }

    const currentDate = getCurrentDate();
    const sitemapContent = fs.readFileSync(sitemapPath, "utf-8");

    // Replace all lastmod dates with the current date
    // Matches <lastmod>YYYY-MM-DD</lastmod> pattern
    const updatedContent = sitemapContent.replace(
        /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g,
        `<lastmod>${currentDate}</lastmod>`
    );

    fs.writeFileSync(sitemapPath, updatedContent, "utf-8");

    console.debug(`✓ Sitemap lastmod fields updated to: ${currentDate}`);
    console.debug(`✓ File updated: ${sitemapPath}`);
}

function main() {
    const cmd = command({
        name: path.basename(__filename),
        description: "Update lastmod field in sitemap.xml to current date",
        args: {
            input: option({
                type: string,
                long: "input",
                short: "i",
                defaultValue: () => path.join(__dirname, "../../build/sitemap.xml"),
                description: "Path to sitemap.xml file to update",
            }),
        },
        handler: async args => {
            try {
                updateSitemapLastmod(args.input);
            } catch (error) {
                console.error("Error updating sitemap:", error);
                process.exit(1);
            }
        },
    });

    run(cmd, process.argv.slice(2));
}

main();
