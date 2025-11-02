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

    // Group by Contractor
    const grouped = processedData.reduce((acc, item) => {
        const key = item.Contractor || "Unknown"; // safety for blanks
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});

    // Keep only contractors with >= 5 projects
    const filtered = Object.entries(grouped)
        .filter(([contractor, projects]) => projects.length >= 5);

    // Compute all required aggregates per contractor
    const reportRows = filtered.map(([contractor, projects]) => {
        const projectCount = projects.length;

        // Total Contract Cost
        const totalCost = projects.reduce((sum, p) => {
            const val = parseFloat(p.ContractCost);
            return sum + (isNaN(val) ? 0 : val);
        }, 0);

        // Total Cost Savings
        const totalSavings = projects.reduce((sum, p) => {
            const val = parseFloat(p.CostSavings);
            return sum + (isNaN(val) ? 0 : val);
        }, 0);

        // Average Completion Delay
        const avgDelay = projects.reduce((sum, p) => {
            const val = parseFloat(p.CompletionDelayDays);
            return sum + (isNaN(val) ? 0 : val);
        }, 0) / projectCount;

        // Reliability Index formula
        const avg = parseFloat(avgDelay) || 0;
        const savings = parseFloat(totalSavings) || 0;
        const cost = parseFloat(totalCost) || 1; // avoid divide-by-zero

        let reliabilityIndex = (1 - (avg / 90)) * (savings / cost) * 100;
        if (reliabilityIndex > 100) reliabilityIndex = 100;
        if (isNaN(reliabilityIndex) || reliabilityIndex < 0) reliabilityIndex = 0;

        // Risk flag
        const riskFlag = reliabilityIndex < 50 ? "High Risk" : "OK";

        // Return the summarized record
        return {
            Contractor: contractor,
            ProjectCount: projectCount,
            TotalContractCost: totalCost.toFixed(2),
            TotalSavings: totalSavings.toFixed(2),
            AverageDelayDays: avgDelay.toFixed(2),
            ReliabilityIndex: reliabilityIndex.toFixed(2),
            RiskFlag: riskFlag
        };
    });

    // Sort by total contract cost descending
    reportRows.sort((a, b) => parseFloat(b.TotalContractCost) - parseFloat(a.TotalContractCost));

    // 5Take top 15 only
    const top15 = reportRows.slice(0, 15);

    // Write output to CSV file (root output folder)
    const csvString = stringify(top15, { header: true });
    fs.writeFileSync("../output/report2_contractor_performance.csv", csvString);

    // Display preview (top 15 contractors)
    const colWidths = {
        contractor: 30,
        projects: 8,
        avgDelay: 10,
        totalCost: 20,
        totalSavings: 20,
        reliability: 12,
        riskFlag: 10
    };
    
    console.log(`\n| ${"Contractor".padEnd(colWidths.contractor)} | ${"Projects".padEnd(colWidths.projects)} | ${"AvgDelay".padEnd(colWidths.avgDelay)} | ${"TotalCost".padEnd(colWidths.totalCost)} | ${"TotalSavings".padEnd(colWidths.totalSavings)} | ${"Reliability".padEnd(colWidths.reliability)} | ${"RiskFlag".padEnd(colWidths.riskFlag)} |`);
    console.log(`|${"-".repeat(colWidths.contractor + 2)}|${"-".repeat(colWidths.projects + 2)}|${"-".repeat(colWidths.avgDelay + 2)}|${"-".repeat(colWidths.totalCost + 2)}|${"-".repeat(colWidths.totalSavings + 2)}|${"-".repeat(colWidths.reliability + 2)}|${"-".repeat(colWidths.riskFlag + 2)}|`);

    top15.slice(0,2).forEach(r => {
        const contractor = (r.Contractor || "").substring(0, colWidths.contractor).padEnd(colWidths.contractor);
        const projects = r.ProjectCount.toString().padStart(colWidths.projects);
        const avgDelay = r.AverageDelayDays.toString().padStart(colWidths.avgDelay);
        const totalCost = parseFloat(r.TotalContractCost).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).padStart(colWidths.totalCost);
        const totalSavings = parseFloat(r.TotalSavings).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).padStart(colWidths.totalSavings);
        const reliability = r.ReliabilityIndex.toString().padStart(colWidths.reliability);
        const riskFlag = r.RiskFlag.padStart(colWidths.riskFlag);
        
        console.log(`| ${contractor} | ${projects} | ${avgDelay} | ${totalCost} | ${totalSavings} | ${reliability} | ${riskFlag} |`);
    });

    console.log("\nFull table exported in ../output/report2_contractor_performance.csv");
    console.log("Report 2 generated successfully!");
    return top15;
}
