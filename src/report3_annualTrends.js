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

    // 1. Group by FundingYear AND TypeOfWork (composite key)
    // 2. Store 2021 baseline averages by TypeOfWork for YoY calculation
    // 3. For each group, calculate:
    //    - totalProjects (count)
    //    - averageCostSavings (average of CostSavings)
    //    - overrunRate (% where CostSavings < 0)
    //    - yearOverYearChange (compare 2022/2023 to 2021 baseline)
    // 4. Format into array of objects for CSV
    
    const reportRows = [
        // ... your calculated data as objects
        // Example: { Year: "2021", TypeOfWork: "Drainage", ProjectCount: 50, ... }
    ];
    
    // Convert to CSV string
    const csvString = stringify(reportRows, { header: true });
    
    // Write to file
    fs.writeFileSync("../output/report3_annual_trends.csv", csvString);
    
    console.log("Report 3 generated successfully!");
    
    // Optional: return the data if you need it for summary
    return reportRows;
}