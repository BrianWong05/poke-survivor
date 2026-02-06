import Phaser from 'phaser';

import { TILE_LAYOUT_RULES } from './AutoTileTable';

export class AutoTileGenerator {
    // Coordinates for Dirt.png (96x128)
    private static SRC = {
        TL_CORNER: { x: 0, y: 2 }, TR_CORNER: { x: 4, y: 2 },
        BL_CORNER: { x: 0, y: 6 }, BR_CORNER: { x: 4, y: 6 },
        TOP_EDGE:  { x: 2, y: 2 }, BOT_EDGE:  { x: 2, y: 6 },
        LEFT_EDGE: { x: 0, y: 4 }, RIGHT_EDGE:{ x: 4, y: 4 },
        CENTER:    { x: 2, y: 4 },
        INNER_CORNER: { x: 4, y: 0 } // Inner corner tile in Dirt.png
    };

    static generate(scene: Phaser.Scene, sourceKey: string, newKey: string) {
        if (scene.textures.exists(newKey)) scene.textures.remove(newKey);
        const rt = scene.add.renderTexture(0, 0, 8 * 32, 6 * 32);

        // We iterate 0-47. 
        // BUT, instead of relying on a broken mask table, we define the SHAPE explicitly.
        // (Standard 47-tile blob order used by bitmasking libraries)
        
        for (let i = 0; i < 47; i++) {
            const dx = (i % 8) * 32;
            const dy = Math.floor(i / 8) * 32;
            this.drawTileByShape(rt, sourceKey, dx, dy, i);
        }

        rt.saveTexture(newKey);
    }

    private static drawTileByShape(rt: Phaser.GameObjects.RenderTexture, key: string, dx: number, dy: number, index: number) {
        // Use Shared Rules
        const n = TILE_LAYOUT_RULES.hasN(index);
        const s = TILE_LAYOUT_RULES.hasS(index);
        const w = TILE_LAYOUT_RULES.hasW(index);
        const e = TILE_LAYOUT_RULES.hasE(index);
        
        const ne = TILE_LAYOUT_RULES.hasNE(index);
        const se = TILE_LAYOUT_RULES.hasSE(index);
        const sw = TILE_LAYOUT_RULES.hasSW(index);
        const nw = TILE_LAYOUT_RULES.hasNW(index);
        
        this.drawQuad(rt, key, dx, dy, 'TL', n, w, nw);
        this.drawQuad(rt, key, dx+16, dy, 'TR', n, e, ne);
        this.drawQuad(rt, key, dx, dy+16, 'BL', s, w, sw);
        this.drawQuad(rt, key, dx+16, dy+16, 'BR', s, e, se);
    }
    
    private static drawQuad(rt: Phaser.GameObjects.RenderTexture, key: string, dx: number, dy: number, quad: string, vert: boolean, horiz: boolean, diag: boolean) {
        let src = this.SRC.CENTER; // Default

        // Logic: "If I have a Vertical Neighbor but No Horizontal, I am a Vertical Edge"
        if (!vert && !horiz) {
            // Outer Corner (Totally disconnected)
            if (quad === 'TL') src = this.SRC.TL_CORNER;
            if (quad === 'TR') src = this.SRC.TR_CORNER;
            if (quad === 'BL') src = this.SRC.BL_CORNER;
            if (quad === 'BR') src = this.SRC.BR_CORNER;
        } else if (!vert && horiz) {
            // Horizontal Edge
            if (quad === 'TL' || quad === 'TR') src = this.SRC.TOP_EDGE;
            if (quad === 'BL' || quad === 'BR') src = this.SRC.BOT_EDGE;
        } else if (vert && !horiz) {
            // Vertical Edge
            if (quad === 'TL' || quad === 'BL') src = this.SRC.LEFT_EDGE;
            if (quad === 'TR' || quad === 'BR') src = this.SRC.RIGHT_EDGE;
        } else {
            // Connected Orthogonally (vert & horiz true)
            if (!diag) {
                // Inner Corner! (Missing diagonal neighbor)
                src = this.SRC.INNER_CORNER;
            } else {
                // Full Center
                src = this.SRC.CENTER;
            }
        }

        // Offset Source for TR/BL/BR to grab correct half of the texture
        let sx = src.x;
        let sy = src.y;
        if (quad === 'TR' || quad === 'BR') sx += 1;
        if (quad === 'BL' || quad === 'BR') sy += 1;

        this.blit(rt, key, dx, dy, sx, sy);
    }

    private static blit(rt: Phaser.GameObjects.RenderTexture, key: string, dx: number, dy: number, sx: number, sy: number) {
        const MINI = 16;
        const frameName = `mini_${sx}_${sy}`;
        const texture = rt.scene.textures.get(key);

        // Add a 16x16 frame for this mini-tile if it doesn't exist yet
        if (!texture.has(frameName)) {
            texture.add(frameName, 0, sx * MINI, sy * MINI, MINI, MINI);
        }

        rt.drawFrame(key, frameName, dx, dy);
    }

    // --- HELPER: Defines the shape of the 47 tiles ---
    // These checks define the "Standard 47" layout.
    
    static hasN(i: number) { return ![0,1,2,3,4,5,6,7,8,9,10,11,12,13,32,33,34,35,42,46].includes(i); }
    static hasS(i: number) { return ![0,1,2,3,4,5,16,17,18,19,20,21,28,29,30,31,42,46].includes(i); }
    static hasW(i: number) { return ![0,1,6,7,8,9,12,13,16,17,20,21,24,25,28,29,43,46].includes(i); }
    static hasE(i: number) { return ![0,1,2,3,10,11,12,13,16,17,18,19,24,25,26,27,43,46].includes(i); }
}
