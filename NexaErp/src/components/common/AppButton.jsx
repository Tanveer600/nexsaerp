import React from 'react'
import { CButton } from '@coreui/react'

// Reusable Excel Function
const exportToExcel = (data, fileName) => {
  if (!data || data.length === 0) return

  const headers = Object.keys(data[0]).join('\t')
  const rows = data
    .map((obj) =>
      Object.values(obj)
        .map((val) => (val === null || val === undefined ? '' : val))
        .join('\t'),
    )
    .join('\n')

  const blob = new Blob([headers + '\n' + rows], {
    type: 'application/vnd.ms-excel',
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${fileName || 'Export'}.xls`
  link.click()
  URL.revokeObjectURL(url)
}

const AppButton = ({
  children,
  variant = 'purple',
  data = null,
  fileName = 'Report',
  ...props
}) => {
  const styles = {
    purple: {
      background: 'linear-gradient(135deg, #7c3aed, #4c1d95)',
      border: 'none',
      borderRadius: '14px',
      color: '#fff',
    },
    golden: {
      background: '#c1a545',
      border: 'none',
      borderRadius: '8px',
      color: '#000',
      fontWeight: '600',
    },
  }

  // Agar 'data' prop mojood hy, to ye khud hi excel download ka function attach kr dega
  const handleClick = (e) => {
    if (data) {
      exportToExcel(data, fileName)
    }
    if (props.onClick) {
      props.onClick(e)
    }
  }

  return (
    <CButton
      {...props}
      onClick={handleClick}
      style={{
        ...styles[variant],
        boxShadow: 'none',
        padding: '2px 16px'
      }}
    >
      {children}
    </CButton>
  )
}

export default AppButton
