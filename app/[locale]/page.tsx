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
      <section className="flex-1 flex items-center justify-center px-4 py-16 sm:py-24 relative overflow-hidden">
        {/* Background Gradient Blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-3xl -z-10 animate-pulse-slow" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h1 className="text-5xl sm:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 mb-6 tracking-tight leading-tight">
            {t('home.hero.title', currentLocale)}
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t('home.hero.subtitle', currentLocale)}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/create" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto px-12 py-6 text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-r from-primary to-primary-dark border-none">
                {t('home.hero.cta', currentLocale)}
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-sm text-gray-500 font-medium">
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
