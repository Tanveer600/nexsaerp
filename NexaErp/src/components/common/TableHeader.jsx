import React from 'react';
import { useTranslation } from 'react-i18next';

const TableHeader = ({ col, activeColumn, setActiveColumn }) => {
  const { t } = useTranslation();

  // Logic: "User Name" -> "user_name"
  // Taake i18n file mein key match ho jaye
  const translationKey = col.toLowerCase().replace(/ /g, "_");
  const translatedLabel = t(translationKey, { defaultValue: col });

  return (
    <th 
      className="position-relative" 
      style={{ cursor: 'pointer', paddingBottom: '12px' }} 
      onClick={() => setActiveColumn(col)}
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
            backgroundColor: '#6f42c1', // Purple Color
            transition: 'all 0.3s ease' 
          }} 
        />
      )}
    </th>
  );
};

export default TableHeader;