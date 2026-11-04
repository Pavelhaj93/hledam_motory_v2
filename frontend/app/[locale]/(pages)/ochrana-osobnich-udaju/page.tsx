import type {Metadata} from 'next'
import {setRequestLocale} from 'next-intl/server'
import type {Locale} from '@/app/lib/i18n'

type Props = {params: Promise<{locale: Locale}>}

type Copy = {
  metaTitle: string
  metaDescription: string
  h1: string
  s1h: string
  s1p1: string
  s1contactLabel: string
  s1addressLabel: string
  s1emailLabel: string
  s1phoneLabel: string
  s1p3: string
  s1p4: string
  s2h: string
  s2p1: string
  s2p2: string
  s3h: string
  s3intro: string
  s3li: string[]
  s4h: string
  s4intro: string
  s4li: string[]
  s5h: string
  s5intro: string
  s5li: string[]
  s6h: string
  s6intro: string
  s6li: string[]
  s7h: string
  s7p: string
  s8h: string
  s8p: string
}

const ADDRESS = 'Prachnerova 642/10, Praha 5 150 00'
const EMAIL = 'info@hledammotory.cz'
const PHONE = '+420 724 704 764'

const COPY: Record<Locale, Copy> = {
  'cs': {
    metaTitle: 'Zásady ochrany osobních údajů',
    metaDescription:
      'Zásady zpracování a ochrany osobních údajů podle GDPR (nařízení EU 2016/679).',
    h1: 'Zásady zpracování a ochrany osobních údajů',
    s1h: 'I. Základní ustanovení',
    s1p1:
      'Správcem osobních údajů podle čl. 4 bod 7 nařízení Evropského parlamentu a Rady (EU) 2016/679 o ochraně fyzických osob při zpracování osobních údajů a o volném pohybu těchto údajů (dále jen: „GDPR“) je NEURO s.r.o., DIČ: CZ19679041 se sídlem Prachnerova 642/10, Praha 5 150 00 (dále jen: „správce“).',
    s1contactLabel: 'Kontaktní údaje správce jsou:',
    s1addressLabel: 'adresa',
    s1emailLabel: 'email',
    s1phoneLabel: 'telefon',
    s1p3:
      'Osobními údaji jsou všechny informace o identifikované nebo identifikovatelné fyzické osobě; identifikovatelnou fyzickou osobou je fyzická osoba, kterou lze přímo nebo nepřímo identifikovat, zejména odkazem na určitý identifikátor, například jméno, identifikační číslo, lokační údaje, síťový identifikátor nebo pomocí jednoho nebo více specifických faktorů, fyziologických, genetických, mentálních, ekonomických, kulturních nebo společenských.',
    s1p4:
      'Správce nejmenoval pověřence pro ochranu osobních údajů.',
    s2h: 'II. Zdroje a kategorie zpracovávaných osobních údajů',
    s2p1:
      'Správce zpracovává osobní údaje, které jste mu poskytli nebo osobní údaje, které správce získal na základě plnění Vaší objednávky.',
    s2p2:
      'Správce zpracovává Vaše identifikační a kontaktní údaje a údaje nezbytné pro plnění smlouvy.',
    s3h: 'III. Zákonný důvod a účel zpracování osobních údajů',
    s3intro: 'Zákonným důvodem zpracování osobních údajů je:',
    s3li: [
      'plnění smlouvy mezi Vámi a správcem podle čl. 6 odst. 1 písm. b) GDPR,',
      'oprávněný zájem správce na poskytování přímého marketingu (pro zasílání obchodních oznámení a newsletterů) podle čl. 6 odst. 1 písm. f) GDPR,',
      'Váš souhlas se zpracováním pro účely poskytování přímého marketingu (pro zasílání obchodních oznámení a newsletterů) podle čl. 6 odst. 1 písm. a) GDPR.',
    ],
    s4h: 'IV. Doba uchovávání údajů',
    s4intro: 'Správce uchovává osobní údaje:',
    s4li: [
      'po dobu nezbytnou k výkonu práv a povinností vyplývajících ze smluvního vztahu mezi Vámi a správcem a uplatňování nároků z těchto smluvních vztahů (po dobu 15 let od ukončení smluvního vztahu),',
      'po dobu, než je odvolán souhlas se zpracováním osobních údajů pro účely marketingu, pokud jsou osobní údaje zpracovávány na základě souhlasu.',
    ],
    s5h: 'V. Příjemci osobních údajů (zpracovatelé)',
    s5intro: 'Příjemci osobních údajů jsou osoby:',
    s5li: [
      'podílející se na dodání zboží/služeb/realizaci plateb na základě smlouvy,',
      'zajišťující služby provozování webu a další služby v souvislosti s jeho provozováním,',
      'zajišťující marketingové služby.',
    ],
    s6h: 'VI. Vaše práva',
    s6intro: 'Za podmínek stanovených v GDPR máte:',
    s6li: [
      'právo na přístup ke svým osobním údajům,',
      'právo na opravu osobních údajů,',
      'právo na výmaz osobních údajů,',
      'právo podat námitku proti zpracovávání,',
      'právo na přenositelnost údajů,',
      'právo odvolat souhlas se zpracováním a právo podat stížnost u Úřadu pro ochranu osobních údajů.',
    ],
    s7h: 'VII. Podmínky zabezpečení osobních údajů',
    s7p:
      'Správce prohlašuje, že přijal všechna vhodná technická a organizační opatření k zabezpečení osobních údajů.',
    s8h: 'VIII. Závěrečná ustanovení',
    s8p:
      'Odesláním poptávky z internetového kontaktního formuláře potvrzujete, že jste seznámen s podmínkami ochrany osobních údajů a že je v celém rozsahu přijímáte.',
  },
  'de-AT': {
    metaTitle: 'Datenschutzerklärung',
    metaDescription:
      'Grundsätze der Verarbeitung und des Schutzes personenbezogener Daten gemäß DSGVO (Verordnung (EU) 2016/679).',
    h1: 'Grundsätze der Verarbeitung und des Schutzes personenbezogener Daten',
    s1h: 'I. Grundlegende Bestimmungen',
    s1p1:
      'Verantwortlicher für die Verarbeitung personenbezogener Daten gemäß Art. 4 Nr. 7 der Verordnung (EU) 2016/679 des Europäischen Parlaments und des Rates zum Schutz natürlicher Personen bei der Verarbeitung personenbezogener Daten und zum freien Datenverkehr (nachfolgend „DSGVO“) ist NEURO s.r.o., USt-IdNr.: CZ19679041, mit Sitz in Prachnerova 642/10, Praha 5 150 00 (nachfolgend „Verantwortlicher“).',
    s1contactLabel: 'Die Kontaktdaten des Verantwortlichen sind:',
    s1addressLabel: 'Adresse',
    s1emailLabel: 'E-Mail',
    s1phoneLabel: 'Telefon',
    s1p3:
      'Personenbezogene Daten sind alle Informationen, die sich auf eine identifizierte oder identifizierbare natürliche Person beziehen; als identifizierbar wird eine natürliche Person angesehen, die direkt oder indirekt identifiziert werden kann, insbesondere mittels Zuordnung zu einer Kennung wie einem Namen, einer Kennnummer, Standortdaten, einer Online-Kennung oder zu einem oder mehreren besonderen Merkmalen physiologischer, genetischer, psychischer, wirtschaftlicher, kultureller oder sozialer Art.',
    s1p4:
      'Der Verantwortliche hat keinen Datenschutzbeauftragten benannt.',
    s2h: 'II. Quellen und Kategorien der verarbeiteten personenbezogenen Daten',
    s2p1:
      'Der Verantwortliche verarbeitet personenbezogene Daten, die Sie ihm zur Verfügung gestellt haben, oder personenbezogene Daten, die der Verantwortliche im Rahmen der Erfüllung Ihrer Bestellung bzw. Anfrage erhalten hat.',
    s2p2:
      'Der Verantwortliche verarbeitet Ihre Identifikations- und Kontaktdaten sowie die zur Vertragserfüllung erforderlichen Daten.',
    s3h: 'III. Rechtsgrundlage und Zweck der Verarbeitung',
    s3intro: 'Die Rechtsgrundlage der Verarbeitung personenbezogener Daten ist:',
    s3li: [
      'die Erfüllung des Vertrags zwischen Ihnen und dem Verantwortlichen gemäß Art. 6 Abs. 1 lit. b DSGVO,',
      'das berechtigte Interesse des Verantwortlichen an der Durchführung von Direktmarketing (zum Versand von geschäftlichen Mitteilungen und Newslettern) gemäß Art. 6 Abs. 1 lit. f DSGVO,',
      'Ihre Einwilligung in die Verarbeitung zum Zweck des Direktmarketings (zum Versand von geschäftlichen Mitteilungen und Newslettern) gemäß Art. 6 Abs. 1 lit. a DSGVO.',
    ],
    s4h: 'IV. Speicherdauer',
    s4intro: 'Der Verantwortliche speichert personenbezogene Daten:',
    s4li: [
      'für die Dauer, die zur Ausübung der Rechte und Pflichten aus dem Vertragsverhältnis zwischen Ihnen und dem Verantwortlichen und zur Geltendmachung von Ansprüchen aus diesen Vertragsverhältnissen erforderlich ist (für die Dauer von 15 Jahren ab Beendigung des Vertragsverhältnisses),',
      'bis zum Widerruf der Einwilligung in die Verarbeitung personenbezogener Daten zu Marketingzwecken, sofern die personenbezogenen Daten auf Grundlage einer Einwilligung verarbeitet werden.',
    ],
    s5h: 'V. Empfänger personenbezogener Daten (Auftragsverarbeiter)',
    s5intro: 'Empfänger personenbezogener Daten sind Personen:',
    s5li: [
      'die auf Grundlage des Vertrags an der Lieferung von Waren/Dienstleistungen/Durchführung von Zahlungen beteiligt sind,',
      'die Dienstleistungen zum Betrieb der Website und weitere damit verbundene Dienstleistungen erbringen,',
      'die Marketingdienstleistungen erbringen.',
    ],
    s6h: 'VI. Ihre Rechte',
    s6intro: 'Unter den in der DSGVO festgelegten Bedingungen haben Sie:',
    s6li: [
      'das Recht auf Auskunft über Ihre personenbezogenen Daten,',
      'das Recht auf Berichtigung personenbezogener Daten,',
      'das Recht auf Löschung personenbezogener Daten,',
      'das Recht auf Widerspruch gegen die Verarbeitung,',
      'das Recht auf Datenübertragbarkeit,',
      'das Recht, eine Einwilligung zu widerrufen, sowie das Recht, Beschwerde bei einer Datenschutz-Aufsichtsbehörde (in Österreich der Datenschutzbehörde) einzureichen.',
    ],
    s7h: 'VII. Bedingungen zur Sicherung personenbezogener Daten',
    s7p:
      'Der Verantwortliche erklärt, dass er alle geeigneten technischen und organisatorischen Maßnahmen zur Sicherung personenbezogener Daten getroffen hat.',
    s8h: 'VIII. Schlussbestimmungen',
    s8p:
      'Mit dem Absenden einer Anfrage über das Online-Kontaktformular bestätigen Sie, dass Sie mit den Datenschutzbedingungen vertraut sind und diese in vollem Umfang akzeptieren.',
  },
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params
  const c = COPY[locale] ?? COPY['cs']
  return {title: c.metaTitle, description: c.metaDescription}
}

