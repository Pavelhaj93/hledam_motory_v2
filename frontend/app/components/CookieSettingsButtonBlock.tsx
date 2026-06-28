import OpenCookieBannerButton from './OpenCookieBannerButton'

type Props = {block: {buttonText?: string | null}}

export default function CookieSettingsButtonBlock({block}: Props) {
  return (
    <div className="mt-8">
      <OpenCookieBannerButton label={block.buttonText || 'Změnit nastavení cookies'} />
    </div>
  )
}
