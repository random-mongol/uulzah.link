import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { t } from '@/lib/i18n/translations'
import { type Locale } from '@/lib/i18n/locale'

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const currentLocale = locale || 'mn'

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-16 sm:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            {t('home.hero.title', currentLocale)}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8">
            {t('home.hero.subtitle', currentLocale)}
          </p>

          <Link href="/create">
            <Button size="lg" className="w-full sm:w-auto px-12">
              {t('home.hero.cta', currentLocale)}
            </Button>
          </Link>

          <p className="mt-4 text-sm text-gray-500">
            {t('home.hero.features', currentLocale)}
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {currentLocale === 'mn' ? 'Үүсгэх' : 'Create'}
              </h3>
              <p className="text-gray-600 text-sm">
                {currentLocale === 'mn'
                  ? 'Үйл явдал үүсгэж, боломжит огноонуудыг сонгох'
                  : 'Create an event and select possible dates'}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {currentLocale === 'mn' ? 'Хуваалцах' : 'Share'}
              </h3>
              <p className="text-gray-600 text-sm">
                {currentLocale === 'mn'
                  ? 'Холбоосыг оролцогчдод хуваалцах'
                  : 'Share the link with participants'}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {currentLocale === 'mn' ? 'Шийдэх' : 'Decide'}
              </h3>
              <p className="text-gray-600 text-sm">
                {currentLocale === 'mn'
                  ? 'Хамгийн тохиромжтой цагийг олох'
                  : 'Find the best time that works'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