export default async function PrivacyPage({params}: Props) {
  const {locale} = await params
  setRequestLocale(locale)
  const c = COPY[locale] ?? COPY['cs']

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{c.h1}</h1>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">{c.s1h}</h2>
          <p className="text-gray-600">
            <strong>1.</strong> {c.s1p1}
          </p>
          <p className="text-gray-600">
            <strong>2.</strong> {c.s1contactLabel}
            <br />
            {c.s1addressLabel}: {ADDRESS}
            <br />
            {c.s1emailLabel}: {EMAIL}
            <br />
            {c.s1phoneLabel}: {PHONE}
          </p>
          <p className="text-gray-600">
            <strong>3.</strong> {c.s1p3}
          </p>
          <p className="text-gray-600">
            <strong>4.</strong> {c.s1p4}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">{c.s2h}</h2>
          <p className="text-gray-600">
            <strong>1.</strong> {c.s2p1}
          </p>
          <p className="text-gray-600">
            <strong>2.</strong> {c.s2p2}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">{c.s3h}</h2>
          <div className="text-gray-600">
            <strong>1.</strong> {c.s3intro}
            <ul className="list-disc list-inside ml-6">
              {c.s3li.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">{c.s4h}</h2>
          <div className="text-gray-600">
            <strong>1.</strong> {c.s4intro}
            <ul className="list-disc list-inside ml-6">
              {c.s4li.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">{c.s5h}</h2>
          <div className="text-gray-600">
            <strong>1.</strong> {c.s5intro}
            <ul className="list-disc list-inside ml-6">
              {c.s5li.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">{c.s6h}</h2>
          <div className="text-gray-600">
            <strong>1.</strong> {c.s6intro}
            <ul className="list-disc list-inside ml-6">
              {c.s6li.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">{c.s7h}</h2>
          <p className="text-gray-600">{c.s7p}</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">{c.s8h}</h2>
          <p className="text-gray-600">{c.s8p}</p>
        </section>
      </div>
    </div>
  )
}
