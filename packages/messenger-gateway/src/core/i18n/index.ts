import { I18n } from 'i18n';
import { getStaticPath } from 'core/utils/getStaticPath';

const createI18nInstance = () => {
  const i18n = new I18n();

  i18n.configure({
    locales: ['vi', 'en'],
    directory: getStaticPath('locales'),
    defaultLocale: 'vi',
  });

  return () => i18n;
};

export const getI18n = createI18nInstance();
