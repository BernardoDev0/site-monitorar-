import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Privacy() {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="section-title">Política de Privacidade</h1>
          <p className="text-lg text-muted-foreground">
            Última atualização: 24 de setembro de 2025
          </p>
        </div>

        <Card className="card-service">
          <CardContent className="p-8 prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-primary">1. Informações Gerais</h2>
              <p className="text-muted-foreground leading-relaxed">
                A Monitorar Consultoria ("nós", "nosso" ou "empresa") está comprometida em proteger 
                e respeitar sua privacidade. Esta Política de Privacidade explica como coletamos, 
                usamos, divulgamos e protegemos suas informações quando você visita nosso site ou 
                utiliza nossos serviços.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-primary">2. Informações que Coletamos</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Podemos coletar e processar os seguintes tipos de informações:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Informações de Identificação Pessoal:</strong> Nome, endereço de e-mail, 
                número de telefone, empresa e cargo quando fornecidos voluntariamente.</li>
                <li><strong>Informações de Navegação:</strong> Endereço IP, tipo de navegador, 
                páginas visitadas, tempo de permanência no site.</li>
                <li><strong>Cookies:</strong> Utilizamos cookies para melhorar sua experiência 
                de navegação e analisar o tráfego do site.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-primary">3. Como Utilizamos suas Informações</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Utilizamos suas informações para:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Responder às suas consultas e solicitações de serviços</li>
                <li>Fornecer informações sobre nossos serviços e produtos</li>
                <li>Melhorar nosso site e serviços</li>
                <li>Cumprir obrigações legais e regulamentares</li>
                <li>Processos de recrutamento quando aplicável</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-primary">4. Compartilhamento de Informações</h2>
              <p className="text-muted-foreground leading-relaxed">
                Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, 
                exceto nas seguintes circunstâncias: quando necessário para fornecer nossos serviços, 
                quando exigido por lei, ou quando você der consentimento expresso para tal compartilhamento.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-primary">5. Segurança das Informações</h2>
              <p className="text-muted-foreground leading-relaxed">
                Implementamos medidas de segurança técnicas e organizacionais apropriadas para 
                proteger suas informações pessoais contra acesso não autorizado, alteração, 
                divulgação ou destruição. Isso inclui criptografia de dados, controles de acesso 
                e auditorias regulares de segurança.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-primary">6. Retenção de Dados</h2>
              <p className="text-muted-foreground leading-relaxed">
                Manteremos suas informações pessoais apenas pelo tempo necessário para cumprir 
                os propósitos para os quais foram coletadas, ou conforme exigido por lei. 
                Quando as informações não forem mais necessárias, elas serão excluídas ou 
                anonimizadas de forma segura.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-primary">7. Seus Direitos</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem os seguintes direitos:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Acesso às suas informações pessoais</li>
                <li>Correção de dados incompletos, inexatos ou desatualizados</li>
                <li>Exclusão de dados pessoais</li>
                <li>Portabilidade dos dados</li>
                <li>Revogação do consentimento</li>
                <li>Informação sobre com quem compartilhamos seus dados</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-primary">8. Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                Nosso site utiliza cookies para melhorar sua experiência de navegação. 
                Cookies são pequenos arquivos de texto armazenados em seu dispositivo. 
                Você pode configurar seu navegador para recusar cookies, mas isso pode 
                afetar a funcionalidade do site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-primary">9. Links para Sites de Terceiros</h2>
              <p className="text-muted-foreground leading-relaxed">
                Nosso site pode conter links para sites de terceiros. Não somos responsáveis 
                pelas práticas de privacidade desses sites. Recomendamos que você leia as 
                políticas de privacidade de todos os sites que visitar.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-primary">10. Alterações nesta Política</h2>
              <p className="text-muted-foreground leading-relaxed">
                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos 
                sobre alterações significativas publicando a nova política em nosso site. 
                A data da última atualização será indicada no topo desta página.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-primary">11. Contato</h2>
              <p className="text-muted-foreground leading-relaxed">
                Se você tiver dúvidas sobre esta Política de Privacidade ou desejar exercer 
                seus direitos relacionados aos dados pessoais, entre em contato conosco:
              </p>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-muted-foreground">
                  <strong>Monitorar Consultoria</strong><br />
                  E-mail: administrativo@monitorarconsultoria.com.br<br />
                  Telefone: (21) 3881-1212<br />
                  Endereço: Av. José Silva de Azevedo Neto, nº 200 - bloco 7 - loja 205<br />
                  Barra da Tijuca - Rio de Janeiro – RJ
                </p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}