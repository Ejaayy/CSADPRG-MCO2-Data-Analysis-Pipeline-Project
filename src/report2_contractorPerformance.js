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