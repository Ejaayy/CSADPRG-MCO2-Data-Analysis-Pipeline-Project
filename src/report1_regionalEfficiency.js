/*
REQ-0006
Provision to generate Report 1: Regional Flood Mitigation Efficiency Summary.

This table will have the following columns:
    - aggregate total ApprovedBudgetForContract,
    - median CostSavings,
    - average CompletionDelayDays, and
    - percentage of projects with delays >30 days by Region and MainIsland.
    - Include "Efficiency Score", which is computed as: (median savings / average delay) * 100,
      normalized to 0-100.

Output as sorted CSV (descending by EfficiencyScore).
 */

import fs from "fs";
import { stringify } from "csv-stringify/sync";

export function generateReport1(processedData) {

    // 1. Group by Region and MainIsland
    const grouped = processedData.reduce((acc, item) => {
      //item is the current row
      
      const key = `${item.Region}-${item.MainIsland}`;
      if (!acc[key]) {
          acc[key] = [];
      }
      acc[key].push(item);
      return acc;
  }, {});
  
  // 2. Calculate all the aggregates
  const reportRows = Object.entries(grouped).map(([key, projects]) => {
      const [region, mainIsland] = key.split('-');
      
      // Your calculations here (totalBudget, medianSavings, avgDelay, etc.)
      // Return object with all fields
      
  });
  
  // 3. Sort by EfficiencyScore descending
  reportRows.sort((a, b) => parseFloat(b.EfficiencyScore) - parseFloat(a.EfficiencyScore));
  
  
  // Write to file 
  const csvString = stringify(reportRows, { header: true });
  fs.writeFileSync("./output/report1_regional_efficiency.csv", csvString);
  
  console.log("Report 1 generated successfully!");
  
  return reportRows;
}