# Soybean water deficit in Brazil (2014–2023)

Code, processed figure inputs, and supplementary tables for the rainfed soybean water deficit study in Brazil (2014–2023).

**Repository:** https://github.com/marcos-lana/soybean-water-deficit-brazil

This repository uses short, descriptive file names in English. The original script IDs (S24, S25, S06) and file names are preserved in [`docs/file_name_mapping.csv`](docs/file_name_mapping.csv) with SHA-256 hashes.

## Reproduce manuscript figures

The notebook [`scripts/generate_manuscript_figures.ipynb`](scripts/generate_manuscript_figures.ipynb) (S24) creates seven figure groups from the **seven processed CSVs** in `data/analysis/`. It **does not** recompute the sequential water balance, soybean yield, or the upstream model outputs. The CSV content is unchanged from the locally validated package; only filenames and paths were updated.

From the project root:

```bash
python -m pip install -r requirements.txt
jupyter lab scripts/generate_manuscript_figures.ipynb
```

You may also open the notebook in VS Code and select your Python environment. Output files are written to `results/figures/manuscript_figures/` in PDF, SVG, PNG, and TIFF, according to the notebook's settings. Original figure output basenames (`Fig24_01`–`Fig24_07`) were deliberately retained for traceability with the validated manuscript graphics.

**Local validation:** The original S24 package ran on the researcher's Windows machine using Python 3.14.7; the researcher confirmed that the generated figures matched the approved manuscript figures. **Local validation:** The researcher reported successfully executing the reorganized S24 notebook and TS01 preparation script in VS Code on 17 November 2026. This validates local execution of renamed paths, not independent reproduction of upstream analyses.

## Supplementary tables

- `data/supplementary/ts01_spatial_units.csv`: TS01 table for the 17 UFs, derived from the vector intersection export and TS02 range information.
- `data/supplementary/ts02_soybean_planted_area_by_state.csv`: TS02, UF-level planted soybean areas from 2014–2023 (IBGE/SIDRA PAM Table 5457), with summary statistics.
- `data/supplementary/ts02_soybean_planted_area_long.csv`: identical annual areas in tidy format.
- `data/supplementary/ts01_ts02_tables.xlsx`: convenience workbook with the corresponding data and audit notes.
- `data/sources/ts01_spatial_intersections_original.csv`: unmodified S25 output. The Bahia `Ilhas Oceânicas` category is excluded only in the **derived** TS01 file, as documented in the supplementary audit.

Regenerate the derived TS01 CSV without Google Earth Engine access:

```bash
python scripts/prepare_spatial_units_table.py
```

The S25 vector-intersection notebook is provided as `scripts/extract_spatial_units.ipynb`. Its Earth Engine export task and output filename have been standardized to `ts01_spatial_intersections_original.csv` (original output basename: `25_TS01_resumo_espacial_v4.csv`, retained in the name mapping). The supplied source CSV remains byte-for-byte unchanged. S25 does not independently generate the TS02 table. Its GEE assets are not guaranteed to be public, so access may be required to reproduce those source spatial intersections.

## Earth Engine map viewer

- **Public application:** https://ee-marcosguedeslana.projects.earthengine.app/view/soybean-water-deficit-in-brazil-20142023
- **Public read-only collection S06:** `projects/ee-marcosguedeslana/assets/BH_SOJA_SEQUEIRO_Unificada`
- **Code prepared for GitHub:** `gee/soybean_water_deficit_viewer.js` — six fixed color classes (0–30, 30–90, 90–180, 180–280, 280–400, 400–620 mm). Values above 620 mm appear in the highest class **for display only**; the original DEF_ACUM raster values are not altered. The visualizer's file was reconstructed from the code approved in the chat; **compare with the exact live Earth Engine app source before release**.

## Sharing boundaries and scientific provenance

- **S12** (`Pipeline_DSM_Brazil_sisy_marcos_guedes_VSCode.ipynb`) is group-owned spatial modeling code and is **not included**. Contact the authors for procedural clarification; this statement does not promise distribution of the code.
- **Script 19** is not included as requested. Some input CSVs originate in preceding analyses; their upstream computational provenance should be documented separately without claiming S24 generated those inputs.
- Final sharing rights, licensing, contributors/author credit, and any restrictions on source GEE assets require confirmation with the research team. **No license or DOI has been assigned by this package.**
- The source municipal IBGE spreadsheet is **not included**; derived UF-level totals are supplied for manuscript table verification, with the originating source indicated.

## Documentation

- `docs/file_name_mapping.csv`: original/public name crosswalk and SHA-256 hashes.
- `docs/validation.md`: scope of checks and pending reproducibility verification.
- `docs/figure_data_audit.md`, `docs/supplementary_qa.md`: original data checking reports.
- `manifest_sha256.csv`: content hashes for all files except the manifest itself.
