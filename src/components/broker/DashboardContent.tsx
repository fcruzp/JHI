'use client';

import { useAppStore } from '@/lib/store';
import { getTranslation } from '@/lib/i18n';
import { SignOutButton } from '@/components/auth/SignOutButton';
import { QuoteFormSection } from '@/components/jhi/QuoteFormSection';
import { HubSpotObject } from '@/lib/hubspot/types';

interface DashboardContentProps {
  userName: string;
  userEmail: string;
  cotizaciones: HubSpotObject[];
}

export function DashboardContent({ userName, userEmail, cotizaciones }: DashboardContentProps) {
  const { language } = useAppStore();
  const t = getTranslation(language);

  // Mappings for HubSpot values (which are in Spanish) to translation keys
  const getStatusLabel = (status: string) => {
    const key = `status_${status}` as keyof typeof t;
    return t[key] || status;
  };

  const getProductLabel = (props: any) => {
    if (props.producto_cotizado === 'otro' && props.producto_nombre_original) {
      return props.producto_nombre_original;
    }
    const key = `product_${props.producto_cotizado}` as keyof typeof t;
    return t[key] || props.producto_cotizado;
  };

  const getIncotermLabel = (incoterm: string) => {
    const key = `incoterm_${(incoterm || '').toLowerCase()}` as keyof typeof t;
    return t[key] || incoterm || 'N/A';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8 sm:mb-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{t.brokerPortal}</h1>
          <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">
            {t.dashboardWelcome.replace('{name}', userName || userEmail)}
          </p>
        </div>
        <SignOutButton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Procedimiento */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl border border-[#c9a84c]/20 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-[#c9a84c] mb-4">{t.howItWorksTitle}</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#c9a84c]/10 text-[#c9a84c] flex items-center justify-center font-bold shrink-0">1</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <strong className="text-gray-900 dark:text-white block">{t.howItWorksStep1Title}</strong>
                  {t.howItWorksStep1Desc}
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#c9a84c]/10 text-[#c9a84c] flex items-center justify-center font-bold shrink-0">2</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <strong className="text-gray-900 dark:text-white block">{t.howItWorksStep2Title}</strong>
                  {t.howItWorksStep2Desc}
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#c9a84c]/10 text-[#c9a84c] flex items-center justify-center font-bold shrink-0">3</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <strong className="text-gray-900 dark:text-white block">{t.howItWorksStep3Title}</strong>
                  {t.howItWorksStep3Desc}
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#c9a84c]/10 text-[#c9a84c] flex items-center justify-center font-bold shrink-0">4</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <strong className="text-gray-900 dark:text-white block">{t.howItWorksStep4Title}</strong>
                  {t.howItWorksStep4Desc}
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold shrink-0">5</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <strong className="text-gray-900 dark:text-white block">{t.howItWorksStep5Title}</strong>
                  {t.howItWorksStep5Desc}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cotizaciones Table */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl border border-black/5 dark:border-white/5 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t.activeQuotesTitle}</h2>
            </div>
            
            {cotizaciones.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {t.noQuotes}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-[#0f0f0f] text-gray-600 dark:text-gray-400">
                    <tr>
                      <th className="font-medium p-4">{t.tableHeaderBusiness}</th>
                      <th className="font-medium p-4">{t.tableHeaderVolume}</th>
                      <th className="font-medium p-4">{t.tableHeaderDate}</th>
                      <th className="font-medium p-4">{t.tableHeaderStatus}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {cotizaciones.map((cot) => {
                      const props = cot.properties;
                      const productLabel = getProductLabel(props);
                      const status = props.estado_cotizacion;
                      const isLost = status === 'perdida';
                      const isWon = status === 'ganada';
                      
                      return (
                        <tr key={cot.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                          <td className="p-4 align-top">
                            <div className="font-medium text-gray-900 dark:text-white">
                              {productLabel}
                            </div>
                            <div className="text-xs text-gray-500 capitalize mt-1">
                              {t.tableIncoterm}: {getIncotermLabel(props.incoterm)}
                            </div>
                            {props.puerto_salida && props.mercado_origen && (
                              <div className="text-xs text-gray-500 mt-1">
                                {props.mercado_origen} → {props.puerto_salida}
                              </div>
                            )}
                          </td>
                          <td className="p-4 align-top">
                            {props.amount ? `${Number(props.amount).toLocaleString()} MT` : t.tableVolumeTBD}
                          </td>
                          <td className="p-4 align-top whitespace-nowrap">
                            {new Date(props.createdate || cot.createdAt).toLocaleDateString(language === 'es' ? 'es-ES' : language === 'zh' ? 'zh-CN' : 'en-US', { 
                              year: 'numeric', month: 'short', day: 'numeric' 
                            })}
                          </td>
                          <td className="p-4 align-top">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                              ${isWon ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : ''}
                              ${isLost ? 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' : ''}
                              ${!isWon && !isLost ? 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' : ''}
                            `}>
                              {getStatusLabel(status)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl overflow-hidden border border-black/5 dark:border-white/5">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t.newQuoteRequestTitle}</h2>
          <p className="text-gray-500 mt-1 text-sm">{t.newQuoteRequestSubtitle}</p>
        </div>
        <QuoteFormSection isEmbedded={true} />
      </div>

    </div>
  );
}
