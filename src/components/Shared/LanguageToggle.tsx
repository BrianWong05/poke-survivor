import React from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-toggle" style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1000 }}>
      <button 
        onClick={() => changeLanguage('en')} 
        style={{ 
          marginRight: '10px', 
          opacity: i18n.language.startsWith('en') ? 1 : 0.5,
          fontWeight: i18n.language.startsWith('en') ? 'bold' : 'normal',
          background: 'none',
          border: '1px solid currentColor',
          color: 'white',
          padding: '5px 10px',
          cursor: 'pointer'
        }}
      >
        EN
      </button>
      <button 
        onClick={() => changeLanguage('zh-TW')}
        style={{ 
          opacity: i18n.language.startsWith('zh') ? 1 : 0.5,
          fontWeight: i18n.language.startsWith('zh') ? 'bold' : 'normal',
          background: 'none',
          border: '1px solid currentColor',
          color: 'white',
          padding: '5px 10px',
          cursor: 'pointer'
        }}
      >
        繁體中文
      </button>
    </div>
  );
};
