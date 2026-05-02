import React from 'react'
import { useTranslation } from 'react-i18next'
import { CTableHeaderCell } from '@coreui/react' // CoreUI ka component import karein

const TableHeader = ({ col, activeColumn, setActiveColumn }) => {
  const { t } = useTranslation()

  // Safety Check
  const columnValue = col || ''

  // Translation Logic
  const translationKey = columnValue.toLowerCase().replace(/ /g, '_')
  const translatedLabel = t(translationKey, { defaultValue: columnValue })

  return (
    <CTableHeaderCell
      className="position-relative"
      style={{ cursor: 'pointer', paddingBottom: '12px' }}
      onClick={() => setActiveColumn && setActiveColumn(col)}
    >
      <div className="d-flex align-items-center justify-content-between">
        <span>{translatedLabel}</span>
      </div>

      {/* Purple Active Bar Logic */}
      {activeColumn === col && (
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
