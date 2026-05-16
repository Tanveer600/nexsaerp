import React from 'react'
import { CButton } from '@coreui/react'
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
  className = '',
  ...props
}) => {
  const styles = {
    purple: {
      background: 'linear-gradient(135deg, #7c3aed, #4c1d95)',
      border: 'none',
      borderRadius: '12px',
      color: '#fff',
    },
    golden: {
      background: '#c1a545',
      border: 'none',
      borderRadius: '8px',
      color: '#000',
      fontWeight: '600',
    },

    primary: {
      background: '#e28a2b',
      border: 'none',
      borderRadius: '8px',
      color: '#fff',
      fontWeight: '600',
    },
  }

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
      className={`${className} shadow-sm`}
      onClick={handleClick}
      style={{
        ...styles[variant],
        padding: '8px 20px',
        minWidth: '110px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...props.style,
      }}
    >
      {children}
    </CButton>
  )
}

export default AppButton
