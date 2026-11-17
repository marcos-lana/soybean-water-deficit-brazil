/**
 * SOYBEAN WATER DEFICIT IN BRAZIL (2014–2023)
 *
 * Aplicativo cartográfico para publicação científica
 * Coleção S06: BH_SOJA_SEQUEIRO_Unificada
 * Indicador: DEF_ACUM (mm)
 * Referência temporal: Ano IBGE/PAM
 *
 * Classes e cores conforme a legenda do manuscrito.
 */

// ============================================================
// 1. DADOS
// ============================================================

var colSoja = ee.ImageCollection(
  'projects/ee-marcosguedeslana/assets/BH_SOJA_SEQUEIRO_Unificada'
);

var brasil = ee.FeatureCollection('FAO/GAUL/2015/level0')
  .filter(ee.Filter.eq('ADM0_NAME', 'Brazil'));

var estados = ee.FeatureCollection('FAO/GAUL/2015/level1')
  .filter(ee.Filter.eq('ADM0_NAME', 'Brazil'));

var BANDA = 'DEF_ACUM';

var CORES = [
  '#1a9850',
  '#91cf60',
  '#d9ef8b',
  '#fee08b',
  '#f46d43',
  '#7f0000'
];

var CLASSES = [
  '0–30',
  '30–90',
  '90–180',
  '180–280',
  '280–400',
  '400–620'
];

var currentAno = '2023';
var requestId = 0;

// ============================================================
// 2. CLASSIFICAÇÃO CARTOGRÁFICA
// ============================================================

function classificarDEF(imagem) {

  var def = imagem.select(BANDA);

  // Limite superior apenas para visualização.
  // Os valores originais não são modificados.
  var visual = def.clamp(0, 620);

  // Classes 0, 1, 2, 3, 4 e 5.
  var classes = ee.Image(0)
    .where(visual.gte(30), 1)
    .where(visual.gte(90), 2)
    .where(visual.gte(180), 3)
    .where(visual.gte(280), 4)
    .where(visual.gte(400), 5)
    .updateMask(def.mask())
    .updateMask(def.gte(0))
    .rename('DEF_CLASS');

  return classes;
}

var VIS = {
  min: 0,
  max: 5,
  palette: CORES
};

// ============================================================
// 3. PAINEL LATERAL
// ============================================================

var panel = ui.Panel({
  style: {
    width: '325px',
    padding: '15px',
    backgroundColor: '#ffffff'
  }
});

panel.add(ui.Label(
  'Soybean Water Deficit in Brazil',
  {
    fontSize: '17px',
    fontWeight: 'bold',
    color: '#245b37',
    margin: '0 0 6px 0'
  }
));

panel.add(ui.Label(
  'Accumulated Water Deficit | 2014–2023',
  {
    fontSize: '12px',
    color: '#555',
    margin: '0 0 8px 0'
  }
));

panel.add(ui.Label(
  'Temporal reference: IBGE harvest year',
  {
    fontSize: '11px',
    color: '#777',
    fontStyle: 'italic',
    margin: '0 0 15px 0'
  }
));

// ============================================================
// 4. SELETOR DE ANO
// ============================================================

panel.add(ui.Label('Select harvest year:', {
  fontWeight: 'bold',
  fontSize: '13px'
}));

var selectAno = ui.Select({
  items: [
    '2014', '2015', '2016', '2017', '2018',
    '2019', '2020', '2021', '2022', '2023'
  ],
  value: currentAno,
  style: {
    stretch: 'horizontal',
    margin: '5px 0 10px 0'
  },
  onChange: function(ano) {
    currentAno = ano;
    atualizarMapa();
  }
});

panel.add(selectAno);

// ============================================================
// 5. STATUS
// ============================================================

panel.add(ui.Label('Status:', {
  fontWeight: 'bold',
  fontSize: '12px'
}));

var statusLabel = ui.Label('Loading...', {
  fontSize: '12px',
  color: '#555',
  margin: '4px 0 15px 0'
});

panel.add(statusLabel);

// ============================================================
// 6. DESCRIÇÃO DO INDICADOR
// ============================================================

panel.add(ui.Label('About the indicator', {
  fontWeight: 'bold',
  fontSize: '13px',
  margin: '10px 0 6px 0'
}));

