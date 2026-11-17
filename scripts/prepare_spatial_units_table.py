#!/usr/bin/env python3
"""Prepare an auditable TS01 publication table from the GEE S25 export and the TS02 IBGE/PAM summary.

Run at the repository root: python scripts/prepare_spatial_units_table.py
Standard-library only. Original files are never modified.
"""
from pathlib import Path
import csv

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / 'data' / 'sources' / 'ts01_spatial_intersections_original.csv'
TS02 = ROOT / 'data' / 'supplementary' / 'ts02_soybean_planted_area_by_state.csv'
OUT = ROOT / 'data' / 'supplementary' / 'ts01_spatial_units.csv'

TRANSLATION = {
    'Amazônia': 'Amazon', 'Mata Atlântica': 'Atlantic Forest',
    'Caatinga': 'Caatinga', 'Cerrado': 'Cerrado',
    'Pampa': 'Pampa', 'Pantanal': 'Pantanal',
    'Ilhas Oceânicas': 'Oceanic Islands'
}
FIELDS = [
    'Federative_Unit', 'UF', 'Soybean_planted_area_min_ha',
    'Soybean_planted_area_max_ha', 'Soybean_planted_area_range_1000ha',
    'MRS_intersected', 'REC_intersected', 'Biomes_intersected', 'Temporal_window',
    'Intersection_area_threshold_ha', 'Source_intersection_rule',
]

with RAW.open('r', encoding='utf-8-sig', newline='') as f:
    raw = list(csv.DictReader(f))
with TS02.open('r', encoding='utf-8-sig', newline='') as f:
    area = {r['UF']: r for r in csv.DictReader(f)}
assert len(raw) == 17 and len(area) == 17, 'Expected 17 UFs in both inputs'
assert set(r['SIGLA'] for r in raw) == set(area), 'UF codes differ'
assert len(set(r['SIGLA'] for r in raw)) == 17, 'Duplicate UF'

records = []
for r in raw:
    uf = r['SIGLA']
    a = area[uf]
    lo, hi = int(a['Minimum_ha']), int(a['Maximum_ha'])
    assert lo > 0 and hi >= lo
    assert lo == min(int(a[str(y)]) for y in range(2014,2024))
    assert hi == max(int(a[str(y)]) for y in range(2014,2024))
    codes_mrs = r['MRS_codigos'].strip() or '—'
    codes_rec = r['REC_codigos'].strip() or '—'
    assert int(r['MRS_n']) == (0 if codes_mrs == '—' else len(codes_mrs.split('; ')))
    assert int(r['REC_n']) == (0 if codes_rec == '—' else len(codes_rec.split('; ')))
    original_biomes = [s.strip() for s in r['Biomas_nomes'].split(';') if s.strip()]
    assert len(original_biomes) == int(r['Biomas_n'])
    # Documented editorial filter applied ONLY to the derived table,
    # following the final manuscript TS01; do not modify the raw GEE export.
    derived_biomes = [s for s in original_biomes if not (uf == 'BA' and s == 'Ilhas Oceânicas')]
    biomes_en = [TRANSLATION.get(s,s) for s in derived_biomes]
    window = r['Janela_temporal'].strip().replace('-', '–')
    assert window in ('Sep–May', 'Mar–Oct')
    records.append({
        'Federative_Unit': a['Federative_Unit'], 'UF': uf,
        'Soybean_planted_area_min_ha': lo,
        'Soybean_planted_area_max_ha': hi,
        'Soybean_planted_area_range_1000ha': f'{lo/1000:,.1f}–{hi/1000:,.1f}',
        'MRS_intersected': codes_mrs, 'REC_intersected': codes_rec,
        'Biomes_intersected': '; '.join(biomes_en),
        'Temporal_window': window,
        'Intersection_area_threshold_ha': int(r['Area_min_intersecao_ha']),
        'Source_intersection_rule': r['Criterio_intersecao'],
    })
OUT.parent.mkdir(parents=True, exist_ok=True)
with OUT.open('w', encoding='utf-8-sig', newline='') as f:
    w = csv.DictWriter(f, fieldnames=FIELDS)
    w.writeheader(); w.writerows(records)
print(f'Success: {len(records)} UFs -> {OUT.relative_to(ROOT)}')
