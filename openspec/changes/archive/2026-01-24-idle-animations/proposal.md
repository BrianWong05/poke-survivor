# Idle Animations Proposal

## Summary
Implement proper support for "Idle" animations in the game engine and asset pipeline. Currently, the game only extracts and uses "Walk" animations. This change will enable the asset pipeline to extract "Idle" animations (where available) and update the game logic to switch between "Walk" and "Idle" states based on movement.

## Problem Statement
The character currently plays the "Walk" animation continuously or pauses on a frame when stopped (if implemented). To improve visual fidelity and align with the user request "when the character is not moving, it should use idle instead of walking", we need dedicated support for the Idle animation type from the PMD sprite source.

## Goals
1.  Update `download_assets.py` to extract both "Walk" and "Idle" animations.
2.  Update `manifest.json` schema to support multiple animation types per sprite.
3.  Update `Preloader.ts` to load and create proper Phaser animations for both states.
4.  Update `MainScene.ts` to switch animations based on player velocity.

## Non-Goals
- Adding other animation types like "Attack" or "Sleep" (though the design should be extensible).
