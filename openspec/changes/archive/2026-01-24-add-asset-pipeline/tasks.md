## Implementation Tasks

### 1. Script Foundation
- [x] 1.1 Create `scripts/requirements.txt` with `requests` and `Pillow`
- [x] 1.2 Create `scripts/download_assets.py` with configurable Pokémon ID list
- [x] 1.3 Implement command-line argument parsing for custom IDs

### 2. PMDCollab Integration
- [x] 2.1 Implement AnimData.xml parser to extract Walk animation metadata
- [x] 2.2 Implement sprite sheet downloader for {Animation}-Anim.png
- [x] 2.3 Handle download errors gracefully (404s, network issues)

### 3. Image Processing
- [x] 3.1 Extract Walk animation frames from sprite sheet using Pillow
- [x] 3.2 Stitch frames into horizontal strip sprite sheet
- [x] 3.3 Save processed sprites to `public/assets/sprites/{id}.png`

### 4. Manifest Generation
- [x] 4.1 Generate `public/assets/manifest.json` with id, name, path, and frame metadata
- [x] 4.2 Use hardcoded Pokémon name mapping (Gen 1-151 covered)
- [x] 4.3 Include frameWidth, frameHeight, and frameCount for Phaser loading

### 5. Integration Documentation
- [x] 5.1 Document Phaser Preloader integration steps in design.md
- [x] 5.2 Provide example code for manifest-driven sprite loading

### 6. Verification
- [x] 6.1 Run script with default IDs `[1, 4, 7, 25, 133, 150]`
- [x] 6.2 Verify generated sprites are valid PNG files with correct dimensions
- [x] 6.3 Verify manifest.json is valid JSON with all required fields
- [x] 6.4 Test game loads and sprites are accessible via dev server
