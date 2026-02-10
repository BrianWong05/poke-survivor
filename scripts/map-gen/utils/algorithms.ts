
import { Point } from '../types.js';
import { randomInt } from './common.js';

// --- Blob Generation (Cellular Automata-ish) ---

export function generateBlob(
  groundTiles: number[][], 
  mapWidth: number, 
  mapHeight: number, 
  marker: number, 
  count: number, 
  minSize: number, 
  maxSize: number, 
  avoidMarkers: number[] = []
) {
  for (let i = 0; i < count; i++) {
    let cx = randomInt(mapWidth);
    let cy = randomInt(mapHeight);
    
    // Ensure start is valid
    if (avoidMarkers.includes(groundTiles[cy][cx])) continue;

    const size = minSize + randomInt(maxSize - minSize);
    const openList = [{x: cx, y: cy}];
    groundTiles[cy][cx] = marker;
    
    let currentSize = 1;
    while (currentSize < size && openList.length > 0) {
        const idx = randomInt(openList.length);
        const {x, y} = openList[idx];
        
        const moves = [
            {dx:0, dy:-1}, {dx:1, dy:0}, {dx:0, dy:1}, {dx:-1, dy:0}
        ];
        
        let grown = false;
        for (let k = moves.length - 1; k > 0; k--) {
            const r = Math.floor(Math.random() * (k + 1));
            [moves[k], moves[r]] = [moves[r], moves[k]];
        }

        for (const m of moves) {
            const nx = x + m.dx;
            const ny = y + m.dy;
            
            if (nx >= 0 && nx < mapWidth && ny >= 0 && ny < mapHeight) {
                if (groundTiles[ny][nx] !== marker && !avoidMarkers.includes(groundTiles[ny][nx])) {
                    groundTiles[ny][nx] = marker;
                    openList.push({x: nx, y: ny});
                    currentSize++;
                    grown = true;
                    break; 
                }
            }
        }
        
        if (!grown && Math.random() < 0.1) {
            openList.splice(idx, 1);
        }
    }
  }
}

// --- Smoothing (Cellular Automata) ---

export function smoothMap(
  groundTiles: number[][], 
  mapWidth: number, 
  mapHeight: number, 
  marker: number, 
  iterations: number, 
  revertTileIndex?: number
) {
  for (let i = 0; i < iterations; i++) {
      const newTiles = groundTiles.map(row => [...row]);
      for (let y = 1; y < mapHeight - 1; y++) {
          for (let x = 1; x < mapWidth - 1; x++) {
              let neighbors = 0;
              for (let dy = -1; dy <= 1; dy++) {
                  for (let dx = -1; dx <= 1; dx++) {
                      if (dx === 0 && dy === 0) continue;
                      if (groundTiles[y + dy][x + dx] === marker) {
                          neighbors++;
                      }
                  }
              }

              if (neighbors > 4) {
                  newTiles[y][x] = marker;
              } else if (neighbors < 4) {
                  if (newTiles[y][x] === marker && revertTileIndex !== undefined) {
                      newTiles[y][x] = revertTileIndex;
                  }
              }
          }
      }
      for(let y=0; y<mapHeight; y++) {
          for(let x=0; x<mapWidth; x++) {
              groundTiles[y][x] = newTiles[y][x];
          }
      }
  }
}

// --- BSP (Binary Space Partitioning) ---

export class BSPLeaf {
    x: number; y: number; width: number; height: number;
    leftChild?: BSPLeaf;
    rightChild?: BSPLeaf;
    
    constructor(x: number, y: number, width: number, height: number) {
        this.x = x; this.y = y; this.width = width; this.height = height;
    }

    get center() {
        return { x: Math.floor(this.x + this.width / 2), y: Math.floor(this.y + this.height / 2) };
    }

    split(minSize: number): boolean {
       if (this.leftChild || this.rightChild) return false;
       
       let splitH = Math.random() > 0.5;
       if (this.width > this.height && this.width / this.height >= 1.25) splitH = false;
       else if (this.height > this.width && this.height / this.width >= 1.25) splitH = true;

       const max = (splitH ? this.height : this.width) - minSize;
       if (max <= minSize) return false;

       const split = randomInt(max - minSize) + minSize;

       if (splitH) {
           this.leftChild = new BSPLeaf(this.x, this.y, this.width, split);
           this.rightChild = new BSPLeaf(this.x, this.y + split, this.width, this.height - split);
       } else {
           this.leftChild = new BSPLeaf(this.x, this.y, split, this.height);
           this.rightChild = new BSPLeaf(this.x + split, this.y, this.width - split, this.height);
       }
       return true;
    }
}

