/*
REQ-0009
Provision to produce a summary.json aggregating key stats across reports (e.g., total
number of projects, total number of contractors, total provinces with projects, global
average delay, total savings).
*/

import fs from "fs";

export function generateSummary(processedData) {

    console.log("\nGenerating Summary Report...");

    // Total number of projects
    const totalProjects = processedData.length;

    // Unique contractors
    const contractorSet = new Set(
        processedData.map(p => (p.Contractor || "").trim())
    );
    const totalContractors = contractorSet.size;

    // Unique provinces
    const provinceSet = new Set(
        processedData.map(p => (p.Province || "").trim())
    );
    const totalProvinces = provinceSet.size;

    // Global average delay (in days)
    const totalDelay = processedData.reduce((sum, p) => {
        const val = parseFloat((p.CompletionDelayDays || "0").toString().replace(/,/g, ""));
        return sum + (isNaN(val) ? 0 : val);
    }, 0);
    const globalAverageDelay = totalDelay / (totalProjects || 1);

    // Total savings (sum of CostSavings)
    const totalSavings = processedData.reduce((sum, p) => {
        const val = parseFloat((p.CostSavings || "0").toString().replace(/,/g, ""));
        return sum + (isNaN(val) ? 0 : val);
    }, 0);

    // Compute average contract cost (just for insight)
    const totalCost = processedData.reduce((sum, p) => {
        const val = parseFloat((p.ContractCost || "0").toString().replace(/,/g, ""));
        return sum + (isNaN(val) ? 0 : val);
    }, 0);
    const averageContractCost = totalCost / (totalProjects || 1);

    // Combine everything into one JSON object
    const summary = {
        totalProjects,
        totalContractors,
        totalProvinces,
        globalAverageDelay: parseFloat(globalAverageDelay.toFixed(2)),
        totalSavings: parseFloat(totalSavings.toFixed(2)),
        averageContractCost: parseFloat(averageContractCost.toFixed(2))
    };

    // Write to file (pretty-printed with 2-space indentation)
    fs.writeFileSync("../output/summary.json", JSON.stringify(summary, null, 2));

    // 9️⃣ Console log for feedback
    console.log("\n summary Report Generated:");
    console.log(summary);
    console.log(" Exported to ../output/summary.json\n");

    return summary;
}