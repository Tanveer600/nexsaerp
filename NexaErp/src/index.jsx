import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'
import { ToastProvider } from './components/common/ToastContext'
import { ThemeProvider } from './components/common/ThemeContext'
import { LanguageProvider } from './components/common/LanguageContext' // 1. Provider Import Karen
import App from './App'
import './i18n'
import store from './redux/store'
import './scss/style.scss'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ThemeProvider>
      {/* 2. LanguageProvider ko yahan wrap karen */}
      <LanguageProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  </Provider>,
)
