import React from 'react'
import { useTranslation } from 'react-i18next'
import { CTableHeaderCell } from '@coreui/react'

const TableHeader = ({ col, sortKey, onSort, currentSort }) => {
  const { t } = useTranslation()

  const columnValue = col || ''
  const translationKey = columnValue.toLowerCase().replace(/ /g, '_')
  const translatedLabel = t(translationKey, { defaultValue: columnValue })

  const isSorted = sortKey && currentSort?.key === sortKey
  const direction = isSorted ? currentSort?.direction : null

  const handleClick = () => {
    if (sortKey && onSort) {
      onSort(sortKey)
    }
  }

  return (
    <CTableHeaderCell
      className="position-relative"
      style={{
        cursor: sortKey ? 'pointer' : 'default',
        paddingBottom: '12px',
        userSelect: 'none',
        backgroundColor: '#f8f9fa',
        minWidth: sortKey === 'quotationNumber' ? '140px' : 'auto',
      }}
      onClick={handleClick}
    >
      <div className="d-flex align-items-center justify-content-between">
        <span className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>
          {translatedLabel}
        </span>
        {sortKey && (
          <span
            className="ms-2"
            style={{
              fontSize: '12px',
              color: isSorted ? '#6f42c1' : '#adb5bd',
              opacity: isSorted ? 1 : 0.5,
            }}
          >
            {direction === 'asc' ? '▲' : direction === 'desc' ? '▼' : '↕️'}
          </span>
        )}
      </div>

      {isSorted && (
        <div
          className="position-absolute bottom-0 start-0 w-100"
          style={{
            height: '3px',
            backgroundColor: '#6f42c1',
            transition: 'all 0.3s ease',
          }}
        />
      )}
    </CTableHeaderCell>
  )
}

export default TableHeader
