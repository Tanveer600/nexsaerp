import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Sidebar & Navigation
      "dashboard": "Dashboard",
      "user_management": "User Management",
      "inventory": "Inventory",
      "reports": "Reports",
      
      // Table Headers (Automatic mapping keys)
      "user_name": "User Name",
      "email": "Email",
      "phone": "Phone",
      "status": "Status",
      "action": "Action",
      "role": "Role",
      "branch": "Branch",
      
      // Common Buttons & Actions
      "search": "Search...",
      "add_new": "Add New",
      "edit": "Edit",
      "delete": "Delete",
      "save": "Save",
      "cancel": "Cancel",
      "active": "Active",
      "inactive": "Inactive",
      
      // UI Labels
      "select_language": "Select Language",
      "welcome": "Welcome back"
    }
  },
  ur: {
    translation: {
      // Sidebar & Navigation
      "dashboard": "ڈیش بورڈ",
      "user_management": "یوزر مینجمنٹ",
      "inventory": "انوینٹری",
      "reports": "رپورٹس",
      
      // Table Headers
      "user_name": "صارف کا نام",
      "email": "ای میل",
      "phone": "فون",
      "status": "حیثیت",
      "action": "عمل",
      "role": "کردار",
      "branch": "برانچ",
      
      // Common Buttons & Actions
      "search": "تلاش کریں...",
      "add_new": "نیا شامل کریں",
      "edit": "ترمیم",
      "delete": "حذف کریں",
      "save": "محفوظ کریں",
      "cancel": "منسوخ کریں",
      "active": "فعال",
      "inactive": "غیر فعال",
      
      // UI Labels
      "select_language": "زبان منتخب کریں",
      "welcome": "خوش آمدید"
    }
  },
  ar: {
    translation: {
      // Sidebar & Navigation
      "dashboard": "لوحة القيادة",
      "user_management": "إدارة المستخدمين",
      "inventory": "المخزون",
      "reports": "التقارير",
      
      // Table Headers
      "user_name": "اسم المستخدم",
      "email": "البريد الإلكتروني",
      "phone": "رقم الهاتف",
      "status": "الحالة",
      "action": "إجراء",
      "role": "دور",
      "branch": "فرع",
      
      // Common Buttons & Actions
      "search": "بحث...",
      "add_new": "إضافة جديد",
      "edit": "تعديل",
      "delete": "حذف",
      "save": "حفظ",
      "cancel": "إلغاء",
      "active": "نشط",
      "inactive": "غير نشط",
      
      // UI Labels
      "select_language": "اختار اللغة",
      "welcome": "مرحباً بك"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;