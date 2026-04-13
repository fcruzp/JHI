// Server-side translation helper
// This file can be imported in Server Components without client-only dependencies

type Language = 'en' | 'es' | 'zh';

const translations: Record<Language, Record<string, string>> = {
  en: {
    heroSubtitle: 'Global commodity intermediaries facilitating trade across 50+ countries since 2008.',
    footerNav: 'Navigation',
    footerFollow: 'Follow us',
    footerLang: 'Language',
    footerCopyright: '© 2008-{year} J Huge International. All rights reserved.',
    headerAbout: 'About',
    headerCommodities: 'Commodities',
    headerGlobalReach: 'Global Reach',
    headerWhyJhi: 'Why JHI',
    headerSpeak: 'Speak with Team',
    headerContact: 'Contact',
  },
  es: {
    heroSubtitle: 'Intermediarios globales de commodities facilitando el comercio en más de 50 países desde 2008.',
    footerNav: 'Navegación',
    footerFollow: 'Síguenos',
    footerLang: 'Idioma',
    footerCopyright: '© 2008-{year} J Huge International. Todos los derechos reservados.',
    headerAbout: 'Acerca de',
    headerCommodities: 'Commodities',
    headerGlobalReach: 'Alcance Global',
    headerWhyJhi: 'Por qué JHI',
    headerSpeak: 'Habla con el Equipo',
    headerContact: 'Contacto',
  },
  zh: {
    heroSubtitle: '自2008年以来，全球商品中介机构，促进50多个国家的贸易。',
    footerNav: '导航',
    footerFollow: '关注我们',
    footerLang: '语言',
    footerCopyright: '© 2008-{year} J Huge International. 保留所有权利。',
    headerAbout: '关于',
    headerCommodities: '商品',
    headerGlobalReach: '全球覆盖',
    headerWhyJhi: '为什么选择JHI',
    headerSpeak: '与团队沟通',
    headerContact: '联系',
  },
};

export function getTranslationServer(lang: string): Record<string, string> {
  const language: Language = (lang === 'en' || lang === 'es' || lang === 'zh') ? lang : 'es';
  return translations[language];
}
