/*
REQ-0008
Provision to generate Report 3: Annual Project Type Cost Overrun Trends.

Group by FundingYear and TypeOfWork, computing the following:
    - total projects
    - average CostSavings (negative if overrun)
    - overrun rate (% with negative savings)
    - year-over-year % change in average savings (2021 baseline).
 */

import fs from "fs";
import { stringify } from "csv-stringify/sync";

export function generateReport3(processedData) {

    // Group by FundingYear AND TypeOfWork (composite key)
    const grouped = processedData.reduce((acc, item) => {
        //item is the current row

        const key = `${item.FundingYear}-${item.TypeOfWork}`;
        if (!acc[key]) {
            acc[key] = []; //adds a new acc[key] since group doesnt exist yet
        }
        acc[key].push(item); //add that
        return acc;
    }, {});

    // Store 2021 baseline averages by TypeOfWork for YoY calculation
    const baseline2021 = {};
    Object.entries(grouped).forEach(([key, projects]) => {

        const [year, type] = key.split("-");
        //this shit will split it into 2
        //year = "2021"
        // type = "Construction of Flood Mitigation Structure"

        if (parseInt(year) === 2021) {
            const avgSavings =
                projects.reduce((sum, p) => {
                    const val = parseFloat((p.CostSavings || "0").toString().replace(/,/g, ""));
                    return sum + (isNaN(val) ? 0 : val);
                }, 0) / projects.length;
            baseline2021[type] = avgSavings;
        }
    });

    // For each group, calculate:
    //    - totalProjects (count)
    //    - averageCostSavings (average of CostSavings)
    //    - overrunRate (% where CostSavings < 0)
    //    - yearOverYearChange (compare 2022/2023 to 2021 baseline)

    const reportRows = Object.entries(grouped).map(([key, projects]) => {
        const [year, type] = key.split("-");

        // total projects
        const projectCount = projects.length;

        // average CostSavings
        const avgSavings =
            projects.reduce((sum, p) => {
                const val = parseFloat((p.CostSavings || "0").toString().replace(/,/g, ""));
                return sum + (isNaN(val) ? 0 : val);
            }, 0) / projectCount;

        // overrun rate (% with negative savings)
        const overruns = projects.filter(p => {
            const val = parseFloat((p.CostSavings || "0").toString().replace(/,/g, ""));
            return val < 0;
        }).length;
        const overrunRate = (overruns / projectCount) * 100;

        // year-over-year % change from 2021 baseline
        const baseline = baseline2021[type];
        let yoyChange = null;
        if (baseline !== undefined && parseInt(year) > 2021) {
            yoyChange = ((avgSavings - baseline) / Math.abs(baseline || 1)) * 100;
        }

        return {
            Year: year,
            TypeOfWork: type,
            ProjectCount: projectCount,
            AvgCostSavings: avgSavings.toFixed(2),
            OverrunRate: overrunRate.toFixed(2),
            YoYChange: yoyChange !== null ? yoyChange.toFixed(2) : "—"
        };
    });

    // Sort by Year then Type
    reportRows.sort((a, b) =>
        a.Year === b.Year ? a.TypeOfWork.localeCompare(b.TypeOfWork)
            : parseInt(a.Year) - parseInt(b.Year)
    );

    // Format into array of objects for CSV

    
    // Convert to CSV string
    const csvString = stringify(reportRows, { header: true });
    
    // Write to file
    fs.writeFileSync("../output/report3_annual_trends.csv", csvString);

    // Display preview (first 8 rows)
    const colWidths = {
        year: 4,
        typeOfWork: 40,
        projects: 9,
        avgSavings: 14,
        overrunRate: 11,
        yoyChange: 10
    };
    
    console.log(`\n| ${"Year".padEnd(colWidths.year)} | ${"TypeOfWork".padEnd(colWidths.typeOfWork)} | ${"Projects".padEnd(colWidths.projects)} | ${"AvgSavings".padEnd(colWidths.avgSavings)} | ${"OverrunRate".padEnd(colWidths.overrunRate)} | ${"YoYChange".padEnd(colWidths.yoyChange)} |`);
    console.log(`|${"-".repeat(colWidths.year + 2)}|${"-".repeat(colWidths.typeOfWork + 2)}|${"-".repeat(colWidths.projects + 2)}|${"-".repeat(colWidths.avgSavings + 2)}|${"-".repeat(colWidths.overrunRate + 2)}|${"-".repeat(colWidths.yoyChange + 2)}|`);
    
    reportRows.slice(0, 8).forEach(r => {
        const year = r.Year.toString().padEnd(colWidths.year);
        const typeOfWork = (r.TypeOfWork || "").substring(0, colWidths.typeOfWork).padEnd(colWidths.typeOfWork);
        const projects = r.ProjectCount.toString().padStart(colWidths.projects);
        const avgSavings = parseFloat(r.AvgCostSavings).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).padStart(colWidths.avgSavings);
        const overrunRate = (r.OverrunRate.toString() + "%").padStart(colWidths.overrunRate);
        const yoyChange = r.YoYChange.toString().padStart(colWidths.yoyChange);
        
        console.log(`| ${year} | ${typeOfWork} | ${projects} | ${avgSavings} | ${overrunRate} | ${yoyChange} |`);
    });
    
    console.log("\nFull table exported in ../output/report3_annual_trends.csv");
    console.log("Report 3 generated successfully!");

    return reportRows;
}