# MCO2: Flood Control Data Analysis Pipeline

## 📌 Project Description
This project implements a **Data Analysis Pipeline** for the Department of Public Works and Highways (DPWH) flood control projects dataset.  
It ingests, cleans, and processes `dpwh_flood_control_projects.csv` (9,800+ rows) and produces three CSV reports plus a `summary.json` to help analyze regional efficiency, contractor performance, and cost overrun trends.

The pipeline is provided in **four languages** to demonstrate portability and implementation differences:
- R
- JavaScript (Node.js) -> Used for this specific repo
- Kotlin
- Rust

---

## 🔁 Expected input
- `dpwh_flood_control_projects.csv` — main dataset (place this file in the project root or `data/` folder).
- Required (example) columns the pipeline expects in the CSV:
  - `ProjectID`, `Region`, `MainIsland`, `Province`, `Contractor`,
  - `FundingYear`, `TypeOfWork`, `StartDate`, `ActualCompletionDate`,
  - `ApprovedBudgetForContract`, `ContractCost`, `Latitude`, `Longitude`
- Dates must be parseable (ISO `YYYY-MM-DD` recommended). Monetary fields should be numeric or parseable as numbers with or without commas.

---
