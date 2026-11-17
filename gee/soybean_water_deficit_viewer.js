/**
 * SOYBEAN WATER DEFICIT IN BRAZIL (2014–2023)
 * Published visualizer for accumulated water deficit (DEF_ACUM, mm).
 * Collection S06: BH_SOJA_SEQUEIRO_Unificada
 * Time reference: IBGE/PAM harvest year.
 * Six fixed classes corresponding to the manuscript map legend.
 * This file is reconstructed from the approved code in the conversation;
 * compare it to the app's current published source before final GitHub publication.
 */

var colSoja = ee.ImageCollection(
  'projects/ee-marcosguedeslana/assets/BH_SOJA_SEQUEIRO_Unificada'
);
var brasil = ee.FeatureCollection('FAO/GAUL/2015/level0')
  .filter(ee.Filter.eq('ADM0_NAME', 'Brazil'));
var estados = ee.FeatureCollection('FAO/GAUL/2015/level1')
  .filter(ee.Filter.eq('ADM0_NAME', 'Brazil'));
var BANDA = 'DEF_ACUM';
var CORES = ['#1a9850','#91cf60','#d9ef8b','#fee08b','#f46d43','#7f0000'];
var CLASSES = ['0–30','30–90','90–180','180–280','280–400','400–620'];
var currentAno = '2023';
var requestId = 0;

function classificarDEF(imagem) {
  var def = imagem.select(BANDA);
  var visual = def.clamp(0, 620);
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
var VIS = {min:0, max:5, palette:CORES};

var panel = ui.Panel({
  style:{width:'325px',padding:'15px',backgroundColor:'#ffffff'}
});
panel.add(ui.Label('Soybean Water Deficit in Brazil',{
  fontSize:'17px',fontWeight:'bold',color:'#245b37',margin:'0 0 6px 0'
}));
panel.add(ui.Label('Accumulated Water Deficit | 2014–2023',{
  fontSize:'12px',color:'#555',margin:'0 0 8px 0'
}));
panel.add(ui.Label('Temporal reference: IBGE harvest year',{
  fontSize:'11px',color:'#777',fontStyle:'italic',margin:'0 0 15px 0'
}));
panel.add(ui.Label('Select harvest year:',{
  fontWeight:'bold',fontSize:'13px'
}));
var selectAno = ui.Select({
  items:['2014','2015','2016','2017','2018','2019','2020','2021','2022','2023'],
  value:currentAno,
  style:{stretch:'horizontal',margin:'5px 0 10px 0'},
  onChange:function(ano){currentAno=ano;atualizarMapa();}
});
panel.add(selectAno);
panel.add(ui.Label('Status:',{fontWeight:'bold',fontSize:'12px'}));
var statusLabel=ui.Label('Loading...',{
  fontSize:'12px',color:'#555',margin:'4px 0 15px 0'
});
panel.add(statusLabel);
panel.add(ui.Label('About the indicator',{
  fontWeight:'bold',fontSize:'13px',margin:'10px 0 6px 0'
}));
panel.add(ui.Label(
  'DEF_ACUM (mm) represents accumulated crop '+
  'evapotranspirative demand not met by soil water '+
  'availability during the growing-season window '+
  'considered in the sequential water balance. '+
  'Higher values indicate greater accumulated water deficit.',
  {fontSize:'11px',color:'#333'}
));
panel.add(ui.Label(
  'All years use the same six water-deficit classes '+
  'and colors adopted in the study. Values above '+
  '620 mm are displayed in the highest color class.',
  {fontSize:'11px',color:'#666',fontStyle:'italic',margin:'12px 0 0 0'}
));

var legend=ui.Panel({
  style:{position:'bottom-right',padding:'12px',backgroundColor:'#ffffff',width:'205px'}
});
function atualizarLegenda(ano) {
  legend.clear();
  legend.add(ui.Label('Water deficit (mm)',{
    fontWeight:'bold',fontSize:'13px',margin:'0 0 4px 0'
  }));
  legend.add(ui.Label('Harvest year: '+ano,{
    fontSize:'11px',color:'#666',margin:'0 0 10px 0'
  }));
  for (var i=0;i<CLASSES.length;i++) {
    var colorBox=ui.Label('',{
      backgroundColor:CORES[i],padding:'8px',width:'20px',margin:'0 8px 4px 0'
    });
    var description=ui.Label(CLASSES[i],{
      fontSize:'12px',margin:'1px 0 4px 0'
    });
    legend.add(ui.Panel({
      widgets:[colorBox,description],layout:ui.Panel.Layout.Flow('horizontal')
    }));
  }
  legend.add(ui.Label('Fixed classes | 2014–2023',{
    fontSize:'10px',color:'#777',margin:'8px 0 0 0'
  }));
}

function atualizarMapa() {
  requestId+=1;
  var atualizacao=requestId;
  var ano=currentAno;
  Map.layers().reset();
  statusLabel.setValue('Loading data for '+ano+'...');
  var filtrada=colSoja.filter(
    ee.Filter.stringContains('system:index','_AnoIBGE_'+ano)
  );
  filtrada.aggregate_array('system:index').evaluate(function(ids,erro){
    if (atualizacao!==requestId)return;
    if (erro||!ids||ids.length===0){
      statusLabel.setValue('Error: no images found for '+ano);
      print('Error:',erro);
      return;
    }
    statusLabel.setValue(ids.length+' images identified — '+ano);
    print('Images used in '+ano+':',ids);
    if(ids.length!==17)print('WARNING: expected 17 images; found',ids.length);
    var imagem=filtrada.select(BANDA).mosaic().clip(brasil);
    Map.addLayer(classificarDEF(imagem),VIS,'DEF_ACUM — '+ano);
    Map.addLayer(ee.Image().paint(estados,0,1),
      {palette:['aaaaaa']},'State boundaries',true,0.7);
    atualizarLegenda(ano);
  });
}

ui.root.insert(0,panel);
Map.add(legend);
Map.setCenter(-55,-15,4);
Map.setOptions('ROADMAP');
atualizarMapa();
