# Design: Level Break Tuning

## Architecture
Modify `Player.ts`.

## Code Changes
Update `applyLimitBreak` method (referred to as `attemptChestEvolution` path by user).

**New Logic:**
```typescript
    // Tuned Constants (Targeting 2.5x scaling curve)
    const hpBoost = 150;      
    const mightBoost = 0.75;  // +75% Damage per break
    const defenseBoost = 3;   

    // Apply Stats
    this.maxHP += hpBoost;
    this.might += mightBoost;
    this.defense += defenseBoost;
    
    // Visual Feedback: Heal to full to celebrate the power-up
    this.heal(this.maxHP); 
    
    console.log(`[Level Break] Power Up! HP+${hpBoost}, Might+${(mightBoost * 100).toFixed(0)}%, Def+${defenseBoost}`);
```
