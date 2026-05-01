import React from 'react'

const ValidationError = ({ message }) => {
  if (!message) return null

  return (
    <div
      style={{
        color: '#7c3aed',
        fontSize: '10px',
        fontWeight: '600',
        marginTop: '6px',
        padding: '2px 8px',
        backgroundColor: 'rgba(124, 58, 237, 0.08)',
        borderLeft: '3px solid #7c3aed',
        borderRadius: '2px',
        display: 'inline-flex',
        alignItems: 'center',
        letterSpacing: '0.4px',
        textTransform: 'uppercase', // Professional look
      }}
    >
      <span style={{ marginRight: '4px' }}>⚠</span> {message}
    </div>
  )
}

export default ValidationError
