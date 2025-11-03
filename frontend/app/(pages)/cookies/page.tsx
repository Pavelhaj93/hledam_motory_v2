import type {Metadata} from 'next'
import CategoryHero from '@/app/components/CategoryHero'

export const metadata: Metadata = {
  title: 'Zásady používání cookies',
  description:
    'Informace o používání cookies a sledovacích technologií na našich webových stránkách.',
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <CategoryHero
        title="Zásady používání cookies"
        description="Informace o používání cookies a sledovacích technologií na našich webových stránkách."
        breadcrumbs={[{label: 'Domů', href: '/'}, {label: 'Cookies'}]}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            Nastavení souhlasu s personalizací
          </h2>

          <p className="mb-6 text-gray-700">
            Tyto webové stránky a společnost Seznam.cz, a.s. shromažďují, uchovávají a sdílejí
            informace o koncových uživatelích, včetně jedinečných identifikátorů, cookies, IP adres
            a e-mailů umožňujících osobní identifikaci získané na těchto stránkách a na stránkách
            partnerů, se kterými jsou propojeny. Podrobné informace o nakládání s osobními údaji
            najdete na stránkách o ochraně osobních údajů a dále na webových stránkách každého
            partnera.
          </p>

          <p className="mb-6 text-gray-700">
            Díky těmto informacím vám můžeme nabízet kvalitní a relevantní obsah nebo reklamní
            nabídky, které vás skutečně zajímají. Svým souhlasem nám napomáháte financovat a
            zlepšovat naše služby, které tak můžeme nabízet zdarma. Kliknutím na tlačítko
            „souhlasím“, potvrzujete svůj souhlas k přístupu a zpracování výše uvedených osobních
            údajů a jejich možným sdílením s našimi vybranými partnery (včetně analytických
            nástrojů) pro tyto účely (typy zpracování):
          </p>

          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>Ukládání a/nebo přístup k informacím v zařízení</li>
            <li>Profil pro personalizovanou reklamu a zobrazení personalizované reklamy</li>
            <li>Profil pro personalizaci obsahu a zobrazování personalizovaného obsahu</li>
            <li>
              Použití přesných údajů o geografické poloze (do 500 metrů) a Informace o vlastnostech
              zařízení
            </li>
          </ul>

          <p className="mb-6 text-gray-700">
            Údaje pro následující účely jsou některými partnery zpracovávány na základě oprávněného
            zájmu:
          </p>

          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>Základní nastavení reklamy</li>
            <li>Měření výkonu reklamy a obsahu</li>
            <li>Poznatky o uživatelích a vývoj produktů</li>
          </ul>

          <p className="mb-6 text-gray-700">
            Právní titul zpracování dat vybranými partnery najdete pro jednotlivé účely pod
            tlačítkem „Další volby“. Partneři, kteří nejsou součástí TCF 2.0, mají definované účely
            dle svých zásad zpracování.
          </p>

          <p className="mb-6 text-gray-700">
            Vaše nastavení se vztahuje na tuto doménu, weby a aplikace zapojené do reklamní sítě
            provozované společností Seznam.cz, a.s. Své rozhodnutí můžete upravit kliknutím na
            tlačítko „Další volby", kde najdete rovněž informace k oprávněným zájmům a možnosti
            proti nim namítat, případně svůj souhlas zcela či částečně odvolat. V případě, že svým
            nastavením preferencí nebudete žádné údaje sdílet, bude vám zobrazován méně relevantní
            obsah a reklamní sdělení. Své nastavení můžete kdykoli změnit či odvolat na této stránce
            nebo ve svém Profilu na Seznam.cz.
          </p>
        </div>
      </div>
    </div>
  )
}
