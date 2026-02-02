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
  private pendingCheatRewards: number = 0;

  constructor(startLevel: number = 1) {
    this.currentLevel = startLevel;
    this.currentXP = 0;
    this.xpToNextLevel = this.getNextLevelXpCap(startLevel);
  }

  /**
   * Calculate XP required to reach the next level.
   * Formula: 10 + (Level-1)*10
   * Ensures the first level up costs exactly the base amount (10)
   */
  public getNextLevelXpCap(level: number): number {
    // Formula: 10 + (Level-1)*10
    // Ensures the first level up costs exactly the base amount (10)
    return 10 + ((level - 1) * 10);
  }

  /**
   * Helper to expose static-like access if needed, or just instance method.
   * Keeping instance method as primary.
   */
  public static getNextLevelXpCap(level: number): number {
    // Formula: 10 + (Level-1)*10
    // Ensures the first level up costs exactly the base amount (10)
    return 10 + ((level - 1) * 10);
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
    this.xpToNextLevel = this.getNextLevelXpCap(this.currentLevel);
    return true;
  }

  /**
   * Check if currentXP is sufficient for next level and process ONE level up.
   * Can be called repeatedly to handle multi-level jumps sequentially.
   * 
   * @returns `true` if a level up occurred
   */
  public processLevelUp(): boolean {
    // Priority: Process queued cheat-granted rewards without checking XP cap logic
    if (this.pendingCheatRewards > 0) {
        this.pendingCheatRewards--;
        return true;
    }

    if (this.currentXP >= this.xpToNextLevel) {
      // Level up!
      this.currentLevel += 1;
      this.currentXP -= this.xpToNextLevel;
      // Ensure we don't have negative XP (though logic above should prevent massive over-subtraction if handled correctly, 
      // but loop handles remainder)
      
      // Update requirement for NEXT level
      this.xpToNextLevel = this.getNextLevelXpCap(this.currentLevel);
      
      console.log(`Level Up! Level ${this.currentLevel}. Next Level requires: ${this.xpToNextLevel} XP`);
      
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
    this.pendingCheatRewards = 0;
    this.xpToNextLevel = this.getNextLevelXpCap(1);
  }

  /**
   * Cheat: Instantly increase level counter and queue N-1 rewards.
   * This updates the visible level immediately (UX) while queuing upgrades.
   * Logic:
   *  - Level jumps from L to L+count immediately.
   *  - We must show 'count' upgrade screens. 
   *    - The first screen is shown by the caller triggering the sequence.
   *    - The remaining 'count-1' screens are queued here so processLevelUp() returns true.
   */
  public grantCheatLevels(count: number): void {
      if (count <= 0) return;
      
      this.currentLevel += count;
      // Recalculate cap for the new high level
      this.xpToNextLevel = this.getNextLevelXpCap(this.currentLevel);
      
      // Queue rewards.
      // If we add 1 level -> Queue 0 (Caller shows 1 screen, processLevelUp finds 0, stops).
      // If we add 5 levels -> Queue 4 (Caller shows 1, processLevelUp finds 4, recurses 4 times).
      const additionalScreens = Math.max(0, count - 1);
      this.pendingCheatRewards = (this.pendingCheatRewards || 0) + additionalScreens;
  }
}
