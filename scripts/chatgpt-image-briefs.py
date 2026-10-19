"""Write the image requests the owner pastes into ChatGPT, one new cover per editorial page.

ChatGPT generates the images with the owner's own chat quota; nothing here talks to ChatGPT. The owner downloads the
images into imagens-chatgpt/ without renaming them, and scripts/import-chatgpt-covers.py matches and publishes them.
Writes imagens-chatgpt/briefs.json (one brief per document) and imagens-chatgpt/pedidos.html (blocks with copy buttons).
"""
import html, json, pathlib
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'imagens-chatgpt'
BLOCK = 4

STYLE = ('Estilo para todas: fotografia editorial realista, formato paisagem 3:2, luz natural, cores naturais, cenário '
         'industrial ou ambiental no Brasil, profundidade de campo rasa. Equipe de campo com macacão ou camisa azul-marinho '
         'com faixas refletivas e capacete branco. Toda pessoa que usar capacete ou uniforme leva o logo da Monitorar enviado '
         'no início da conversa: pequeno e nítido no peito e nas costas do uniforme (versão de texto branco) e na frente do '
         'capacete (versão de texto azul-escuro), fiel ao desenho e às cores, sem mudar as letras. Fora o logo da Monitorar, '
         'nenhum outro texto, letra, número legível, logotipo, marca ou marca d\'água. Pessoas de costas, de longe ou sem '
         'rosto reconhecível.')

# Sent once at the start of each ChatGPT conversation, together with the two logo files from imagens-chatgpt/logo/.
OPENING = ('Vou pedir várias imagens nesta conversa. Os dois arquivos anexados são o logo da Monitorar Consultoria: um com o '
           'texto branco, para fundo escuro, e outro com o texto azul-escuro, para fundo claro. Em todas as imagens, toda pessoa '
           'com capacete ou uniforme usa esse logo, pequeno e fiel ao desenho, no peito e nas costas do uniforme azul-marinho '
           '(versão de texto branco) e na frente do capacete branco (versão de texto azul-escuro). Não gere nada agora; '
           'responda só "ok".')
# The official logo files on a solid background, so ChatGPT can see the white lettering of the dark version.
LOGOS = (('public/moni2.png', (29, 42, 58), 'logo-fundo-escuro.png'), ('public/moni3.png', (255, 255, 255), 'logo-fundo-claro.png'))
# Images already downloaded and kept: no person in uniform, so the logo rule does not apply to them.
KEEP = {'006', '013'}

