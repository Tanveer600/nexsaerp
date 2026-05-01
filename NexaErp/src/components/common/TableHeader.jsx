import React from 'react'
import { useTranslation } from 'react-i18next'

const TableHeader = ({ col, activeColumn, setActiveColumn }) => {
  const { t } = useTranslation()

  // Safety Check: Agar col undefined ho toh empty string use karein
  const columnValue = col || ''

  // Logic: "User Name" -> "user_name"
  const translationKey = columnValue.toLowerCase().replace(/ /g, '_')
  const translatedLabel = t(translationKey, { defaultValue: columnValue })

  return (
    <div
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
    </div>
  )
}

export default TableHeader
