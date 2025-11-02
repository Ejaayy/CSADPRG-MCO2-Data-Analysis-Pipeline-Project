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

    //Group by Region and MainIsland
    const grouped = processedData.reduce((acc, item) => {
      //item is the current row
      
      const key = `${item.Region}-${item.MainIsland}`;
      if (!acc[key]) {
          acc[key] = []; //adds a new acc[key] since group doesnt exist yet
      }
      acc[key].push(item); //add that
      return acc;
  }, {});
  
  // Calculate all the aggregates for each group
  const reportRows = Object.entries(grouped).map(([key, projects]) => {

      const [region, mainIsland] = key.split('-');

      // Total Budget
      const totalBudget = projects.reduce((sum, p) => {
          const val = parseFloat(p.ApprovedBudgetForContract);
          return sum + (isNaN(val) ? 0 : val);
      }, 0);

        // Median Savings
      const savings = projects
          .map(p => {
              const val = parseFloat(p.CostSavings);
              return isNaN(val) ? 0 : val;
          })
          .sort((a, b) => a - b);
      const mid = Math.floor(savings.length / 2);
      const medianSavings =
          savings.length % 2 !== 0
              ? savings[mid]
              : (savings[mid - 1] + savings[mid]) / 2;

        // Average Delay
      const avgDelay =
          projects.reduce((sum, p) => {
              const val = parseFloat(p.CompletionDelayDays);
              return sum + (isNaN(val) ? 0 : val);
          }, 0) / projects.length;

        // % Delayed > 30 days
      const delayedCount = projects.filter(p => (parseFloat(p.CompletionDelayDays) || 0) > 30).length;
      const delayRate = (delayedCount / projects.length) * 100;

        // Efficiency Score
      let efficiencyScore = (medianSavings / avgDelay) * 100;
      if (efficiencyScore > 100) efficiencyScore = 100;
      if (efficiencyScore < 0 || isNaN(efficiencyScore)) efficiencyScore = 0;


      // Return summarized object
      return {
          Region: region,
          MainIsland: mainIsland,
          TotalBudget: totalBudget.toFixed(2),
          MedianSavings: medianSavings.toFixed(2),
          AverageDelayDays: avgDelay.toFixed(2),
          DelayRate: delayRate.toFixed(2),
          EfficiencyScore: efficiencyScore.toFixed(2)
      };
      
  });
  
  //Sort by EfficiencyScore descending
  reportRows.sort((a, b) => parseFloat(b.EfficiencyScore) - parseFloat(a.EfficiencyScore));
  
  
  // Write to file 
  const csvString = stringify(reportRows, { header: true });
  fs.writeFileSync("../output/report1_regional_efficiency.csv", csvString);
  


    // Display preview (first 2 rows)
    const colWidths = {
        region: 50,
        mainIsland: 12,
        totalBudget: 20,
        medianSavings: 15,
        avgDelay: 9,
        highDelay: 10,
        efficiencyScore: 15
    };
    
    console.log(`\n| ${"Region".padEnd(colWidths.region)} | ${"Main Island".padEnd(colWidths.mainIsland)} | ${"TotalBudget".padEnd(colWidths.totalBudget)} | ${"MedianSavings".padEnd(colWidths.medianSavings)} | ${"AvgDelay".padEnd(colWidths.avgDelay)} | ${"HighDelay".padEnd(colWidths.highDelay)} | ${"EfficiencyScore".padEnd(colWidths.efficiencyScore)} |`);
    console.log(`|${"-".repeat(colWidths.region + 2)}|${"-".repeat(colWidths.mainIsland + 2)}|${"-".repeat(colWidths.totalBudget + 2)}|${"-".repeat(colWidths.medianSavings + 2)}|${"-".repeat(colWidths.avgDelay + 2)}|${"-".repeat(colWidths.highDelay + 2)}|${"-".repeat(colWidths.efficiencyScore + 2)}|`);

    reportRows.slice(0, 2).forEach(r => {
        const region = (r.Region || "").substring(0, colWidths.region).padEnd(colWidths.region);
        const mainIsland = (r.MainIsland || "").substring(0, colWidths.mainIsland).padEnd(colWidths.mainIsland);
        const totalBudget = parseFloat(r.TotalBudget)
            .toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            .padStart(colWidths.totalBudget);

        const medianSavings = parseFloat(r.MedianSavings)
            .toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            .padStart(colWidths.medianSavings);
        const avgDelay = r.AverageDelayDays.toString().padStart(colWidths.avgDelay);
        const delayRate = (r.DelayRate.toString() + "%").padStart(colWidths.highDelay);
        const efficiencyScore = r.EfficiencyScore.toString().padStart(colWidths.efficiencyScore);
        
        console.log(`| ${region} | ${mainIsland} | ${totalBudget} | ${medianSavings} | ${avgDelay} | ${delayRate} | ${efficiencyScore} |`);
    });
    console.log("\nFull table exported in ../output/report1_regional_efficiency.csv");

    console.log("Report 1 generated successfully!");

  return reportRows;
}