export function buildBSP(width: number, height: number, minLeafSize: number, maxLeafSize: number): BSPLeaf {
    const root = new BSPLeaf(0, 0, width, height);
    
    const queue = [root];
    while(queue.length > 0) {
        const l = queue.shift()!;
        if (l.width > maxLeafSize || l.height > maxLeafSize || Math.random() > 0.25) {
            if (l.split(minLeafSize)) {
                queue.push(l.leftChild!);
                queue.push(l.rightChild!);
            }
        }
    }
    return root;
}

// --- A* Pathfinding ---

interface Node { x: number, y: number, g: number, f: number, parent?: Node }

export function findPath(
  start: Point, 
  end: Point, 
  mapWidth: number, 
  mapHeight: number, 
  isBlocked: (x: number, y: number) => boolean,
  getCost: (x: number, y: number) => number
): Point[] | null {
  const openList: Node[] = [];
  const closedSet = new Set<string>();
  
  const startNode: Node = { x: start.x, y: start.y, g: 0, f: 0 };
  openList.push(startNode);
  
  let ops = 0;
  
  while(openList.length > 0 && ops < 20000) {
      ops++;
      openList.sort((a, b) => a.f - b.f);
      const current = openList.shift()!;
      
      if (Math.abs(current.x - end.x) < 2 && Math.abs(current.y - end.y) < 2) {
          const path: Point[] = [];
          let curr: Node | undefined = current;
          while(curr) {
              path.push({x: curr.x, y: curr.y});
              curr = curr.parent;
          }
          return path.reverse();
      }
      
      closedSet.add(`${current.x},${current.y}`);
      
      const neighbors = [
          {x: current.x, y: current.y - 1},
          {x: current.x + 1, y: current.y},
          {x: current.x, y: current.y + 1},
          {x: current.x - 1, y: current.y}
      ];
      
      for(const n of neighbors) {
          if (n.x < 0 || n.x >= mapWidth || n.y < 0 || n.y >= mapHeight) continue;
          if (closedSet.has(`${n.x},${n.y}`)) continue;
          
          if (isBlocked(n.x, n.y)) continue;
          
          const gScore = current.g + getCost(n.x, n.y); 
          const hScore = Math.abs(n.x - end.x) + Math.abs(n.y - end.y);
          const fScore = gScore + hScore;
          
          const existing = openList.find(node => node.x === n.x && node.y === n.y);
          if (existing) {
              if (gScore < existing.g) {
                  existing.g = gScore;
                  existing.f = fScore;
                  existing.parent = current;
              }
          } else {
              openList.push({ x: n.x, y: n.y, g: gScore, f: fScore, parent: current });
          }
      }
  }
  return null;
}

// --- Random Walk (Dirt Patches) ---

export function generateRandomWalk(
  groundTiles: number[][],
  mapWidth: number,
  mapHeight: number,
  marker: number,
  count: number,
  minSize: number,
  maxSize: number,
  avoidMarkers: number[] = []
) {
  for (let i = 0; i < count; i++) {
    let x = randomInt(mapWidth);
    let y = randomInt(mapHeight);
    const size = minSize + randomInt(maxSize - minSize); 
    
    // Find valid start
    let attempts = 0;
    // Check if start is valid
    while (attempts < 50 && avoidMarkers.includes(groundTiles[y][x])) {
        x = randomInt(mapWidth);
        y = randomInt(mapHeight);
        attempts++;
    }

    if (avoidMarkers.includes(groundTiles[y][x])) continue;

    for (let j = 0; j < size; j++) {
      if (x >= 0 && x < mapWidth && y >= 0 && y < mapHeight) {
        if (!avoidMarkers.includes(groundTiles[y][x])) {
            groundTiles[y][x] = marker;
        }
      }
      x += randomInt(3) - 1;
      y += randomInt(3) - 1;
      x = Math.max(0, Math.min(mapWidth - 1, x));
      y = Math.max(0, Math.min(mapHeight - 1, y));
    }
  }
}
