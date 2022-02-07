import i18n from 'i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use (initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,
    detection: {
      order: ['queryString', 'cookie'],
      cache: ['cookie']
    },
    interpolation: {
      escapeValue: false
    },
    backend: {
      loadPath: () => {
        // check the domain
        const host = window.location.host;
        return (host === 'isms.distillery.com' ? 'https://isms.distillery.com/client/': 'http://localhost:3000/client/') + 'locales/{{lng}}/{{ns}}.json';
      },
    },
  })

export default i18n;