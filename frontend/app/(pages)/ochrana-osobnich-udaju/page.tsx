import type {Metadata} from 'next'

export const metadata: Metadata = {
  title: 'Obchodní podmínky',
  description: 'Všeobecné obchodní podmínky pro nákup motorových dílů.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Zásady zpracování a ochrany osobních údajů
        </h1>
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">I. Základní ustanovení</h2>
          <p className="text-gray-600">
            <strong>1.</strong> Správcem osobních údajů podle čl. 4 bod 7 nařízení Evropského
            parlamentu a Rady (EU) 2016/679 o ochraně fyzických osob při zpracování osobních údajů a
            o volném pohybu těchto údajů (dále jen: &quot;GDPR&quot;) je NEURO s.r.o., DIČ:
            CZ19679041 se sídlem Prachnerova 642/10, Praha 5 150 00 (dále jen: &quot;správce&quot;).
          </p>
          <p className="text-gray-600">
            <strong>2.</strong> Kontaktní údaje správce jsou:
            <br />
            adresa: Prachnerova 642/10, Praha 5 150 00
            <br />
            email: info@hledammotory.cz
            <br />
            telefon: +420 724 704 764
          </p>
          <p className="text-gray-600">
            <strong>3.</strong> Osobními údaji jsou všechny informace o identifikované nebo
            identifikovatelné fyzické osobě; identifikovatelnou fyzickou osobou je fyzická osoba,
            kterou lze přímo nebo nepřímo identifikovat, zejména odkazem na určitý identifikátor,
            například jméno, identifikační číslo, lokační údaje, síťový identifikátor nebo pomocí
            jednoho nebo více specifických faktorů, fyziologických, genetických, mentálních,
            ekonomických, kulturních nebo společenských.
          </p>
          <p className="text-gray-600">
            <strong>4.</strong> Správce jmenoval/nejmenoval pověřence pro ochranu osobních údajů.
            Kontaktní údaje pověřence jsou:
          </p>
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">
            II. Zdroje a kategorie zpracovávaných osobních údajů
          </h2>
          <p className="text-gray-600">
            <strong>1.</strong> Správce zpracovává osobní údaje, které jste mu poskytli nebo osobní
            údaje, které správce získal na základě plnění Vaší objednávky.
          </p>
          <p className="text-gray-600">
            <strong>2.</strong> Správce zpracovává Vaše identifikační a kontaktní údaje a údaje
            nezbytné pro plnění smlouvy.
          </p>
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">
            III. Zákonný důvod a účel zpracování osobních údajů
          </h2>
          <div className="text-gray-600">
            <strong>1.</strong> Zákonným důvodem zpracování osobních údajů je:
            <ul className="list-disc list-inside ml-6">
              <li>plnění smlouvy mezi Vámi a správcem podle čl. 6 odst. 1 písm. b) GDPR,</li>
              <li>
                oprávněný zájem správce na poskytování přímého marketingu (pro zasílání obchodních
                oznámení a newsletterů) podle čl. 6 odst. 1 písm. f) GDPR,
              </li>
              <li>
                Váš souhlas se zpracováním pro účely poskytování přímého marketingu (pro zasílání
                obchodních oznámení a newsletterů) podle čl. 6 odst. 1 písm. a) GDPR ve spojení s §
                7 odst. 2 zákona č. 480/2004 Sb., o některých službách informační společnosti v
                případě, že nedošlo k objednávce zboží nebo služby.
              </li>
            </ul>
          </div>
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">IV. Doba uchovávání údajů</h2>
          <div className="text-gray-600">
            <strong>1.</strong> Správce uchovává osobní údaje:
            <ul className="list-disc list-inside ml-6">
              <li>
                po dobu nezbytnou k výkonu práv a povinností vyplývajících ze smluvního vztahu mezi
                Vámi a správcem a uplatňování nároků z těchto smluvních vztahů (po dobu 15 let od
                ukončení smluvního vztahu).
              </li>
              <li>
                po dobu, než je odvolán souhlas se zpracováním osobních údajů pro účely marketingu,
                nejdéle … let, pokud jsou osobní údaje zpracovávány na základě souhlasu.
              </li>
            </ul>
          </div>
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">
            V. Příjemci osobních údajů (subdodavatelé správce)
          </h2>
          <div className="text-gray-600">
            <strong>1.</strong> Příjemci osobních údajů jsou osoby:
            <ul className="list-disc list-inside ml-6">
              <li>podílející se na dodání zboží/služeb/realizaci plateb na základě smlouvy,</li>
              <li>
                zajišťující služby provozování e-shopu a další služby v souvislosti s provozováním
                e-shopu,
              </li>
              <li>zajišťující marketingové služby.</li>
            </ul>
          </div>
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">VI. Vaše práva</h2>
          <div className="text-gray-600">
            <strong>1.</strong> Za podmínek stanovených v GDPR máte:
            <ul className="list-disc list-inside ml-6">
              <li>právo na přístup ke svým osobním údajům,</li>
              <li>právo na opravu osobních údajů,</li>
              <li>právo na výmaz osobních údajů,</li>
              <li>právo podat námitku proti zpracovávání,</li>
              <li>právo na přenositelnost údajů.</li>
            </ul>
          </div>
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">
            VII. Podmínky zabezpečení osobních údajů
          </h2>
          <p className="text-gray-600">
            Správce prohlašuje, že přijal všechna technická a organizační opatření k zabezpečení
            osobních údajů.
          </p>
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">VIII. Závěrečná ustanovení</h2>
          <p className="text-gray-600">
            Odesláním objednávky z internetového objednávkového formuláře potvrzujete, že jste
            seznámen s podmínkami ochrany osobních údajů a že je v celém rozsahu přijímáte.
          </p>
        </section>
      </div>
    </div>
  )
}