panel.add(ui.Label(
  'DEF_ACUM (mm) represents accumulated crop ' +
  'evapotranspirative demand not met by soil water ' +
  'availability during the growing-season window ' +
  'considered in the sequential water balance. ' +
  'Higher values indicate greater accumulated water deficit.',
  {
    fontSize: '11px',
    color: '#333'
  }
));

panel.add(ui.Label(
  'All years use the same six water-deficit classes ' +
  'and colors adopted in the study. Values above ' +
  '620 mm are displayed in the highest color class.',
  {
    fontSize: '11px',
    color: '#666',
    fontStyle: 'italic',
    margin: '12px 0 0 0'
  }
));

// ============================================================
// 7. LEGENDA FIXA — SEIS CLASSES
// ============================================================

var legend = ui.Panel({
  style: {
    position: 'bottom-right',
    padding: '12px',
    backgroundColor: '#ffffff',
    width: '205px'
  }
});

function atualizarLegenda(ano) {

  legend.clear();

  legend.add(ui.Label(
    'Water deficit (mm)',
    {
      fontWeight: 'bold',
      fontSize: '13px',
      margin: '0 0 4px 0'
    }
  ));

  legend.add(ui.Label(
    'Harvest year: ' + ano,
    {
      fontSize: '11px',
      color: '#666',
      margin: '0 0 10px 0'
    }
  ));

  for (var i = 0; i < CLASSES.length; i++) {

    var colorBox = ui.Label('', {
      backgroundColor: CORES[i],
      padding: '8px',
      width: '20px',
      margin: '0 8px 4px 0'
    });

    var description = ui.Label(CLASSES[i], {
      fontSize: '12px',
      margin: '1px 0 4px 0'
    });

    var item = ui.Panel({
      widgets: [colorBox, description],
      layout: ui.Panel.Layout.Flow('horizontal')
    });

    legend.add(item);
  }

  legend.add(ui.Label(
    'Fixed classes | 2014–2023',
    {
      fontSize: '10px',
      color: '#777',
      margin: '8px 0 0 0'
    }
  ));
}

// ============================================================
// 8. ATUALIZAÇÃO DO MAPA
// ============================================================

function atualizarMapa() {

  requestId += 1;

  var atualizacao = requestId;
  var ano = currentAno;

  Map.layers().reset();

  statusLabel.setValue(
    'Loading data for ' + ano + '...'
  );

  // Padrão confirmado dos identificadores:
  // MT_AnoIBGE_2023, RS_AnoIBGE_2023 etc.

  var filtrada = colSoja.filter(
    ee.Filter.stringContains(
      'system:index',
      '_AnoIBGE_' + ano
    )
  );

  filtrada.aggregate_array('system:index')
    .evaluate(function(ids, erro) {

      if (atualizacao !== requestId) return;

      if (erro || !ids || ids.length === 0) {

        statusLabel.setValue(
          'Error: no images found for ' + ano
        );

        print('Error:', erro);
        return;
      }

      statusLabel.setValue(
        ids.length + ' images identified — ' + ano
      );

      print('Images used in ' + ano + ':', ids);

      if (ids.length !== 17) {
        print(
          'WARNING: expected 17 images; found',
          ids.length
        );
      }

      // Mosaico original de DEF_ACUM (mm)
      var imagem = filtrada
        .select(BANDA)
        .mosaic()
        .clip(brasil);

      // Classificação exclusiva para visualização
      var mapaClassificado = classificarDEF(imagem);

      Map.addLayer(
        mapaClassificado,
        VIS,
        'DEF_ACUM — ' + ano
      );

      // Limites dos estados
      Map.addLayer(
        ee.Image().paint(estados, 0, 1),
        {palette: ['aaaaaa']},
        'State boundaries',
        true,
        0.7
      );

      atualizarLegenda(ano);

    });
}

// ============================================================
// 9. INICIALIZAÇÃO
// ============================================================

ui.root.insert(0, panel);

Map.add(legend);

Map.setCenter(-55, -15, 4);

Map.setOptions('ROADMAP');

// Abre inicialmente no ano de 2023
atualizarMapa();
