# Design: Internationalization (i18n)

## 1. Dependencies & Setup

We will use the standard React i18n stack.

-   `i18next`: Core i18n library.
-   `react-i18next`: React bindings.
-   `i18next-browser-languagedetector`: Auto-detect language.
-   `i18next-http-backend`: To load translations from `public/locales`.

### Installation
```bash
npm install i18next react-i18next i18next-browser-languagedetector i18next-http-backend
```

### Configuration: `src/i18n.ts`
```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'zh-TW', // User requested zh-TW as fallback if detected, or we can use en as strict fallback. User said "Set zh-TW as the fallback if detected (or default to en)".
    // A common pattern: fallback to 'en', but detection handles preference.
    // If strict requirement: "Set zh-TW as the fallback if detected" -> Browser detector does this.
    // Let's set 'en' as true fallback for safety, but detection picks browser lang.
    fallbackLng: 'en',
    supportedLngs: ['en', 'zh', 'zh-TW'],
    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    }
  });

export default i18n;
```

## 2. Translation Files

Structure:
-   `public/locales/en/translation.json`
-   `public/locales/zh-TW/translation.json`

Schema Example:
```json
{
  "start_game": "Start Game",
  "settings": "Settings",
  "resume": "Resume",
  "level_up": "Level Up",
  "select_weapon": "Select Weapon",
  "hp": "HP",
  "speed": "Speed",
  "damage": "Damage",
  "pokemon_pikachu_name": "Pikachu",
  "pokemon_pikachu_desc": "Electric mouse."
}
```

## 3. Data Refactor: `src/config/GameData.ts`

We will modify the interfaces to replace hardcoded strings with keys.

**Before:**
```typescript
export interface DexEntry {
  name: string;
  description: string;
  //...
}
```

**After:**
```typescript
export interface DexEntry {
  nameKey: string;
  descKey: string;
  //...
}
//...
export const PLAYABLE_DEX: PlayableDexEntry[] = [
  {
    id: 'pikachu',
    nameKey: 'pokemon_pikachu_name',
    descKey: 'pokemon_pikachu_desc',
    //...
  }
]
```

## 4. Usage in React

**Setup:**
Codebase entry point (e.g., `main.tsx` or `App.tsx`) must import `./i18n`. `Suspense` might be needed.

**Component Example:**
```tsx
import { useTranslation } from 'react-i18next';
import { PLAYABLE_DEX } from '@/config/GameData';

export const DexCard = ({ pokemonId }: { pokemonId: string }) => {
  const { t } = useTranslation();
  const pokemon = PLAYABLE_DEX.find(p => p.id === pokemonId);

  if (!pokemon) return null;

  return (
    <div className="dex-card">
       <h3>{t(pokemon.nameKey)}</h3>
       <p>{t(pokemon.descKey)}</p>
    </div>
  );
};
```

## 5. Language Switcher

`src/components/LanguageToggle.tsx`:
```tsx
import React from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-toggle">
      <button onClick={() => changeLanguage('en')}>EN</button>
      <button onClick={() => changeLanguage('zh-TW')}>繁體中文</button>
    </div>
  );
};
```
