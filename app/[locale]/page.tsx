import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { t } from '@/lib/i18n/translations'
import { type Locale } from '@/lib/i18n/locale'

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const currentLocale = locale || 'mn'
  const howItWorks = [
    {
      number: '1',
      title: currentLocale === 'mn' ? 'Үүсгэх' : 'Create',
      body:
        currentLocale === 'mn'
          ? 'Уулзалт үүсгэж, боломжит огноонуудыг сонгох'
          : 'Create an event and select possible dates',
    },
    {
      number: '2',
      title: currentLocale === 'mn' ? 'Хуваалцах' : 'Share',
      body:
        currentLocale === 'mn'
          ? 'Холбоосыг хуваалцах'
          : 'Share the link with participants',
    },
    {
      number: '3',
      title: currentLocale === 'mn' ? 'Шийдэх' : 'Decide',
      body:
        currentLocale === 'mn'
          ? 'Хамгийн тохиромжтой цагийг олох'
          : 'Find the best time that works',
    },
  ]
  const useCases = [
    {
      title: t('home.useCases.team.title', currentLocale),
      body: t('home.useCases.team.body', currentLocale),
      tag: currentLocale === 'mn' ? 'Баг' : 'Team',
    },
    {
      title: t('home.useCases.friends.title', currentLocale),
      body: t('home.useCases.friends.body', currentLocale),
      tag: currentLocale === 'mn' ? 'Найзууд' : 'Friends',
    },
    {
      title: t('home.useCases.study.title', currentLocale),
      body: t('home.useCases.study.body', currentLocale),
      tag: currentLocale === 'mn' ? 'Сургалт' : 'Study/Clubs',
    },
  ]

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
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-primary-light/25 to-secondary-light/25 py-16 px-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-10 top-10 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-56 w-56 rounded-full bg-secondary/10 blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              {currentLocale === 'mn' ? 'Алхамууд' : 'Steps'}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {currentLocale === 'mn' ? 'Хэрхэн ажилладаг вэ?' : 'How it works'}
            </h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              {currentLocale === 'mn'
                ? 'Гурван алхмаар санал асуулгаа үүсгээд хамгийн тохиромжтой цагийг хурдан олно.'
                : 'Create a poll in three guided steps and quickly land on the best time.'}
            </p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute left-8 right-8 top-[84px] h-[3px] bg-gradient-to-r from-primary/10 via-primary/30 to-secondary/20 rounded-full" />
            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              {howItWorks.map((item, index) => (
                <div key={item.number} className="relative group">
                  <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white/90 p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-white text-lg font-bold shadow-md">
                        {item.number}
                      </div>
                      <div className="space-y-1">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                          {currentLocale === 'mn' ? 'Алхам' : 'Step'} {item.number}
                        </p>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {item.body}
                        </p>
                      </div>
                    </div>
                  </div>

                  {index < howItWorks.length - 1 && (
                    <>
                      <div className="hidden md:flex items-center absolute -right-9 top-1/2 -translate-y-1/2 gap-2 text-primary">
                        <div className="h-px w-10 bg-gradient-to-r from-primary/30 to-primary/80" />
                        <ArrowRight className="w-5 h-5" />
                        <div className="h-px w-10 bg-gradient-to-r from-primary/80 to-secondary/60" />
                      </div>
                      <div className="md:hidden flex items-center justify-center pt-4 text-primary">
                        <ArrowRight className="w-5 h-5 rotate-90" />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="relative overflow-hidden bg-white py-16 px-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-12 -bottom-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute right-0 top-6 h-48 w-48 rounded-full bg-secondary/10 blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-light px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              {currentLocale === 'mn' ? 'Яагаад uulzah.link?' : 'Why uulzah.link?'}
              <ArrowRight className="w-4 h-4" />
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {t('home.useCases.title', currentLocale)}
            </h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              {t('home.useCases.subtitle', currentLocale)}
            </p>
          </div>

          <div className="relative grid gap-6 md:grid-cols-3">
            <div className="hidden md:block absolute left-[12%] right-[12%] top-[82px] h-0.5 bg-gradient-to-r from-primary/10 via-primary/20 to-secondary/20 rounded-full" />
            {useCases.map((item, index) => (
              <div key={item.title} className="relative group">
                {index < useCases.length - 1 && (
                  <div className="hidden md:flex items-center absolute -right-8 top-[90px] -translate-y-1/2 gap-2 text-primary">
                    <div className="h-px w-10 bg-gradient-to-r from-primary/30 to-primary/80" />
                    <ArrowRight className="w-4 h-4" />
                    <div className="h-px w-8 bg-gradient-to-r from-primary/80 to-secondary/60" />
                  </div>
                )}

                <div className="relative h-full overflow-hidden rounded-2xl border border-gray-100 bg-white/90 p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-primary-dark to-secondary" />
                  <div className="relative flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-white text-lg font-bold shadow-md">
                        {index + 1}
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                        {item.tag}
                      </span>
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/25 bg-primary-light/40 text-primary">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
