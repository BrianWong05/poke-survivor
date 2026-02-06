import Phaser from 'phaser';
import { TileAnimator } from '@/game/utils/TileAnimator';
import { TILE_ANIMATIONS } from '@/game/config/TileAnimations';
import type { CustomMapData, TileData } from '@/game/types/map';

export class MapManager {
  private scene: Phaser.Scene;
  private phaserLayers: Phaser.Tilemaps.TilemapLayer[] = [];
  private collisionLayers: Phaser.Tilemaps.TilemapLayer[] = [];
  private tileAnimator: TileAnimator;
  private readonly MAP_WIDTH = 3200;
  private readonly MAP_HEIGHT = 3200;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.tileAnimator = new TileAnimator();
  }

  public create(data?: CustomMapData): void {
    if (data) {
      this.createCustomMap(data);
    } else {
      this.createDefaultMap();
    }
  }

  public update(delta: number): void {
    for (const layer of this.phaserLayers) {
      this.tileAnimator.update(delta, layer);
    }
  }

  public getObjectsLayer(): Phaser.Tilemaps.TilemapLayer | undefined {
    // Return the first collision layer for backward compatibility
    return this.collisionLayers[0];
  }

  public getCollisionLayers(): Phaser.Tilemaps.TilemapLayer[] {
    return this.collisionLayers;
  }

  private createDefaultMap(): void {
    if (!this.scene.textures.exists('grid_bg')) {
      const graphics = this.scene.add.graphics();
      graphics.fillStyle(0x228b22);
      graphics.fillRect(0, 0, 64, 64);
      graphics.lineStyle(2, 0x006400);
      graphics.strokeRect(0, 0, 64, 64);
      graphics.generateTexture('grid_bg', 64, 64);
      graphics.destroy();
    }

    this.scene.add.tileSprite(
      this.MAP_WIDTH / 2,
      this.MAP_HEIGHT / 2,
      this.MAP_WIDTH,
      this.MAP_HEIGHT,
      'grid_bg'
    );

    this.scene.physics.world.setBounds(0, 0, this.MAP_WIDTH, this.MAP_HEIGHT);
  }

  private createCustomMap(data: CustomMapData): void {
    const { width, height, tileSize } = data;
    const mapWidthPixels = width * tileSize;
    const mapHeightPixels = height * tileSize;

    this.scene.physics.world.setBounds(0, 0, mapWidthPixels, mapHeightPixels);

    const map = this.scene.make.tilemap({
      tileWidth: tileSize,
      tileHeight: tileSize,
      width,
      height
    });

    const usedTilesets = this.collectTilesets(data);
    const { tilesetObjects, tilesetGidMap } = this.setupTilesets(map, usedTilesets);

    if (tilesetObjects.length === 0) {
      this.createDefaultMap();
      return;
    }

    this.setupTileAnimations(tilesetGidMap);

    if (data.layers && data.layers.length > 0) {
      // New multi-layer format
      this.populateFromLayers(data, map, tilesetObjects, tilesetGidMap);
    } else {
      // Legacy two-layer format
      this.populateLegacyLayers(data, map, tilesetObjects, tilesetGidMap);
    }
  }

  private collectTilesets(data: CustomMapData): Set<string> {
    const usedTilesets = new Set<string>();
    if (data.palette) {
      data.palette.forEach(p => usedTilesets.add(p.set));
    } else {
      const scanLayer = (layer: (number | TileData)[][]) => {
        layer.forEach(row => row.forEach(cell => {
          if (typeof cell !== 'number' && cell.set) {
            usedTilesets.add(cell.set);
          }
        }));
      };
      scanLayer(data.ground);
      scanLayer(data.objects);
      if (usedTilesets.size === 0) usedTilesets.add('Outside.png');
    }
    return usedTilesets;
  }

  private setupTilesets(map: Phaser.Tilemaps.Tilemap, usedTilesets: Set<string>) {
    const tilesetObjects: Phaser.Tilemaps.Tileset[] = [];
    const tilesetGidMap = new Map<string, number>();
    let currentGidOffset = 1;

    usedTilesets.forEach(filename => {
      const tileset = map.addTilesetImage(filename, filename, undefined, undefined, undefined, undefined, currentGidOffset);
      if (tileset) {
        tilesetObjects.push(tileset);
        tilesetGidMap.set(filename, tileset.firstgid);
        currentGidOffset += tileset.total;
      }
    });

    return { tilesetObjects, tilesetGidMap };
  }

  private setupTileAnimations(tilesetGidMap: Map<string, number>): void {
    TILE_ANIMATIONS.forEach(anim => {
      const firstGid = tilesetGidMap.get(anim.tileset);
      if (firstGid !== undefined) {
        this.tileAnimator.addAnimation(anim.tileset, firstGid + anim.startId, anim.frameCount, anim.duration);
      }
    });
  }

  private resolveGid(cell: number | TileData, palette: TileData[] | undefined, tilesetGidMap: Map<string, number>): number {
    if (typeof cell === 'number' && cell === -1) return -1;
    if (typeof cell !== 'number' && cell.id === -1) return -1;

    let set: string = 'Outside.png';
    let localId: number = 0;

    if (palette && typeof cell === 'number') {
      const p = palette[cell];
      if (!p) return -1;
      set = p.set;
      localId = p.id;
    } else if (typeof cell !== 'number') {
      set = cell.set;
      localId = cell.id;
    } else {
      localId = cell;
    }

    const firstGid = tilesetGidMap.get(set);
    return firstGid !== undefined ? firstGid + localId : -1;
  }

  private populateFromLayers(
    data: CustomMapData,
    map: Phaser.Tilemaps.Tilemap,
    tilesetObjects: Phaser.Tilemaps.Tileset[],
    tilesetGidMap: Map<string, number>
  ): void {
    const { width, height } = data;

    data.layers!.forEach((serializedLayer, index) => {
      const phaserLayer = map.createBlankLayer(serializedLayer.name, tilesetObjects);
      if (!phaserLayer) return;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const gid = this.resolveGid(serializedLayer.tiles[y][x], data.palette, tilesetGidMap);
          if (gid !== -1) phaserLayer.putTileAt(gid, x, y);
        }
      }

      // Depth: first layer is -10, subsequent layers increment by 1
      phaserLayer.setDepth(-10 + index);

      this.phaserLayers.push(phaserLayer);

      if (serializedLayer.collision) {
        phaserLayer.setCollisionByExclusion([-1]);
        this.collisionLayers.push(phaserLayer);
      }
    });
  }

  private populateLegacyLayers(
    data: CustomMapData,
    map: Phaser.Tilemaps.Tilemap,
    tilesetObjects: Phaser.Tilemaps.Tileset[],
    tilesetGidMap: Map<string, number>
  ): void {
    const { width, height, ground, objects } = data;

    const groundLayer = map.createBlankLayer('Ground', tilesetObjects) || undefined;
    const objectsLayer = map.createBlankLayer('Objects', tilesetObjects) || undefined;

    if (groundLayer) {
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const gid = this.resolveGid(ground[y][x], data.palette, tilesetGidMap);
          if (gid !== -1) groundLayer.putTileAt(gid, x, y);
        }
      }
      groundLayer.setDepth(-10);
      this.phaserLayers.push(groundLayer);
    }

    if (objectsLayer) {
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const gid = this.resolveGid(objects[y][x], data.palette, tilesetGidMap);
          if (gid !== -1) objectsLayer.putTileAt(gid, x, y);
        }
      }
      objectsLayer.setDepth(0);
      objectsLayer.setCollisionByExclusion([-1]);
      this.phaserLayers.push(objectsLayer);
      this.collisionLayers.push(objectsLayer);
    }
  }
}
