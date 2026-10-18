# Revisão editorial V4

Em 18/10/2026 há 90 artigos com corpo: 14 existentes preservados byte a byte e 76 novos. O catálogo contém 108 propostas porque mantém também 12 serviços e seis hubs. O corpus materializado tem 94 documentos: 90 artigos, três serviços e um hub. Proposta, documento e publicação são contagens diferentes.

## Trabalho realizado

Os novos textos estão nos seis arquivos de autoria em `articles/` e em `content/documents/`. Foram lidos na redação/revisão pelo assistente, com perguntas distintas, exemplos hipotéticos explicitados, limites de interpretação e orientações documentais próprias. Os 14 textos anteriores não foram reescritos para inflar a entrega. `article-map.csv` relaciona as 90 URLs, seções, extensão, fontes e estado.

A conferência automatizada verifica 90 slugs e corpos distintos, pelo menos três seções, presença de fonte e ausência de aprovação inventada. O limite de palavras do teste é apenas um alarme contra corpo ausente; não certifica profundidade, correção ou utilidade. A qualidade técnica continua exigindo julgamento por artigo.

As respostas não copiam Ambiens ou ERM. Não foram produzidos cases fictícios, resultados atribuídos a clientes ou números de demanda de busca. O texto sobre Petrobras é leitura independente, sem alegar vínculo ou participação da Monitorar.

## Fontes e limites de verificação

| Grupo | Consulta realizada | Limite antes de publicação |
|---|---|---|
| Fugitivas | EPA Method 21 e trechos pertinentes do guia LDAR; separação entre medição, estimativa, cadastro e reparo | Revisão especializada por artigo, manuais específicos para OGI/instrumentos e metodologia de inventário quando pertinente |
| Ar | EPA PM Basics e monitoramento ambiente; referência oficial CONAMA 506/2024 localizada e acessível pelo navegador de pesquisa | Confirmar edição, vigência, período e regras aplicáveis no momento da aprovação |
| Fumaça preta | Página oficial Inea Procon lida; fontes específicas corrigidas nos artigos 050–052 | Confirmar normas/revisões e habilitações atuais; não foi certificada habilitação da empresa |
| Petrobras | Página “Sobre o relatório” acessada pelo navegador de pesquisa; a captura HTTP local retornou aviso de indisponibilidade eleitoral | Não usar a captura local como prova do conteúdo do relatório; arquivar versão integral efetivamente aprovada |
| Ruído | Diretrizes OMS, calculadoras HSE e página BIPM JCGM localizadas/acessadas | OMS não fundamenta todo procedimento acústico. Falta validação com referências técnicas específicas; NBR 10151 integral não foi lida nem reproduzida |
| Áreas | EPA RSL User's Guide: introdução, limites de triagem e pressupostos de exposição | O PDF CETESB pretendido estava bloqueado/redirecionado. Referência EPA é conceitual, não substitui procedimento brasileiro; completar referências específicas de amostragem/custódia |
| Licenciamento | LC 140/2011 e Lei 15.190/2025 disponíveis em capturas locais | Download não equivale a leitura jurídica integral. Confirmar texto consolidado, transição, jurisdição e procedimento de cada caso |
| SMS e capacitação | Portal oficial NR-1 localizado e consultado como referência | Validar itens vigentes e normas específicas; referências próprias de auditoria ainda precisam ser vinculadas às afirmações técnicas |
| HAZOP | Orientação HSE sobre modificações lida; manual DOE localizado | Não foi alegada leitura integral de norma paga nem formação de equipe técnica real |
| Equipamentos | Manual técnico Dräger X-am 5600 acessível pela pesquisa (68 páginas); manual geral de sensores bloqueado no download direto | Validar seções e manuais exatos antes de liberar alegações sobre modelos, testes, interferências e seleção |

Os URLs de consulta não são selos de que todas as afirmações foram verificadas. As capturas de `evidence/sources/` mantêm falhas e redirecionamentos; o registro de aprovação de fontes não foi artificialmente preenchido.

## Estado de aprovação

Todos os artigos seguem sem autor, revisor técnico e aprovação humana atribuídos. Os novos documentos estão em `technical_review`, com alegações pendentes e `indexability: false`. Os antigos mantêm seus campos anteriores, mas também não são elegíveis para publicação. O manifesto público permanece vazio.

A prévia local mostra os 90 artigos em oito páginas, com seis no último lote, busca e ligações relacionadas. A versão pública mantém os rascunhos fora do HTML, dos scripts, do índice de busca e do sitemap. Não foi ativado agendamento ou publicação automática.

Para liberar artigos: designar pessoas reais autorizadas, revisar tecnicamente os textos e fontes específicos, corrigir o que for necessário, registrar evidências/versões e aprovar pelo fluxo existente. Nenhuma dessas aprovações é inferida de um build aprovado.
