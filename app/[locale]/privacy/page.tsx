import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { t } from '@/lib/i18n/translations'
import { type Locale } from '@/lib/i18n/locale'

export default async function PrivacyPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const currentLocale = locale || 'mn'

  const dataPoints = [
    { title: t('privacyPage.data.events', currentLocale) },
    { title: t('privacyPage.data.responses', currentLocale) },
    { title: t('privacyPage.data.fingerprint', currentLocale) },
  ]

  const usagePoints = [
    t('privacyPage.usage.poll', currentLocale),
    t('privacyPage.usage.security', currentLocale),
    t('privacyPage.usage.improve', currentLocale),
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10 sm:py-14">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10 space-y-8">
          <header className="space-y-3">
            <p className="text-xs uppercase font-semibold tracking-[0.12em] text-primary">
              uulzah.link
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {t('privacyPage.title', currentLocale)}
            </h1>
            <p className="text-base text-gray-600 leading-relaxed">
              {t('privacyPage.subtitle', currentLocale)}
            </p>
          </header>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {t('privacyPage.data.title', currentLocale)}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {dataPoints.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4 text-sm text-gray-800 shadow-sm"
                >
                  {item.title}
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">
              {t('privacyPage.usage.title', currentLocale)}
            </h2>
            <ul className="space-y-2 text-sm text-gray-700">
              {usagePoints.map((point) => (
                <li key={point} className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">
              {t('privacyPage.sharing.title', currentLocale)}
            </h2>
            <p className="text-sm text-gray-700">
              {t('privacyPage.sharing.text', currentLocale)}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">
              {t('privacyPage.deletion.title', currentLocale)}
            </h2>
            <p className="text-sm text-gray-700">
              {t('privacyPage.deletion.text', currentLocale)}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">
              {t('privacyPage.cookies.title', currentLocale)}
            </h2>
            <p className="text-sm text-gray-700">
              {t('privacyPage.cookies.text', currentLocale)}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">
              {t('privacyPage.contact.title', currentLocale)}
            </h2>
            <p className="text-sm text-gray-700">
              {t('privacyPage.contact.text', currentLocale)}{' '}
              <a
                href="https://huuli.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold hover:underline"
              >
                huuli.tech
              </a>
            </p>
          </section>
        </div>
      </main>

      <Footer locale={currentLocale} />
    </div>
  )
}
