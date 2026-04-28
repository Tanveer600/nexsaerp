import React, { createContext, useContext } from 'react'
import { useTranslation } from 'react-i18next'

const LanguageContext = createContext()

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation()

  const changeLanguage = (lang) => {
    // 1. Pehle React ka layout badlo (RTL/LTR ke liye)
    i18n.changeLanguage(lang)

    // 2. Phir Google Translate widget ko trigger karo (Poora page translate karne ke liye)
    const googleCombo = document.querySelector('.goog-te-combo')
    if (googleCombo) {
      googleCombo.value = lang
      googleCombo.dispatchEvent(new Event('change'))
    }
  }

  // l() function ab simple rakhein, machine khud handle karegi
  const l = (text) => text

  return (
    <LanguageContext.Provider value={{ l, i18n, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useAppLanguage = () => useContext(LanguageContext)
