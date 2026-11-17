# Soybean water deficit in Brazil (2014–2023)

Public code and documentation associated with the study of accumulated water deficit in rainfed soybean-growing areas across Brazil (2014–2023).

## Data sharing restriction

**The source, processed, and supplementary tabular datasets (.csv and .xlsx) have been removed from the public repository at the researcher's request.** No input spreadsheets for computing DEF_ACUM or processed tabular files for recreating manuscript figures are distributed here. Any previously published Git commit containing those files remains part of the repository's historical record unless that history is separately purged.

**The scripts remain available for documentation and inspection, but some cannot execute without research data that are not distributed here.** This repository is not a complete, self-contained reproducibility package.

## Scripts

- `scripts/generate_manuscript_figures.ipynb` (S24) creates manuscript figures **from seven separately held, processed CSV files**. Those inputs are not included. It does not recompute DEF_ACUM, soybean productivity, or the underlying sequential water balance.
- `scripts/extract_spatial_units.ipynb` (S25) describes and implements the GEE spatial-intersection export previously used for TS01. Re-execution requires access to the configured Earth Engine assets and may export a CSV, which is **not** stored in this public repository.
- `scripts/prepare_spatial_units_table.py` prepares a TS01 table from two source CSVs. Those inputs are **not** included; the script cannot be run as-is without them.
- `gee/soybean_water_deficit_viewer.js` is the source supplied by the researcher from the Google Earth Engine editor. It uses six fixed visual classes for DEF_ACUM and does not recompute water-balance outputs.

## Public interactive visualization

- **Application:** https://ee-marcosguedeslana.projects.earthengine.app/view/soybean-water-deficit-in-brazil-20142023
- **Image collection S06:** `projects/ee-marcosguedeslana/assets/BH_SOJA_SEQUEIRO_Unificada`

The Earth Engine image collection contains **published gridded DEF_ACUM results** and is separate from the tabular data previously shared on GitHub. Its sharing settings were not changed as part of removing spreadsheet files.

## Research provenance and limitations

- The original computational models and spreadsheets used to calculate DEF_ACUM were **not** published in this GitHub repository.
- Group-owned spatial modeling script S12 and Script 19 are not included.
- The files in `docs/` are historical methodological and audit notes. References to source CSVs describe restricted local research files, **not data distributed in this repository**.
- The original figures were verified by the researcher on their local machine. Their processed CSV inputs are not publicly available here.
- Redistribution rights, license, and authorship conditions for the remaining code and assets should be confirmed with the research team. No license or repository DOI is claimed.
