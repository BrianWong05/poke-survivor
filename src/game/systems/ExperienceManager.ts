/**
 * Exp Candy tiers based on Pokémon game conventions.
 * Each tier has a different XP value and visual appearance.
 */
export const ExpCandyTier = {
  S: 's',      // Small - common drop
  M: 'm',      // Medium
  L: 'l',      // Large - rare
  RARE: 'rare', // Rare Candy - boss-only
} as const;

export type ExpCandyTier = typeof ExpCandyTier[keyof typeof ExpCandyTier];

/**
 * XP values for each Exp Candy tier.
 */
/**
 * XP values for each Exp Candy tier.
 * aligned with LootConfig.
 */
export const EXP_CANDY_VALUES: Record<ExpCandyTier, number> = {
  [ExpCandyTier.S]: 1,
  [ExpCandyTier.M]: 10,
  [ExpCandyTier.L]: 100,
  [ExpCandyTier.RARE]: 1000,
};

/**
 * Visual configuration for each Exp Candy tier.
 * Colors and sizes for programmatic graphics.
 */
export const EXP_CANDY_VISUALS: Record<ExpCandyTier, { color: number; size: number; isSquare?: boolean }> = {
  [ExpCandyTier.S]: { color: 0x4a9eff, size: 8 },     // Blue, small
  [ExpCandyTier.M]: { color: 0x2ecc71, size: 10 },    // Green, medium
  [ExpCandyTier.L]: { color: 0xe74c3c, size: 12 },    // Red, large
  [ExpCandyTier.RARE]: { color: 0xf1c40f, size: 16, isSquare: true }, // Gold square, boss-only
};

/**
 * Pure TypeScript class to manage experience points and leveling.
 * Decoupled from Phaser for testability and reusability.
 */
export class ExperienceManager {
  /** Current player level (starts at 1) */
  public currentLevel: number;
  
  /** Current XP within the current level */
  public currentXP: number;
  
  /** XP required to reach the next level */
  public xpToNextLevel: number;

  constructor(startLevel: number = 1) {
    this.currentLevel = startLevel;
    this.currentXP = 0;
    this.xpToNextLevel = this.getRequiredXP(startLevel + 1);
  }

  /**
   * Calculate XP required to reach a specific level.
   * Formula: 5 + (Level * 10)
   * 
   * @example
   * Level 2: 5 + (2 * 10) = 25 XP
   * Level 10: 5 + (10 * 10) = 105 XP
   */
  public static getRequiredXP(level: number): number {
    return 5 + (level * 10);
  }

  public getRequiredXP(level: number): number {
    return ExperienceManager.getRequiredXP(level);
  }

  /**
   * Calculate effective XP gain after applying diminishing returns.
   * 
   * Multipliers by level bracket:
   * - Level 1-19: 1.0x (full XP)
   * - Level 20-39: 0.75x
   * - Level 40-59: 0.50x
   * - Level 60+: 0.25x
   */
  public static calculateGain(amount: number, level: number): number {
    let multiplier = 1.0;
    
    if (level >= 60) {
      multiplier = 0.25;
    } else if (level >= 40) {
      multiplier = 0.50;
    } else if (level >= 20) {
      multiplier = 0.75;
    }
    
    return Math.floor(amount * multiplier);
  }

  public calculateGain(amount: number, level: number): number {
    return ExperienceManager.calculateGain(amount, level);
  }

  /**
   * Add XP to the player, handling level-ups and diminishing returns.
   * 
   * @param amount Raw XP amount (before diminishing returns)
   * @returns `true` if the player leveled up, `false` otherwise
   */
  public addXP(amount: number): boolean {
    const adjustedAmount = this.calculateGain(amount, this.currentLevel);
    this.currentXP += adjustedAmount;
    
    // Return true if eligible for level up, but don't process it yet
    return this.currentXP >= this.xpToNextLevel;
  }

  /**
   * Grant an instant level up (e.g., from Rare Candy).
   * Resets current XP to 0 and jumps to next level.
   * 
   * @returns `true` (always triggers level up)
   */
  public addInstantLevel(): boolean {
    // Fill the bar completely
    // Effectively we just advance the level
    this.currentLevel += 1;
    this.currentXP = 0; // Reset bar for new level
    this.xpToNextLevel = this.getRequiredXP(this.currentLevel + 1);
    return true;
  }

  /**
   * Check if currentXP is sufficient for next level and process ONE level up.
   * Can be called repeatedly to handle multi-level jumps sequentially.
   * 
   * @returns `true` if a level up occurred
   */
  public processLevelUp(): boolean {
    if (this.currentXP >= this.xpToNextLevel) {
      // Level up!
      this.currentLevel += 1;
      this.currentXP -= this.xpToNextLevel;
      this.xpToNextLevel = this.getRequiredXP(this.currentLevel + 1);
      return true;
    }
    
    return false;
  }

  /**
   * Reset the ExperienceManager to initial state.
   */
  public reset(): void {
    this.currentLevel = 1;
    this.currentXP = 0;
    this.xpToNextLevel = this.getRequiredXP(2);
  }
}
