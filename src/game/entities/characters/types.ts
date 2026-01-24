import type Phaser from 'phaser';
import { ExperienceManager } from '@/game/systems/ExperienceManager';

/**
 * Damage types for projectiles and attacks.
 * Used by passives like Thick Fat to modify incoming damage.
 */
export type DamageType = 'normal' | 'fire' | 'ice' | 'electric' | 'ghost' | 'fighting';

/**
 * Base stats for a character.
 */
export interface CharacterStats {
  maxHP: number;
  speed: number;
  baseDamage: number;
}

/**
 * Context passed to passive/weapon/ultimate functions.
 */
export interface CharacterContext {
  scene: Phaser.Scene;
  player: Phaser.Physics.Arcade.Sprite;
  stats: CharacterStats;
  currentHP: number;
  level: number;
  xp: number;
}

/**
 * Configuration for a passive ability.
 */
export interface PassiveConfig {
  id: string;
  name: string;
  description: string;
  /** Called once when character is created */
  onInit?: (ctx: CharacterContext) => void;
  /** Called every frame */
  onUpdate?: (ctx: CharacterContext, delta: number) => void;
  /** Called when player takes damage, returns modified damage */
  onDamageTaken?: (ctx: CharacterContext, damage: number, damageType: DamageType) => number;
  /** Called when enemy touches player */
  onEnemyTouch?: (ctx: CharacterContext, enemy: Phaser.Physics.Arcade.Sprite) => void;
}

/**
 * Configuration for a weapon.
 */
export interface WeaponConfig {
  id: string;
  name: string;
  description: string;
  cooldownMs: number;
  /** Function called to fire the weapon */
  fire: (ctx: CharacterContext) => void;
  /** Evolution of this weapon (unlocked at higher levels) */
  evolution?: WeaponConfig;
  /** Level required to evolve (default: 5) */
  evolutionLevel?: number;
}

/**
 * Configuration for an ultimate ability.
 */
export interface UltimateConfig {
  id: string;
  name: string;
  description: string;
  cooldownMs: number;
  /** Duration of the ultimate effect in ms (0 = instant) */
  durationMs?: number;
  /** Execute the ultimate ability */
  execute: (ctx: CharacterContext) => void;
  /** Called when ultimate duration ends (if durationMs > 0) */
  onEnd?: (ctx: CharacterContext) => void;
}

/**
 * Full configuration for a playable character.
 */
export interface CharacterConfig {
  id: string;
  name: string;
  displayName: string;
  archetype: string;
  stats: CharacterStats;
  passive: PassiveConfig;
  weapon: WeaponConfig;
  ultimate: UltimateConfig;
  /** Sprite texture key (from manifest) */
  spriteKey: string;
}

/**
 * Runtime state for an active character (mutable).
 */
export interface CharacterState {
  config: CharacterConfig;
  currentHP: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  isEvolved: boolean;
  activeWeapon: WeaponConfig;
  ultimateCooldownRemaining: number;
  isUltimateActive: boolean;
}

/**
 * Calculate XP required to reach the next level.
 * Formula: 5 + (level * 10) (via ExperienceManager)
 */
export function xpToLevel(level: number): number {
  return ExperienceManager.getRequiredXP(level);
}

/**
 * Create initial character state from config.
 */
export function createCharacterState(config: CharacterConfig): CharacterState {
  return {
    config,
    currentHP: config.stats.maxHP,
    level: 1,
    xp: 0,
    xpToNextLevel: xpToLevel(2),
    isEvolved: false,
    activeWeapon: config.weapon,
    ultimateCooldownRemaining: 0,
    isUltimateActive: false,
  };
}

/**
 * Add XP and handle leveling up.
 * Returns true if the character leveled up.
 */
export function addXP(state: CharacterState, amount: number): boolean {
  const adjustedAmount = ExperienceManager.calculateGain(amount, state.level);
  state.xp += adjustedAmount;
  
  if (state.xp >= state.xpToNextLevel) {
    state.level += 1;
    state.xp -= state.xpToNextLevel;
    state.xpToNextLevel = xpToLevel(state.level + 1);
    
    // Check for weapon evolution
    const evolutionLevel = state.config.weapon.evolutionLevel ?? 5;
    if (!state.isEvolved && state.level >= evolutionLevel && state.config.weapon.evolution) {
      state.activeWeapon = state.config.weapon.evolution;
      state.isEvolved = true;
    }
    
    return true;
  }
  
  return false;
}
