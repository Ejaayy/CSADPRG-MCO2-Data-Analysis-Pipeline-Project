/*
REQ-0009
Provision to produce a summary.json aggregating key stats across reports (e.g., total
number of projects, total number of contractors, total provinces with projects, global
average delay, total savings).
*/

import fs from "fs";

export function generateSummary(processedData) {

    // 1. Calculate totalProjects (count of all processed data)
    // 2. Calculate totalContractors (unique count of Contractor field)
    // 3. Calculate totalProvinces (unique count of Province field)
    // 4. Calculate globalAverageDelay (average of CompletionDelayDays)
    // 5. Calculate totalSavings (sum of CostSavings)
    // 6. Add any other aggregate stats you want
    // 7. Create JSON object with all stats
    
    const summary = {
        // totalProjects: ...,
        // totalContractors: ...,
        // totalProvinces: ...,
        // globalAverageDelay: ...,
        // totalSavings: ...,
        // ... other stats
    };
    
    // Write to file (pretty-printed with 2-space indentation)
    fs.writeFileSync("./output/summary.json", JSON.stringify(summary, null, 2));
    
    console.log("Summary generated successfully!");
    
    return summary;
}