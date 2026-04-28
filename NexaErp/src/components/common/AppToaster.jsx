import React from 'react'
import { CToaster, CToast, CToastBody, CToastHeader } from '@coreui/react'

const AppToaster = ({ toasts, removeToast }) => {
  // Ultra-Thin Minimalist Styles
  const toastStyle = {
    backgroundColor: '#fff',
    border: '1px solid #6f42c1', // Bilkul bariki (thin) border
    borderRadius: '4px',         // Thora kam round
    color: '#6f42c1',
    maxWidth: '300px',
  }

  const headerStyle = {
    backgroundColor: 'transparent',
    borderBottom: '1px solid #f0f0f0', // Bohat light divider
    padding: '6px 12px',
    color: '#6f42c1',
  }

  const textStyle = {
    fontWeight: '400',            // Thin/Normal font weight
    fontSize: '0.9rem',
    color: '#6f42c1',
  }

  return (
    <CToaster placement="top-end" className="p-3" style={{ zIndex: 9999 }}>
      {toasts.map((toast) => (
        <CToast
          key={toast.id}
          visible={true}
          autohide={true}
          delay={3000}
          style={toastStyle}
          className="mb-2 shadow-sm"
        >
          <CToastHeader 
            closeButton 
            onClose={() => removeToast(toast.id)}
            style={headerStyle}
          >
            <strong className="me-auto" style={{ fontWeight: '500', fontSize: '0.85rem' }}>
              {toast.title}
            </strong>
          </CToastHeader>
          <CToastBody style={textStyle}>
            {toast.message}
          </CToastBody>
        </CToast>
      ))}
    </CToaster>
  )
}

export default AppToaster