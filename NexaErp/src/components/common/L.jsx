import { useTranslation } from 'react-i18next';

const L = ({ children }) => {
  const { t } = useTranslation();
  // Agar translation nahi milti to ye wahi text wapis krdega (fallback)
  return <>{t(children?.toString().toLowerCase().replace(/ /g, "_")) || children}</>;
};

export default L;