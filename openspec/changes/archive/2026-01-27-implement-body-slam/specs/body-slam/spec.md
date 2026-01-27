# Body Slam Specification

## ADDED Requirements

### Requirement: Body Slam Stats and Visuals
The Body Slam weapon SHALL operate as an expanding AOE shockwave with specific progression for damage, area, cooldown, and additional effects like stun at higher levels.




#### Scenario: Level 1 Stats
*   **Given** Player has Body Slam Level 1
*   **When** The weapon fires
*   **Then** It should deal **15 Damage**
*   **And** It should affect an area of **160 Radius**
*   **And** The cooldown should be **1500ms**
*   **And** It should apply **500 Knockback**

#### Scenario: Visual Feedback
*   **Given** The weapon fires
*   **Then** A white circle with grey outline should expand from 0 to target radius over 200ms
*   **And** The screen should shake (Intensity 0.01)

#### Scenario: Progression Level 7 (Stun)
*   **Given** Player has Body Slam Level 7
*   **When** The weapon hits an enemy
*   **Then** The enemy should be stunned for **1000ms**

#### Scenario: Progression Level 8 (Massive Area)
*   **Given** Player has Body Slam Level 8
*   **When** The weapon fires
*   **Then** The area radius should be **250**
