# Auditoria estrutural — sete tabelas utilizadas no Script 24

Os arquivos foram examinados sem recomputar o balanço hídrico, a produtividade ou os rasters de entrada. A consistência estrutural não equivale à validação integral do método.

| Arquivo | Linhas | Chave lógica | Cobertura |
|---|---:|---|---|
| DEF_macroregioes_2014_2023.csv | 50 | ano × macro | 5 × 10 |
| DEF_microregioes_2014_2023.csv | 200 | ano × codigo_micro | 20 × 10 |
| ranking_DEF_microregioes.csv | 20 | codigo_micro | 20 regiões |
| DEF_solos_2014_2023.csv | 50 | ano × classe_solo | 5 × 10 |
| DEF_medio_solo_por_macroregiao.csv | 250 | ano × classe_solo × macro | 5 × 5 × 10 |
| Analise22_07_solo_anual_DEF_produtividade.csv | 50 | ano × classe_solo | 5 × 10 |
| Analise22_09_solo_macro_anual_DEF_produtividade.csv | 250 | ano × classe_solo × macro | 5 × 5 × 10 |

**Soma:** 870 registros de dados.

## Verificações realizadas

- [OK] Arquivos legíveis como CSV `;` em UTF-8-SIG; nenhum campo vazio nas linhas verificadas.
- [OK] Chaves lógicas únicas por arquivo e cobertura prevista de 2014–2023.
- [OK] Cinco classes de solo iguais nas quatro tabelas com variável `classe_solo`.
- [OK] Os 20 códigos de microrregião do ranking coincidem com os da tabela anual.
- [OK] Ranking das 20 regiões coincide com a ordem decrescente das médias anuais aritméticas de DEF_ACUM (2014–2023).
- [OK] `def_min` <= `def_mean` <= `def_max` nos arquivos que contêm mínimos e máximos.
- [OK] Produtividade em kg ha⁻¹ coincide com a conversão de sacas ha⁻¹ de 60 kg nas duas tabelas de análise 22, dentro de 0,01 kg ha⁻¹.

## Limitações e pendências

- [INFORMAÇÃO NECESSÁRIA] Identificação da procedência computacional original de cada CSV; os nomes dos arquivos são apenas pistas.
- [CONFIRMAR COM O PESQUISADOR] Autorização e licença para distribuição dos arquivos e scripts.
- [INFORMAÇÃO NECESSÁRIA] Confirmar as legendas e a nomenclatura no manuscrito final.
- [INFORMAÇÃO NECESSÁRIA] Script 25 / TS01 / TS02 ainda fora do pacote.
- [NÃO VERIFICADO] Reprocessamento e validação independente das estatísticas extraídas de rasters.
- [NÃO VERIFICADO] Correlação com produtividade, consistência das agregações e incertezas dos dados originais.
- [NÃO VERIFICADO] Versões de software efetivamente usadas no processamento original.

Os arquivos foram **copiados sem edição de conteúdo**; somente sufixos `(1)` em alguns nomes de arquivos foram retirados para respeitar o código do Script 24.

## Teste de execução da cópia portável do Script 24

- [OK] Todas as células de código executadas em ordem, usando os sete CSVs incluídos no pacote.
- [OK] As sete funções de geração de figura rodaram sem erro em ambos os modos de títulos de eixos, com exportação desabilitada para o teste lógico.
- [OK] Foram gerados sete arquivos PDF em uma segunda execução de teste no modo `no_axis_titles` (sem alteração das fórmulas, dados e parâmetros visuais).
- [NÃO VERIFICADO] Exportação PNG/TIFF/SVG na cópia publicável e inspeção gráfica detalhada.
- [NÃO VERIFICADO] Reprodutibilidade com as versões exatas do ambiente computacional de origem.

**Ambiente deste teste, não do processamento original:** Python com NumPy 2.3.5, pandas 2.2.3, Matplotlib 3.10.8, Pillow 12.3.0. Esses valores não devem ser copiados para o método científico como versões utilizadas originalmente.
