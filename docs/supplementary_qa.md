# Historical TS01 / TS02 audit record

**Publication restriction (17 November 2026):** All source and derived CSV files and the Excel workbook used for TS01/TS02 have been removed from the public GitHub branch at the researcher's request. This document records earlier checks and does not represent public data availability.

## Earlier checks

- Completeness: the two local source tables covered 17 Brazilian UFs.
- Temporal scope of the planted-area summary: 2014–2023.
- Consistency of source region identifiers, soybean planted-area ranges, and derived TS01 against the manuscript's corresponding supplementary table.
- The local postprocessing removed the `Ilhas Oceânicas` label from Bahia in the derived TS01 only, preserving the historic source export.
- S25's original Earth Engine export was not rerun during this repository preparation.

The retained S25 notebook and `scripts/prepare_spatial_units_table.py` document the computation, but the necessary tabular inputs and outputs are not included. Some underlying Earth Engine vector assets may also require access.

**Scope:** The public repository does not supply the TS01/TS02 tables, workbook, or CSV source files. Historical commits may remain accessible until separately purged. TS03 and TS04 are outside this repository's documented scope.
