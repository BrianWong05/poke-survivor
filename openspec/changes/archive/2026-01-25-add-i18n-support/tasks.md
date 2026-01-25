# Tasks: Add i18n Support

## Dependencies & Setup
- [x] Install `i18next`, `react-i18next`, `i18next-browser-languagedetector`, `i18next-http-backend`.
- [x] Create `src/i18n.ts` configuration file.
- [x] Import `i18n.ts` in `src/main.tsx` (or entry point).

## Translation Assets
- [x] Create directory structure `public/locales/en/` and `public/locales/zh-TW/`.
- [x] Create `public/locales/en/translation.json` with initial keys.
- [x] Create `public/locales/zh-TW/translation.json` with initial keys.

## Data Refactoring
- [x] Refactor `DexEntry`, `PlayableDexEntry`, `EnemyDexEntry`, `WeaponDexEntry` interfaces in `src/config/GameData.ts` to use `nameKey` and `descKey`.
- [x] Update `PLAYABLE_DEX` data with keys.
- [x] Update `ENEMY_DEX` data with keys.
- [x] Update `WEAPON_DEX` data with keys.

## Component Updates
- [x] Create `src/components/Shared/LanguageToggle.tsx` (or similar appropriate path).
- [x] Update `DexScreen` (and related components) to use `useTranslation`.
- [x] Update `MainMenu` (or equivalent) to use `useTranslation` for buttons. (CharacterSelect)
- [x] Add `LanguageToggle` to the UI (e.g. Settings or MainMenu).

## Verification
- [x] Verify dependency installation.
- [x] Verify language detection (defaults to browser lang).
- [x] Verify manual language switching works.
- [x] Verify fallback behavior.

## Refinement (Missing Scope)
- [x] Refactor `CharacterConfig` and `PassiveConfig` locally to support i18n keys.
- [x] Update `CharacterSelect` to translate Archetypes and Passives.
- [x] Add missing translations for Archetypes and Passives to localization files.
