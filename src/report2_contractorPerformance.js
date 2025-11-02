/*
REQ-0007
Provision to generate Report 2: Top Contractors Performance Ranking.

Rank top 15 Contractors by total ContractCost (descending, filter >=5 projects),
with columns for the following:
    - number of projects,
    - average CompletionDelayDays,
    - total CostSavings,
    - "Reliability Index", which is computed as (1 - (avg delay / 90)) * (total savings / total
      cost) * 100 (capped at 100). Flag <50 as "High Risk".

Output as sorted CSV.
 */

import fs from "fs";
import { stringify } from "csv-stringify/sync";

export function generateReport2(processedData) {

    // 1. Group by Contractor
    // 2. Filter contractors with >= 5 projects
    // 3. Calculate: numberOfProjects, averageDelayDays, totalCostSavings, totalContractCost
    // 4. Calculate ReliabilityIndex: (1 - (avg delay / 90)) * (total savings / total cost) * 100 (cap at 100)
    // 5. Flag as "High Risk" if ReliabilityIndex < 50
    // 6. Sort by totalContractCost descending
    // 7. Take top 15
    // 8. Format into array of objects for CSV
    
    const reportRows = [
        // ... your calculated data as objects
        // Example: { Contractor: "ABC Corp", ProjectCount: 10, AvgDelayDays: 45.5, ... }
    ];
    
    // Convert to CSV string
    const csvString = stringify(reportRows, { header: true });
    
    // Write to file
    fs.writeFileSync("../output/report2_contractor_performance.csv", csvString);
    
    console.log("Report 2 generated successfully!");
    
    // Optional: return the data if you need it for summary
    return reportRows;
}