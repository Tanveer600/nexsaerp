import React, { useEffect } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

const DefaultLayout = () => {
  useEffect(() => {
    // Sidebar ka color apply karne ki logic
    const updateSidebarTheme = () => {
      const savedColor = localStorage.getItem('appThemeColor') || '#321fdb'; // Default Blue
      // Root level par variable set kar rahe hain
      document.documentElement.style.setProperty('--cui-primary', savedColor);
    };

    updateSidebarTheme();
    
    // Agar kisi doosry tab ya component mein color change ho toh foran update ho
    window.addEventListener('storage', updateSidebarTheme);
    return () => window.removeEventListener('storage', updateSidebarTheme);
  }, []);

  return (
    <div className="nexa-erp-layout">
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout