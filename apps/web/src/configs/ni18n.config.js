import path from 'path';
import configState from 'states/useConfigs';
// import HttpBackend from 'i18next-http-backend'

const supportedLngs = ['ko', 'en', 'ja'];
export const ni18nConfig = {
  fallbackLng: [configState.locale || 'ko'],
  supportedLngs,
  ns: ['base','zod'],
  react: { useSuspense: false },
  backend: {
    loadPath: path.resolve(`/locales/{{ns}}/{{lng}}.json`),
    //loadPath: 'http://localhost:8000/api/locales/{{lng}}',
  },
  // use: [HttpBackend],
};
