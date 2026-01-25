# Add Internationalization (i18n) Support

## Goal
To implement Internationalization (i18n) support for the game, enabling users to switch between English (`en`) and Traditional Chinese (`zh-TW`). This involves integrating `react-i18next`, setting up translation files, and refactoring game data to use translation keys instead of hardcoded strings.

## Motivation
Supporting multiple languages expands the game's accessibility to a wider audience. The user specifically requested support for English and Traditional Chinese for menu buttons, HUD labels, and static game data (Dex).

## Scope
-   **Dependencies**: Install `i18next`, `react-i18next`, `i18next-browser-languagedetector`, and `i18next-http-backend` (for loading locales from `public/`).
-   **Configuration**: Set up `src/i18n.ts` for detection and fallback.
-   **Assets**: Create `public/locales/en/translation.json` and `public/locales/zh-TW/translation.json`.
-   **Data**: Refactor `GameData.ts` to use translation keys (`nameKey`, `descKey`).
-   **UI**: Update React components to use `useTranslation`.
-   **Feature**: Add a `LanguageToggle` component.

## Risks
-   **Breaking Changes**: Refactoring `GameData.ts` will break existing components that rely on `name` and `description` properties until they are updated to use translation keys.
-   **Performance**: Loading translation files at runtime might introduce a slight delay on initial load (mitigated by suspense/fallback).
