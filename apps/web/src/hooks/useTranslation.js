
import { useLanguage } from '@/contexts/LanguageContext.jsx';

export const useTranslation = () => {
  const { t, language, setLanguage } = useLanguage();
  return { t, language, setLanguage };
};
