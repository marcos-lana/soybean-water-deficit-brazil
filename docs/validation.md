# Validation and publication boundary

## Local validation record

- **S24:** The researcher reported successful execution of the reorganized figure-generation notebook in VS Code on 17 November 2026, using seven processed CSVs and confirming consistency with the manuscript figures. **Those CSVs are no longer in this public repository.**
- **S25:** Its Earth Engine table-export basename was standardized. The original GEE task was not re-executed in this publication workflow. Source and supplementary CSVs have been removed from the public branch.
- **TS01 preparation:** The standalone preparation script was locally tested by the researcher, but its required CSV inputs are not publicly distributed here.
- **GEE viewer:** The live application was tested publicly by the researcher. On 17 November 2026, the JavaScript supplied from the Earth Engine editor replaced the earlier reconstructed copy. An independent deployment snapshot was not obtained.

## Public release boundary

All `.csv` and `.xlsx` files, including processed figure inputs and supplementary tables, were removed from the latest public branch at the researcher's explicit request. Research data must not be inferred to be publicly available from the retained scripts or historical audit documentation. The latest branch therefore does **not** provide complete reproducibility of manuscript figures or supplementary tables.

**Important:** Standard GitHub file deletion does not erase prior commits. The deleted tabular files may remain retrievable via commit history until a separate repository-history purge is completed.

The original models and spreadsheets for the DEF_ACUM calculation, group-owned S12, and Script 19 were not included in this repository. The public GEE image collection remains separately accessible and was not modified by this change.