# One scene per document id. Concrete, varied, faithful to the subject of the page, nothing that implies a real client.
SCENES = {
    '002': 'Técnico com analisador portátil de compostos orgânicos voláteis, sonda encostada numa válvula, em área de processo de refinaria com tubulações ao fundo.',
    '006': 'Medidor de nível sonoro num tripé com protetor de vento na calçada de um bairro residencial vizinho a uma fábrica, ao entardecer.',
    '009': 'Mesa de reunião com grandes diagramas de tubulação impressos e mãos apontando linhas do processo, rostos fora do quadro.',
    '013': 'Vista ampla de uma unidade de processo petroquímica com malha densa de tubulações, válvulas e flanges, luz dourada de fim de tarde.',
    '019': 'Close da gaxeta da haste de uma válvula industrial com um leve vapor escapando, tubulações desfocadas ao fundo.',
    '020': 'Chaminé industrial soltando vapor ao fundo e, em primeiro plano, o flange de uma tubulação de processo.',
    '021': 'Técnico ensacando uma válvula com saco plástico ligado a um amostrador portátil de vazão, maleta de equipamentos aberta ao lado.',
    '022': 'Técnico de prancheta na mão diante de válvulas com pequenas etiquetas metálicas de identificação presas por arame, analisador portátil na outra mão.',
    '023': 'Mesa de escritório técnico com propostas impressas, capacete de segurança branco e um analisador portátil; janela com vista para uma indústria.',
    '024': 'Vista aérea de drone de uma planta industrial com unidades de processo, tanques e ruas internas.',
    '025': 'Equipe de campo de costas num briefing de segurança ao lado de uma van de equipamentos, em pátio industrial pela manhã.',
    '026': 'Close de uma etiqueta metálica de identificação presa com arame a uma válvula de aço, sem números legíveis.',
    '027': 'Válvula instalada no alto de um pipe rack, vista de baixo, acima de uma plataforma estreita, mostrando o difícil acesso.',
    '028': 'Mecânico apertando os parafusos de um flange com chave de torque; ao fundo, um colega com analisador portátil aguarda para medir de novo.',
    '029': 'Tablet industrial robusto, com a tela desfocada, apoiado sobre uma tubulação ao lado de uma válvula.',
    '030': 'Mesa com gráficos impressos abstratos de barras e linhas e um capacete de segurança, em escritório técnico de uma planta.',
    '031': 'Mãos folheando um relatório técnico encadernado, com fotos de componentes industriais nas páginas e texto ilegível.',
    '032': 'Técnico segurando uma câmera robusta de imagem óptica de gás apontada para tubulações, ao lado de um colega com analisador portátil.',
    '033': 'Close extremo da ponta da sonda de um analisador portátil a poucos centímetros da junta de um flange.',
    '034': 'Visor de um analisador portátil com dígitos desfocados, ao lado de um medidor de vazão, em bancada de campo.',
    '035': 'Bancada de campo com cilindros de gás de calibração, regulador de pressão e um analisador portátil ligado por mangueira.',
    '036': 'Diversos detectores e sensores portáteis de gás lado a lado sobre uma bancada, frascos de amostra ao fundo.',
    '037': 'Estação meteorológica portátil com anemômetro de conchas e biruta, numa área industrial sob céu nublado.',
    '038': 'Técnico comparando duas pastas de relatórios abertas sobre uma bancada, com uma unidade de processo ao fundo pela janela.',
    '039': 'Tanques de armazenamento e uma tocha de queima (flare) acesa ao entardecer, num polo petroquímico.',
    '040': 'Válvula industrial com uma etiqueta amarela de sinalização presa ao volante, técnico desfocado ao fundo com analisador.',
    '041': 'Topo de um tanque de armazenamento de teto flutuante com escotilhas, visto do alto da escada de acesso.',
    '042': 'Duas pessoas de costas revisando dados num notebook com a tela desfocada, numa sala de controle com janela para a planta.',
    '043': 'Montagem de uma nova tubulação com andaimes e tubos novos ao lado de tubulações antigas numa unidade industrial.',
    '044': 'Plataforma de petróleo no mar ao amanhecer, sem logotipos nem pinturas de empresa.',
    '045': 'Amostrador de grandes volumes de partículas num abrigo metálico sobre uma laje, com a cidade ao fundo.',
    '046': 'Técnico posicionando uma estação de monitoramento de partículas em área aberta perto de um pátio industrial.',
    '047': 'Estação de monitoramento da qualidade do ar ao lado de uma avenida movimentada, ônibus e carros desfocados.',
    '048': 'Filtros de fibra de vidro com material particulado sobre uma bancada de laboratório, manuseados com pinça.',
    '049': 'Chaminé industrial com plataforma de amostragem e sonda de coleta instalada; ao fundo, um bairro.',
    '050': 'Escapamento de um caminhão a diesel soltando fumaça escura num pátio, foco no escapamento.',
    '051': 'Técnico avaliando a fumaça de um caminhão a diesel com um equipamento portátil num pátio de frota.',
    '052': 'Frota de caminhões estacionados lado a lado num pátio, técnico de costas com prancheta.',
    '053': 'Trabalhador com protetor auricular tipo concha numa área industrial em primeiro plano; ao fundo, o muro da fábrica e casas vizinhas.',
    '054': 'Técnico montando um medidor de nível sonoro num tripé ao lado do muro de uma indústria, no fim da tarde.',
    '055': 'Rua residencial à noite com uma fábrica iluminada ao fundo e um medidor de nível sonoro num tripé em primeiro plano.',
    '056': 'Medidor de nível sonoro num tripé numa praça de bairro ao anoitecer, luzes da rua acendendo.',
    '057': 'Relatório impresso com gráficos de nível sonoro abstratos sobre uma mesa, ao lado de um medidor de nível sonoro.',
    '058': 'Medidor de nível sonoro num tripé numa rua residencial tranquila, com casas e céu limpo.',
    '059': 'Janela de uma casa com cortina, de onde se vê uma indústria próxima ao entardecer; xícara no parapeito, sem pessoas.',
    '060': 'Terreno industrial desativado com mato alto e galpões antigos sob céu nublado.',
    '061': 'Mesa com fotografias aéreas antigas e mapas sem texto legível, lupa e lápis.',
    '062': 'Sondagem ambiental com perfuratriz num terreno, técnico com EPI e tubos de amostra de solo.',
    '063': 'Frascos de amostra de água e de solo enfileirados numa caixa térmica ao lado de um poço de monitoramento.',
    '064': 'Mãos de luvas fechando uma caixa térmica com frascos de amostra lacrados e etiquetas em branco.',
    '065': 'Testemunhos de sondagem de solo dispostos em caixas sobre uma mesa ao ar livre.',
    '066': 'Sistema de remediação com tubulações, bombas e um tanque de tratamento instalado num terreno.',
    '067': 'Canteiro de obras de uma nova unidade industrial, com estrutura metálica em montagem e guindaste.',
    '068': 'Pastas e documentos organizados sobre uma mesa, com capacete de segurança e uma planta baixa sem texto legível.',
    '069': 'Quadro de acompanhamento com cartões coloridos sem texto, pessoa de costas apontando um deles.',
    '070': 'Calendário de mesa e documentos ao lado de uma janela com vista para uma fábrica.',
    '071': 'Expansão de uma fábrica com um galpão novo em construção ao lado do galpão existente.',
    '072': 'Fachada de um prédio público com a bandeira do Brasil, sem placas legíveis.',
    '073': 'Equipe de campo com GPS e prancheta numa área de vegetação nativa às margens de um rio.',
    '074': 'Diálogo de segurança no início do turno numa área industrial, trabalhadores de capacete de costas.',
    '075': 'Pessoa organizando fichários numa prateleira de escritório técnico, de costas.',
    '076': 'Auditor de capacete e prancheta caminhando numa área industrial ao lado de um supervisor, ambos de costas.',
    '077': 'Fichários e caixas de arquivo organizados com etiquetas coloridas sem texto.',
    '078': 'Técnico apontando um guarda-corpo danificado numa passarela industrial.',
    '079': 'Quadro de gestão à vista com gráficos abstratos sem texto, num corredor de fábrica.',
    '080': 'Procedimento impresso num suporte de acrílico ao lado de uma máquina, trabalhador consultando, texto ilegível.',
    '081': 'Close de um grande diagrama de tubulação impresso com um trecho destacado a marca-texto, sem texto legível.',
    '082': 'Pilha de diagramas e fichas técnicas de equipamentos com régua de escala e lápis.',
    '083': 'Mesa de reunião com várias pessoas, rostos fora do quadro, e um projetor exibindo um diagrama de processo.',
    '084': 'Engenheiro inspecionando uma válvula de alívio recém-instalada numa planta química.',
    '085': 'Sala de treinamento industrial com capacetes sobre as mesas e instrutor de costas diante de uma tela sem texto.',
    '086': 'Trabalhador praticando o uso de um detector de gases sob a observação de um instrutor numa área de treinamento.',
    '087': 'Trabalhador com máscara respiratória facial inteira e detector de gases preso ao peito, numa área industrial.',
    '088': 'Detector fixo de gás instalado na parede de uma área industrial e um detector portátil preso ao cinto de um trabalhador.',
    '089': 'Estação de teste de resposta com um detector portátil encaixado e um pequeno cilindro de gás ao lado.',
    '090': 'Bancada com diferentes detectores de gás e respiradores alinhados ao lado de um catálogo fechado.',
    '091': 'Céu urbano com leve névoa de poluição sobre a cidade ao amanhecer.',
    '092': 'Técnico fazendo manutenção numa estação automática de monitoramento do ar, porta do abrigo aberta, cabos e equipamentos.',
    '093': 'Cidade brasileira com céu limpo e montanhas ao fundo, com uma estação de monitoramento do ar em primeiro plano.',
    '094': 'Dois compressores industriais lado a lado numa casa de máquinas.',
    '095': 'Bate-estacas trabalhando num canteiro de obras urbano.',
    '096': 'Close de um calibrador acústico encaixado no microfone de um medidor de nível sonoro.',
    '097': 'Laboratório de análises ambientais com cromatógrafo e frascos de amostra, técnico de costas.',
    '098': 'Vista aérea de um bairro residencial ao lado de um antigo terreno industrial.',
    '099': 'Terreno de uma antiga fábrica se transformando em empreendimento residencial, com guindastes e prédios novos.',
    '100': 'Mesa com documentos organizados em pastas coloridas e um notebook com a tela desfocada.',
    '101': 'Pastas de documentos e um carimbo sobre uma mesa de madeira, sem texto legível.',
    '102': 'Auditório com pessoas sentadas, de costas, assistindo a uma apresentação numa tela sem texto.',
    '103': 'Mãos de luvas separando documentos de uma pilha com etiquetas coloridas.',
    '104': 'Técnico de uniforme conversando com um representante da empresa contratante, de camisa social e sem capacete, numa sala de controle com janela para a planta, ambos de costas.',
    '105': 'Trecho de tubulação com válvulas e um transmissor de pressão numa unidade de processo, close.',
    '106': 'Treinamento prático de resgate em espaço confinado com tripé e equipamento, participantes de costas.',
    '107': 'Close de um detector de gases aberto numa bancada de manutenção, sensor exposto e ferramentas finas.',
    '108': 'Manual técnico fechado e um detector de gases sobre uma bancada, mãos de luvas.',
}


