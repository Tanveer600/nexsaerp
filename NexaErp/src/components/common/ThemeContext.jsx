import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

function shadeColor(color, percent) {
  let R = parseInt(color.substring(1,3),16);
  let G = parseInt(color.substring(3,5),16);
  let B = parseInt(color.substring(5,7),16);

  R = parseInt(R * (100 + percent) / 100);
  G = parseInt(G * (100 + percent) / 100);
  B = parseInt(B * (100 + percent) / 100);

  R = (R<255)?R:255;  
  G = (G<255)?G:255;  
  B = (B<255)?B:255;  

  return "#" + 
    R.toString(16).padStart(2,'0') +
    G.toString(16).padStart(2,'0') +
    B.toString(16).padStart(2,'0');
}

export const ThemeProvider = ({ children }) => {
  const [themeColor, setThemeColor] = useState(localStorage.getItem('appThemeColor') || '#321fdb');

  const changeColor = (color) => {
    setThemeColor(color);
    localStorage.setItem('appThemeColor', color);

    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    const root = document.documentElement;
root.style.setProperty('--dynamic-primary', color);
    root.style.setProperty('--cui-primary', color);
    root.style.setProperty('--cui-primary-rgb', `${r}, ${g}, ${b}`);
    root.style.setProperty('--cui-primary-hover', shadeColor(color, -10));
    root.style.setProperty('--cui-primary-border-subtle', shadeColor(color, 40));
    root.style.setProperty('--cui-btn-bg', color);
    root.style.setProperty('--cui-btn-border-color', color);
  };

  // 🔥 IMPORTANT
  useEffect(() => {
    changeColor(themeColor);
  }, []);

  return (
    <ThemeContext.Provider value={{ themeColor, changeColor }}>
      {children}
    </ThemeContext.Provider>
  );
};