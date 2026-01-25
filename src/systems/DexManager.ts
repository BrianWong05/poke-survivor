import { PLAYABLE_DEX } from '@/config/GameData';

export class DexManager {
  private static readonly STORAGE_KEY = 'vampire-survivor-dex';
  private static instance: DexManager;

  private seen: Set<string>;
  private unlocked: Set<string>;

  private constructor() {
    this.seen = new Set();
    this.unlocked = new Set();
    this.load();
  }

  public static getInstance(): DexManager {
    if (!DexManager.instance) {
      DexManager.instance = new DexManager();
    }
    return DexManager.instance;
  }

  /**
   * Mark an entity as seen (greyed out in Dex)
   */
  public markSeen(id: string): void {
    if (!this.seen.has(id)) {
      this.seen.add(id);
      this.save();
    }
  }

  /**
   * Mark an entity as unlocked (fully visible in Dex)
   * Implicitly marks it as seen too.
   */
  public markUnlocked(id: string): void {
    let changed = false;
    if (!this.seen.has(id)) {
      this.seen.add(id);
      changed = true;
    }
    if (!this.unlocked.has(id)) {
      this.unlocked.add(id);
      changed = true;
    }

    if (changed) {
      console.log(`[DexManager] Unlocked: ${id}`);
      this.save();
    }
  }

  public isSeen(id: string): boolean {
    return this.seen.has(id);
  }

  public isUnlocked(id: string): boolean {
    return this.unlocked.has(id);
  }

  private load(): void {
    try {
      const dataStr = localStorage.getItem(DexManager.STORAGE_KEY);
      if (dataStr) {
        const data = JSON.parse(dataStr);
        if (data.seen && Array.isArray(data.seen)) {
          this.seen = new Set(data.seen);
        }
        if (data.unlocked && Array.isArray(data.unlocked)) {
          this.unlocked = new Set(data.unlocked);
        }
      }

      // Ensure all playable characters are unlocked by default
      // This matches the Character Selection screen where they are all available
      PLAYABLE_DEX.forEach(char => {
        this.markUnlocked(char.id);
      });
      
    } catch (e) {
      console.error('Failed to load Dex data:', e);
    }
  }

  private save(): void {
    try {
      const data = {
        seen: Array.from(this.seen),
        unlocked: Array.from(this.unlocked),
      };
      localStorage.setItem(DexManager.STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save Dex data:', e);
    }
  }

  /**
   * Debug helper to reset progress
   */
  public reset(): void {
    this.seen.clear();
    this.unlocked.clear();
    localStorage.removeItem(DexManager.STORAGE_KEY);
  }
}
