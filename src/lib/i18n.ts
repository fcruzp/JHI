// JHI International - Comprehensive Translations
// Supported languages: English (en), Spanish (es), Chinese Simplified (zh)

export type Language = 'en' | 'es' | 'zh';

export const languageNames: Record<Language, string> = {
  en: 'EN',
  es: 'ES',
  zh: '中文',
};

type TranslationKeys = {
  // Header
  headerAbout: string;
  headerCommodities: string;
  headerGlobalReach: string;
  headerWhyJhi: string;
  headerSpeak: string;
  headerContact: string;

  // Hero
  heroTagline: string;
  heroSubtitle: string;
  heroCtaQuote: string;
  heroCtaChat: string;

  // About
  aboutTitle: string;
  aboutSubtitle: string;
  aboutP1: string;
  aboutP2: string;
  aboutP3: string;
  aboutValue1Title: string;
  aboutValue1Desc: string;
  aboutValue2Title: string;
  aboutValue2Desc: string;
  aboutValue3Title: string;
  aboutValue3Desc: string;

  // Commodities
  commoditiesTitle: string;
  commoditiesSubtitle: string;
  commoditySugarName: string;
  commoditySugarDesc: string;
  commodityMeatName: string;
  commodityMeatDesc: string;
  commodityGrainsName: string;
  commodityGrainsDesc: string;
  commodityCoffeeName: string;
  commodityCoffeeDesc: string;
  commodityOilName: string;
  commodityOilDesc: string;
  commodityDairyName: string;
  commodityDairyDesc: string;

  // Global Reach
  globalReachTitle: string;
  globalReachSubtitle: string;
  statCountries: string;
  statCountriesLabel: string;
  statVolume: string;
  statVolumeLabel: string;
  statYears: string;
  statYearsLabel: string;
  statPartners: string;
  statPartnersLabel: string;

  // Why Choose
  whyChooseTitle: string;
  whyChooseSubtitle: string;
  whyProfessionalismTitle: string;
  whyProfessionalismDesc: string;
  whySpeedTitle: string;
  whySpeedDesc: string;
  whySecurityTitle: string;
  whySecurityDesc: string;
  whyGlobalTitle: string;
  whyGlobalDesc: string;
  whySupportTitle: string;
  whySupportDesc: string;

  // Speak With Our Team
  speakTitle: string;
  speakSubtitle: string;
  speakDescription: string;
  speakFeature1Title: string;
  speakFeature1Desc: string;
  speakFeature2Title: string;
  speakFeature2Desc: string;
  speakFeature3Title: string;
  speakFeature3Desc: string;
  speakCta: string;

  // Chat
  chatTitle: string;
  chatPlaceholder: string;
  chatSend: string;
  chatVoice: string;
  chatVoiceActive: string;
  chatTextMode: string;
  chatWelcome: string;
  chatListening: string;

  // Contact
  contactTitle: string;
  contactSubtitle: string;
  contactName: string;
  contactNamePlaceholder: string;
  contactEmail: string;
  contactEmailPlaceholder: string;
  contactCommodity: string;
  contactCommodityPlaceholder: string;
  contactQuantity: string;
  contactQuantityPlaceholder: string;
  contactMessage: string;
  contactMessagePlaceholder: string;
  contactSubmit: string;
  contactSuccess: string;
  contactError: string;
  contactRequired: string;
  contactInvalidEmail: string;

  // Footer
  footerCopyright: string;
  footerNav: string;
  footerFollow: string;
  footerLang: string;

  // Shared
  loading: string;
};

