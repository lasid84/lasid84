import path from 'path';
import configState from 'states/useConfigs';
// import HttpBackend from 'i18next-http-backend'

const supportedLngs = ['ko', 'en', 'jp'];
export const ni18nConfig = {
  fallbackLng: [configState.locale || 'ko'],
  supportedLngs,
  ns: ['acct'],
  react: { useSuspense: false },
  backend: {
    loadPath: path.resolve(`/locales/{{ns}}/{{lng}}.json`),
    //loadPath: 'http://localhost:5000/api/locales/{{lng}}',
  },
  //use: [HttpBackend],
};
