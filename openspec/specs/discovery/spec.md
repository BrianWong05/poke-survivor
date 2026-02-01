# Specifications: Dynamic Character Registry

## Requirement: Automatic Discovery
The system SHALL automatically discover all `CharacterConfig` exports in the `./src/game/entities/characters/` directory.
- **Detection Pattern**: Modules ending in `.ts` excluding `registry.ts` and `types.ts`.
- **Export Pattern**: Constants/Variables ending with the suffix `Config`.

## Requirement: Registration
The system SHALL populate the `characterRegistry` map using the discovered configurations.
- **Key**: The `id` property of the `CharacterConfig`.
- **Value**: The `CharacterConfig` object itself.
