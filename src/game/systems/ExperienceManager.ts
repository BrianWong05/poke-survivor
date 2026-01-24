/**
 * Exp Candy tiers based on Pokémon game conventions.
 * Each tier has a different XP value and visual appearance.
 */
export const ExpCandyTier = {
  S: 's',      // Small - common drop
  M: 'm',      // Medium
  L: 'l',      // Large - rare
  XL: 'xl',    // Extra large - very rare
  RARE: 'rare', // Rare Candy - boss-only
} as const;

export type ExpCandyTier = typeof ExpCandyTier[keyof typeof ExpCandyTier];

/**
 * XP values for each Exp Candy tier.
 */
export const EXP_CANDY_VALUES: Record<ExpCandyTier, number> = {
  [ExpCandyTier.S]: 1,
  [ExpCandyTier.M]: 10,
  [ExpCandyTier.L]: 50,
  [ExpCandyTier.XL]: 100,
  [ExpCandyTier.RARE]: 200,
};

/**
 * Visual configuration for each Exp Candy tier.
 * Colors and sizes for programmatic graphics.
 */
export const EXP_CANDY_VISUALS: Record<ExpCandyTier, { color: number; size: number; isSquare?: boolean }> = {
  [ExpCandyTier.S]: { color: 0xffd700, size: 8 },     // Yellow, small
  [ExpCandyTier.M]: { color: 0xffa500, size: 10 },    // Orange, medium
  [ExpCandyTier.L]: { color: 0xff4a4a, size: 12 },    // Red, large
  [ExpCandyTier.XL]: { color: 0x9370db, size: 14 },   // Purple, extra large
  [ExpCandyTier.RARE]: { color: 0x00ffff, size: 16, isSquare: true }, // Cyan square, boss-only
};

/**
 * Drop probabilities for regular enemy kills.
 * Rare Candy is NOT included here (boss-only).
 */
export const EXP_CANDY_DROP_WEIGHTS: { tier: ExpCandyTier; weight: number }[] = [
  { tier: ExpCandyTier.S, weight: 70 },
  { tier: ExpCandyTier.M, weight: 20 },
  { tier: ExpCandyTier.L, weight: 8 },
  { tier: ExpCandyTier.XL, weight: 2 },
];

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
   * Formula: Base(5) + (Level * 10)
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

  /**
   * Roll for a random Exp Candy tier based on drop weights.
   * Does NOT include Rare Candy (use `ExpCandyTier.RARE` directly for bosses).
   */
  public static rollCandyTier(): ExpCandyTier {
    const totalWeight = EXP_CANDY_DROP_WEIGHTS.reduce((sum, w) => sum + w.weight, 0);
    let roll = Math.random() * totalWeight;
    
    for (const { tier, weight } of EXP_CANDY_DROP_WEIGHTS) {
      roll -= weight;
      if (roll <= 0) {
        return tier;
      }
    }
    
    // Fallback to smallest tier
    return ExpCandyTier.S;
  }
}