def main():
    docs = [json.loads(p.read_text(encoding='utf-8')) for p in sorted((ROOT / 'content' / 'documents').glob('*.json'))]
    missing = [d['id'] for d in docs if d['id'] not in SCENES]
    extra = [k for k in SCENES if k not in {d['id'] for d in docs}]
    if missing or extra:
        raise SystemExit(f'scenes out of sync with content/documents: missing {missing}, extra {extra}')
    briefs = [{'code': d['id'], 'slug': d['slug'], 'title': d['title'], 'scene': SCENES[d['id']]} for d in docs]
    OUT.mkdir(exist_ok=True)
    (OUT / 'briefs.json').write_text(json.dumps(briefs, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    (OUT / 'logo').mkdir(exist_ok=True)
    for source, background, name in LOGOS:
        mark = Image.open(ROOT / source).convert('RGBA')
        canvas = Image.new('RGBA', (mark.width + 80, mark.height + 80), background + (255,))
        canvas.alpha_composite(mark, (40, 40))
        canvas.convert('RGB').save(OUT / 'logo' / name)

    todo = [b for b in briefs if b['code'] not in KEEP]
    blocks = [todo[i:i + BLOCK] for i in range(0, len(todo), BLOCK)]
    parts = []
    for n, block in enumerate(blocks, 1):
        lines = [f'Gere {len(block)} imagens separadas, uma para cada item abaixo, na ordem. Não junte tudo numa imagem só.', STYLE, '']
        lines += [f'{i}. {b["scene"]}' for i, b in enumerate(block, 1)]
        text = '\n'.join(lines)
        items = ''.join(
            f'<li><span class="code">{b["code"]}</span> {html.escape(b["title"])}<br><small>{html.escape(b["scene"])}</small> '
            f'<button data-copy="{html.escape(b["scene"] + chr(10) + chr(10) + STYLE, quote=True)}">Copiar só esta</button></li>'
            for b in block)
        parts.append(f'<section id="b{n}"><h2>Bloco {n} de {len(blocks)}</h2>'
                     f'<button class="main" data-copy="{html.escape(text, quote=True)}">Copiar bloco {n}</button>'
                     f'<label><input type="checkbox"> feito</label><ol>{items}</ol></section>')
    page = f'''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Pedidos de imagem para o ChatGPT</title>
<style>body{{font:16px/1.5 system-ui,sans-serif;max-width:860px;margin:0 auto;padding:16px;background:#f5f6f2;color:#1d2a3a}}
section{{background:#fff;border:1px solid #d9e2d3;border-radius:12px;padding:16px;margin:16px 0}}h2{{margin:0 0 8px}}
button{{cursor:pointer;border:1px solid #6fae3a;background:#fff;border-radius:8px;padding:4px 10px;margin:4px 0}}button.main{{background:#6fae3a;color:#fff;font-weight:600;padding:8px 14px}}
.code{{font-weight:700;color:#3b6e17}}small{{color:#556}}li{{margin:10px 0}}.ok{{background:#1d2a3a;color:#fff}}</style></head><body>
<h1>Pedidos de imagem para o ChatGPT</h1>
<ol><li>Abra uma <b>conversa nova</b> no <a href="https://chatgpt.com" target="_blank" rel="noopener">ChatGPT</a>, anexe os dois logos da pasta <code>{html.escape(str(OUT / 'logo'))}</code> e envie a <b>mensagem de abertura</b>.</li>
<li>Clique em <b>Copiar bloco</b>, cole e envie. Se ele fizer só uma imagem, escreva <b>continue</b>.</li>
<li>A cada 3 ou 4 blocos, comece outra conversa e repita a mensagem de abertura com os logos, para o logo não perder a forma.</li>
<li>Baixe cada imagem nesta pasta, <b>sem renomear</b>: <code>{html.escape(str(OUT))}</code></li>
<li>Pode fazer em várias vezes, conforme o limite do chat. Quando terminar (ou parar), avise o Claude.</li></ol>
<p>Já aprovadas do primeiro lote (sem pessoas de uniforme, não precisam do logo): {', '.join(sorted(KEEP))}.</p>
<section><h2>Mensagem de abertura (com os 2 logos anexados)</h2><p>{html.escape(OPENING)}</p><button class="main" data-copy="{html.escape(OPENING, quote=True)}">Copiar mensagem de abertura</button></section>
{''.join(parts)}
<script>for(const b of document.querySelectorAll('button[data-copy]'))b.onclick=async()=>{{const t=b.dataset.copy;try{{await navigator.clipboard.writeText(t)}}catch(e){{const a=document.createElement('textarea');a.value=t;document.body.append(a);a.select();document.execCommand('copy');a.remove()}}b.classList.add('ok');b.textContent='Copiado';}}</script>
</body></html>'''
    (OUT / 'pedidos.html').write_text(page, encoding='utf-8')
    print(json.dumps({'briefs': len(briefs), 'blocks': len(blocks), 'page': str(OUT / 'pedidos.html')}, ensure_ascii=False))


if __name__ == '__main__':
    main()
