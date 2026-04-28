import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { CPopover, CButton } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil } from '@coreui/icons';

const ThemeSwitcher = () => {
  const { changeColor } = useContext(ThemeContext);
  
const colors = [
  '#0B2E4A',
  '#1E5A8A',
  '#2D8FDD',
  '#3A5A40',
  '#78B159',
  '#5B2C6F',
  '#A66DD4',
  '#C75C28',
  '#F4A261',
  '#8B1E1E',
  '#E57373',
  '#C9A227',
  '#E6C35C',
  '#5C6B73',
  '#AAB2BD'
];

  const shortcuts = [
    { key: 'Alt + o', label: 'Product Selection' },
    { key: 'Alt + p', label: 'Settlement' },
    { key: 'Alt + s', label: 'Save Invoice' },
    { key: 'Enter', label: 'Payment by Cash' },
  ];

  return (
    <CPopover
      content={
        <div className="p-3" style={{ width: '280px', maxHeight: '400px', overflowY: 'auto' }}>
          <h6 className="mb-2 text-muted" style={{ fontSize: '12px' }}>LIGHT THEME</h6>
          <div className="d-flex flex-wrap gap-2 mb-3">
            {colors.map((color) => (
              <div
                key={color}
                onClick={() => changeColor(color)}
                className="color-circle"
                style={{
                  backgroundColor: color,
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  border: '2px solid transparent',
                  transition: '0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.borderColor = '#ccc'}
                onMouseOut={(e) => e.target.style.borderColor = 'transparent'}
              />
            ))}
          </div>

          <hr />

          <h6 className="mb-2 text-muted" style={{ fontSize: '12px' }}>KEYBOARD SHORTCUTS</h6>
          <ul className="list-unstyled mb-0" style={{ fontSize: '13px' }}>
            {shortcuts.map((s, idx) => (
              <li key={idx} className="mb-1">
                <strong>{idx + 1}. {s.key}</strong> = {s.label}
              </li>
            ))}
          </ul>
        </div>
      }
      placement="bottom"
      trigger="click"
    >
      <CButton color="link" className="p-0 border-0 shadow-none">
        <CIcon icon={cilPencil} size="lg" style={{ color: '#8a93a2' }} />
      </CButton>
    </CPopover>
  );
};

export default ThemeSwitcher;