import React from 'react'
import { CSpinner } from '@coreui/react'

const AppLoader = ({ message = 'Loading...' }) => {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{
        minHeight: '300px',
        width: '100%',
      }}
    >
      <CSpinner
        style={{
          width: '3rem',
          height: '3rem',
          color: '#4c1d95', // Aapka Purple theme color
        }}
      />
      <h5
        className="mt-3 fw-semibold"
        style={{
          color: '#4c1d95',
          letterSpacing: '0.5px',
        }}
      >
        {message}
      </h5>
      <p className="text-muted small">Please wait a moment</p>
    </div>
  )
}

export default AppLoader
