// src/dataProcessor.js

// Cleans and processes DPWH dataset

import dayjs from "dayjs";

export function processData(data) {

    const cleaned = data // will hold the filtered data
        /*
        EQ-0001
        Provision to read the CSV file dpwh_flood_control_projects.csv containing 9,800+
        rows of flood mitigation projects.

        REQ-0002
        Provision to perform basic validation: Log total row count and detect/parse errors (e.g.,
        invalid dates or missing values).

        REQ-0003
        Provision to filter projects from 2021–2023 (exclude 2024 entries for analysis stability).

        REQ-0004
        Provision to compute derived fields:
            - CostSavings = ApprovedBudgetForContract - ContractCost;
            - CompletionDelayDays = days between StartDate and ActualCompletionDate (positive if delayed).

        REQ-0005 Provision to clean data uniformly:
            - Convert financial fields to floats (PHP);
            - parse dates or use date data types when possible;
        */

        // Filter only projects from 2021–2023
        .filter(
            // Built-in that returns array and uses that function param for each row (d)
            function (d) {
                const year = parseInt(d.FundingYear);
                return year >= 2021 && year <= 2023;
            }
        )

        // Transform every element into something new (compute derived fields)
        .map(

            function computeDerivedFields(d) {

                // if null, make it default 0
                // Convert numbers (remove commas, handle nulls)
                const budget = parseFloat((d.ApprovedBudgetForContract || "0").replace(/,/g, ""));
                const cost = parseFloat((d.ContractCost || "0").replace(/,/g, ""));

                // Derived: Cost savings
                const savings = budget - cost;

                // Convert to days (difference between completion and start date)
                const startDate = dayjs(d.StartDate);
                const endDate = dayjs(d.ActualCompletionDate);

                // PLS NOTE: delayDays is just DURATIONNNNN TANGINA NG DATA
                // checks if the date format is valid
                const delayDays = endDate.isValid() && startDate.isValid()
                    ? endDate.diff(startDate, "day")
                    : 0;

                // If endDate is after startDate, the result is positive.
                // If endDate is before startDate, the result is negative.

                return {
                    ...d, // spread operator, updates / adds columns depending if they exist
                    ApprovedBudgetForContract: budget,
                    ContractCost: cost,
                    CostSavings: savings,
                    CompletionDelayDays: delayDays
                };
            }
        );

    // Log total cleaned rows for visibility
    console.log(` leaned ${cleaned.length.toLocaleString()} rows (2021–2023 only).`);

    // Preview one sample record for debugging
    console.log("Sample cleaned record:", cleaned[0]);

    return cleaned;
}