const translations: Record<Language, TranslationKeys> = {
  en: {
    // Header
    headerAbout: 'About',
    headerCommodities: 'Commodities',
    headerGlobalReach: 'Global Reach',
    headerWhyJhi: 'Why JHI',
    headerSpeak: 'Our Team',
    headerContact: 'Contact',

    // Hero
    heroTagline: 'Connecting the world of commodities with trust and excellence',
    heroSubtitle: 'Global commodity intermediaries with excellence and trust since 2008.',
    heroCtaQuote: 'Request a Quote',
    heroCtaChat: 'Talk to Our Team',

    // About
    aboutTitle: 'About JHI',
    aboutSubtitle: 'A legacy of excellence in global commodities',
    aboutP1: 'J Huge International (JHI) has been a trusted name in global commodity intermediation since 2008. With over 15 years of experience, we have built an unparalleled network of suppliers and buyers across more than 50 countries.',
    aboutP2: 'Our team of seasoned professionals specializes in facilitating seamless transactions across the full spectrum of soft and hard commodities. We pride ourselves on delivering value through deep market knowledge, robust relationships, and unwavering integrity.',
    aboutP3: 'We have a professional team available 24/7 to serve you in any time zone. Our commitment to excellence ensures that every transaction is handled with the utmost care and professionalism.',
    aboutValue1Title: 'Trust',
    aboutValue1Desc: 'Built on transparency and integrity in every transaction',
    aboutValue2Title: 'Speed',
    aboutValue2Desc: 'Rapid response and execution to capitalize on market opportunities',
    aboutValue3Title: 'Global Reach',
    aboutValue3Desc: 'Network spanning 50+ countries across all continents',

    // Commodities
    commoditiesTitle: 'Our Commodities',
    commoditiesSubtitle: 'We facilitate trade across a diverse range of global commodities',
    commoditySugarName: 'Sugar',
    commoditySugarDesc: 'Premium raw and refined sugar from top producing regions worldwide.',
    commodityMeatName: 'Meat',
    commodityMeatDesc: 'High-quality beef, poultry, and pork from certified global suppliers.',
    commodityGrainsName: 'Grains',
    commodityGrainsDesc: 'Wheat, corn, rice, and other essential grains for global markets.',
    commodityCoffeeName: 'Coffee',
    commodityCoffeeDesc: 'Specialty and commercial coffee beans from renowned growing regions.',
    commodityOilName: 'Edible Oils',
    commodityOilDesc: 'Soybean, palm, sunflower, and olive oils for industrial and retail markets.',
    commodityDairyName: 'Dairy',
    commodityDairyDesc: 'Milk powder, butter, cheese, and whey products from premium sources.',

    // Global Reach
    globalReachTitle: 'Global Reach',
    globalReachSubtitle: 'Our presence spans the world, delivering value across borders',
    statCountries: '50+',
    statCountriesLabel: 'Countries',
    statVolume: '$2B+',
    statVolumeLabel: 'Annual Volume',
    statYears: '15+',
    statYearsLabel: 'Years Experience',
    statPartners: '200+',
    statPartnersLabel: 'Partners Worldwide',

    // Why Choose
    whyChooseTitle: 'Why Choose JHI',
    whyChooseSubtitle: 'The advantages that set us apart in global commodity trading',
    whyProfessionalismTitle: 'Professionalism',
    whyProfessionalismDesc: 'Decades of experience in commodity trading ensure every deal is executed with precision and expertise.',
    whySpeedTitle: 'Speed',
    whySpeedDesc: 'Rapid response and execution to help you capitalize on market opportunities before they pass.',
    whySecurityTitle: 'Security',
    whySecurityDesc: 'Verified suppliers and buyers worldwide, with rigorous due diligence on every transaction.',
    whyGlobalTitle: 'Global Reach',
    whyGlobalDesc: 'An extensive network spanning 50+ countries ensures you always find the right counterpart.',
    whySupportTitle: '24/7 Support',
    whySupportDesc: 'Our team is available around the clock, ensuring seamless operations across every time zone.',

    // Speak With Our Team
    speakTitle: 'Speak With Our Team',
    speakSubtitle: 'Always available, always professional',
    speakDescription: 'Count on our dedicated team available 24/7 to assist you at any time and in any language. Whether you prefer text or voice, we are here to help.',
    speakFeature1Title: '24/7 Availability',
    speakFeature1Desc: 'Our professional team is available around the clock, regardless of your time zone.',
    speakFeature2Title: 'Multilingual Support',
    speakFeature2Desc: 'Communicate in English, Spanish, Chinese, and more. We speak your language.',
    speakFeature3Title: 'Voice & Text',
    speakFeature3Desc: 'Choose how you want to communicate — type your message or speak directly with our team.',
    speakCta: 'Start a Conversation',

    // Chat
    chatTitle: 'Chat with JHI',
    chatPlaceholder: 'Type your message...',
    chatSend: 'Send',
    chatVoice: 'Voice',
    chatVoiceActive: 'Listening...',
    chatTextMode: 'Text',
    chatWelcome: 'Welcome to JHI. How can we assist you with your commodity needs today?',
    chatListening: 'Listening to your voice...',

    // Contact
    contactTitle: 'Request a Quote',
    contactSubtitle: 'Get in touch with our team to discuss your commodity requirements',
    contactName: 'Full Name',
    contactNamePlaceholder: 'Enter your full name',
    contactEmail: 'Email Address',
    contactEmailPlaceholder: 'Enter your email address',
    contactCommodity: 'Commodity',
    contactCommodityPlaceholder: 'Select a commodity',
    contactQuantity: 'Quantity',
    contactQuantityPlaceholder: 'Enter the desired quantity',
    contactMessage: 'Message',
    contactMessagePlaceholder: 'Tell us about your requirements...',
    contactSubmit: 'Submit Quote Request',
    contactSuccess: 'Your quote request has been submitted successfully. Our team will contact you shortly.',
    contactError: 'There was an error submitting your request. Please try again.',
    contactRequired: 'This field is required',
    contactInvalidEmail: 'Please enter a valid email address',

    // Footer
    footerCopyright: '© 2008-{year} J Huge International. All rights reserved.',
    footerNav: 'Navigation',
    footerFollow: 'Follow Us',
    footerLang: 'Language',

    // Shared
    loading: 'Loading...',
  },

  es: {
    // Header
    headerAbout: 'Nosotros',
    headerCommodities: 'Commodities',
    headerGlobalReach: 'Alcance Global',
    headerWhyJhi: 'Por qué JHI',
    headerSpeak: 'Nuestro Equipo',
    headerContact: 'Contacto',

    // Hero
    heroTagline: 'Conectando el mundo de las commodities con confianza y excelencia',
    heroSubtitle: 'Intermediarios globales de commodities con excelencia y confianza desde 2008.',
    heroCtaQuote: 'Solicitar Cotización',
    heroCtaChat: 'Hablar con nuestro equipo',

    // About
    aboutTitle: 'Sobre JHI',
    aboutSubtitle: 'Un legado de excelencia en commodities globales',
    aboutP1: 'J Huge International (JHI) ha sido un nombre de confianza en la intermediación global de commodities desde 2008. Con más de 15 años de experiencia, hemos construido una red inigualable de proveedores y compradores en más de 50 países.',
    aboutP2: 'Nuestro equipo de profesionales experimentados se especializa en facilitar transacciones fluidas en todo el espectro de commodities blandos y duros. Nos enorgullecemos de ofrecer valor a través de un profundo conocimiento del mercado, relaciones sólidas e integridad inquebrantable.',
    aboutP3: 'Contamos con un equipo profesional disponible 24/7 para servirle en cualquier huso horario. Nuestro compromiso con la excelencia garantiza que cada transacción se maneje con el mayor cuidado y profesionalismo.',
    aboutValue1Title: 'Confianza',
    aboutValue1Desc: 'Construida sobre transparencia e integridad en cada transacción',
    aboutValue2Title: 'Velocidad',
    aboutValue2Desc: 'Respuesta rápida y ejecución para capitalizar oportunidades del mercado',
    aboutValue3Title: 'Alcance Global',
    aboutValue3Desc: 'Red que abarca más de 50 países en todos los continentes',

    // Commodities
    commoditiesTitle: 'Nuestras Commodities',
    commoditiesSubtitle: 'Facilitamos el comercio en una amplia gama de commodities globales',
    commoditySugarName: 'Azúcar',
    commoditySugarDesc: 'Azúcar cruda y refinada premium de las principales regiones productoras del mundo.',
    commodityMeatName: 'Carne',
    commodityMeatDesc: 'Carne de res, pollo y cerdo de alta calidad de proveedores globales certificados.',
    commodityGrainsName: 'Granos',
    commodityGrainsDesc: 'Trigo, maíz, arroz y otros granos esenciales para los mercados globales.',
    commodityCoffeeName: 'Café',
    commodityCoffeeDesc: 'Granos de café especial y comercial de reconocidas regiones cafeteras.',
    commodityOilName: 'Aceites Comestibles',
    commodityOilDesc: 'Aceites de soja, palma, girasol y oliva para mercados industriales y minoristas.',
    commodityDairyName: 'Lácteos',
    commodityDairyDesc: 'Leche en polvo, mantequilla, queso y suero de fuentes premium.',

    // Global Reach
    globalReachTitle: 'Alcance Global',
    globalReachSubtitle: 'Nuestra presencia abarca el mundo, entregando valor a través de fronteras',
    statCountries: '50+',
    statCountriesLabel: 'Países',
    statVolume: '$2B+',
    statVolumeLabel: 'Volumen Anual',
    statYears: '15+',
    statYearsLabel: 'Años de Experiencia',
    statPartners: '200+',
    statPartnersLabel: 'Socios en el Mundo',

    // Why Choose
    whyChooseTitle: 'Por qué Elegir JHI',
    whyChooseSubtitle: 'Las ventajas que nos distinguen en el comercio global de commodities',
    whyProfessionalismTitle: 'Profesionalismo',
    whyProfessionalismDesc: 'Décadas de experiencia en comercio de commodities garantizan que cada acuerdo se ejecute con precisión y experiencia.',
    whySpeedTitle: 'Velocidad',
    whySpeedDesc: 'Respuesta rápida y ejecución para ayudarte a capitalizar oportunidades del mercado antes de que pasen.',
    whySecurityTitle: 'Seguridad',
    whySecurityDesc: 'Proveedores y compradores verificados en todo el mundo, con diligencia debida rigurosa en cada transacción.',
    whyGlobalTitle: 'Alcance Global',
    whyGlobalDesc: 'Una extensa red que abarca más de 50 países asegura que siempre encuentres la contraparte adecuada.',
    whySupportTitle: 'Soporte 24/7',
    whySupportDesc: 'Nuestro equipo está disponible las 24 horas, garantizando operaciones fluidas en cada huso horario.',

    // Speak With Our Team
    speakTitle: 'Hable con Nuestro Equipo',
    speakSubtitle: 'Siempre disponibles, siempre profesionales',
    speakDescription: 'Contamos con un equipo dedicado disponible 24/7 para atenderle en cualquier momento y en cualquier idioma. Ya sea que prefiera texto o voz, estamos aquí para ayudarle.',
    speakFeature1Title: 'Disponibilidad 24/7',
    speakFeature1Desc: 'Nuestro equipo profesional está disponible las 24 horas, sin importar su huso horario.',
    speakFeature2Title: 'Soporte Multilingüe',
    speakFeature2Desc: 'Comuníquese en inglés, español, chino y más. Hablamos su idioma.',
    speakFeature3Title: 'Voz y Texto',
    speakFeature3Desc: 'Elija cómo desea comunicarse — escriba su mensaje o hable directamente con nuestro equipo.',
    speakCta: 'Iniciar una Conversación',

    // Chat
    chatTitle: 'Chat con JHI',
    chatPlaceholder: 'Escribe tu mensaje...',
    chatSend: 'Enviar',
    chatVoice: 'Voz',
    chatVoiceActive: 'Escuchando...',
    chatTextMode: 'Texto',
    chatWelcome: 'Bienvenido a JHI. ¿Cómo podemos ayudarle con sus necesidades de commodities hoy?',
    chatListening: 'Escuchando su voz...',

    // Contact
    contactTitle: 'Solicitar Cotización',
    contactSubtitle: 'Contacte a nuestro equipo para discutir sus requisitos de commodities',
    contactName: 'Nombre Completo',
    contactNamePlaceholder: 'Ingrese su nombre completo',
    contactEmail: 'Correo Electrónico',
    contactEmailPlaceholder: 'Ingrese su correo electrónico',
    contactCommodity: 'Commodity',
    contactCommodityPlaceholder: 'Seleccione una commodity',
    contactQuantity: 'Cantidad',
    contactQuantityPlaceholder: 'Ingrese la cantidad deseada',
    contactMessage: 'Mensaje',
    contactMessagePlaceholder: 'Cuéntenos sobre sus requisitos...',
    contactSubmit: 'Enviar Solicitud de Cotización',
    contactSuccess: 'Su solicitud de cotización ha sido enviada exitosamente. Nuestro equipo se pondrá en contacto con usted en breve.',
    contactError: 'Hubo un error al enviar su solicitud. Por favor, intente de nuevo.',
    contactRequired: 'Este campo es obligatorio',
    contactInvalidEmail: 'Por favor ingrese un correo electrónico válido',

    // Footer
    footerCopyright: '© 2008-{year} J Huge International. Todos los derechos reservados.',
    footerNav: 'Navegación',
    footerFollow: 'Síguenos',
    footerLang: 'Idioma',

    // Shared
    loading: 'Cargando...',
  },

  zh: {
    // Header
    headerAbout: '关于我们',
    headerCommodities: '大宗商品',
    headerGlobalReach: '全球布局',
    headerWhyJhi: '为何选择JHI',
    headerSpeak: '我们的团队',
    headerContact: '联系我们',

    // Hero
    heroTagline: '以信任与卓越连接全球大宗商品',
    heroSubtitle: '自2008年以来，以卓越与信任为宗旨的全球大宗商品中介。',
    heroCtaQuote: '请求报价',
    heroCtaChat: '与我们的团队交谈',

    // About
    aboutTitle: '关于JHI',
    aboutSubtitle: '全球大宗商品领域的卓越传承',
    aboutP1: 'J Huge International（JHI）自2008年以来一直是全球大宗商品中介领域的信赖之选。凭借超过15年的经验，我们在50多个国家建立了无与伦比的供应商和买家网络。',
    aboutP2: '我们的资深专业团队专注于促进全方位软性和硬性大宗商品的无缝交易。我们以深厚的市场知识、稳固的合作关系和坚定不移的诚信为荣，致力于为每一次交易创造价值。',
    aboutP3: '我们拥有专业团队，24/7全天候为您服务，覆盖任何时区。我们对卓越的承诺确保每一笔交易都得到最周到的处理和最专业的服务。',
    aboutValue1Title: '信任',
    aboutValue1Desc: '以透明和诚信构建每一笔交易',
    aboutValue2Title: '速度',
    aboutValue2Desc: '快速响应和执行，把握市场机遇',
    aboutValue3Title: '全球布局',
    aboutValue3Desc: '网络覆盖50多个国家，遍布各大洲',

    // Commodities
    commoditiesTitle: '我们的商品',
    commoditiesSubtitle: '我们促进多种全球大宗商品的贸易',
    commoditySugarName: '糖',
    commoditySugarDesc: '来自全球顶级产区的优质原糖和精制糖。',
    commodityMeatName: '肉类',
    commodityMeatDesc: '来自认证全球供应商的高品质牛肉、禽肉和猪肉。',
    commodityGrainsName: '谷物',
    commodityGrainsDesc: '小麦、玉米、大米及其他面向全球市场的重要谷物。',
    commodityCoffeeName: '咖啡',
    commodityCoffeeDesc: '来自知名种植产区的特种和商用咖啡豆。',
    commodityOilName: '食用油',
    commodityOilDesc: '大豆油、棕榈油、葵花籽油和橄榄油，面向工业和零售市场。',
    commodityDairyName: '乳制品',
    commodityDairyDesc: '来自优质来源的奶粉、黄油、奶酪和乳清产品。',

    // Global Reach
    globalReachTitle: '全球布局',
    globalReachSubtitle: '我们的业务遍布全球，跨越国界创造价值',
    statCountries: '50+',
    statCountriesLabel: '国家',
    statVolume: '$2B+',
    statVolumeLabel: '年交易额',
    statYears: '15+',
    statYearsLabel: '年经验',
    statPartners: '200+',
    statPartnersLabel: '全球合作伙伴',

    // Why Choose
    whyChooseTitle: '为何选择JHI',
    whyChooseSubtitle: '我们在全球大宗商品贸易中的独特优势',
    whyProfessionalismTitle: '专业精神',
    whyProfessionalismDesc: '数十年的大宗商品交易经验确保每笔交易精准专业地执行。',
    whySpeedTitle: '速度',
    whySpeedDesc: '快速响应和执行，帮助您在市场机遇消逝前把握先机。',
    whySecurityTitle: '安全',
    whySecurityDesc: '全球经过验证的供应商和买家，对每笔交易进行严格尽职调查。',
    whyGlobalTitle: '全球布局',
    whyGlobalDesc: '覆盖50多个国家的广泛网络，确保您始终找到合适的交易对手。',
    whySupportTitle: '24/7支持',
    whySupportDesc: '我们的团队全天候待命，确保每个时区的业务无缝运行。',

    // Speak With Our Team
    speakTitle: '与我们的团队交谈',
    speakSubtitle: '随时待命，始终专业',
    speakDescription: '我们拥有专业团队，24/7全天候为您提供任何语言的服务。无论您偏好文字还是语音，我们都在这里为您提供帮助。',
    speakFeature1Title: '24/7全天候服务',
    speakFeature1Desc: '我们的专业团队全天候待命，无论您身处哪个时区。',
    speakFeature2Title: '多语言支持',
    speakFeature2Desc: '支持英语、西班牙语、中文等多种语言。我们说您的语言。',
    speakFeature3Title: '语音与文字',
    speakFeature3Desc: '选择您的沟通方式——输入消息或直接与我们的团队语音交流。',
    speakCta: '开始对话',

    // Chat
    chatTitle: '与JHI对话',
    chatPlaceholder: '输入您的消息...',
    chatSend: '发送',
    chatVoice: '语音',
    chatVoiceActive: '正在聆听...',
    chatTextMode: '文字',
    chatWelcome: '欢迎来到JHI。今天我们如何帮助您解决大宗商品需求？',
    chatListening: '正在聆听您的声音...',

    // Contact
    contactTitle: '请求报价',
    contactSubtitle: '与我们的团队联系，讨论您的大宗商品需求',
    contactName: '全名',
    contactNamePlaceholder: '请输入您的全名',
    contactEmail: '电子邮箱',
    contactEmailPlaceholder: '请输入您的电子邮箱',
    contactCommodity: '商品',
    contactCommodityPlaceholder: '请选择商品',
    contactQuantity: '数量',
    contactQuantityPlaceholder: '请输入所需数量',
    contactMessage: '留言',
    contactMessagePlaceholder: '请告诉我们您的需求...',
    contactSubmit: '提交报价请求',
    contactSuccess: '您的报价请求已成功提交。我们的团队将很快与您联系。',
    contactError: '提交请求时出现错误，请重试。',
    contactRequired: '此字段为必填项',
    contactInvalidEmail: '请输入有效的电子邮箱地址',

    // Footer
    footerCopyright: '© 2008-{year} J Huge International. 保留所有权利。',
    footerNav: '导航',
    footerFollow: '关注我们',
    footerLang: '语言',

    // Shared
    loading: '加载中...',
  },
};

export function getTranslation(lang: Language): TranslationKeys {
  return translations[lang];
}

export type TranslationKey = keyof TranslationKeys;
