export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Tile {
  id: number;
  value: number;
  position: [number, number];
}

export function initializeGame(): Tile[] {
  const tiles: Tile[] = [];
  addRandomTile(tiles);
  addRandomTile(tiles);
  return tiles;
}

export function addRandomTile(tiles: Tile[]): void {
  const emptyPositions: [number, number][] = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (!tiles.some(tile => tile.position[0] === i && tile.position[1] === j)) {
        emptyPositions.push([i, j]);
      }
    }
  }

  if (emptyPositions.length > 0) {
    const [row, col] = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
    tiles.push({
      id: Math.random(),
      value: Math.random() < 0.9 ? 2 : 4,
      position: [row, col],
    });
  }
}

export function moveTiles(tiles: Tile[], direction: Direction): { newTiles: Tile[], score: number } {
  let score = 0;
  const newTiles: Tile[] = JSON.parse(JSON.stringify(tiles));

  const sortedTiles = newTiles.sort((a, b) => {
    if (direction === 'up' || direction === 'down') {
      return direction === 'up' ? a.position[0] - b.position[0] : b.position[0] - a.position[0];
    } else {
      return direction === 'left' ? a.position[1] - b.position[1] : b.position[1] - a.position[1];
    }
  });

  for (let i = 0; i < sortedTiles.length; i++) {
    const tile = sortedTiles[i];
    let [row, col] = tile.position;

    while (true) {
      let newRow = row;
      let newCol = col;

      if (direction === 'up' && row > 0) newRow--;
      if (direction === 'down' && row < 3) newRow++;
      if (direction === 'left' && col > 0) newCol--;
      if (direction === 'right' && col < 3) newCol++;

      if (newRow === row && newCol === col) break;

      const targetTile = newTiles.find(t => t.position[0] === newRow && t.position[1] === newCol);

      if (targetTile) {
        if (targetTile.value === tile.value) {
          targetTile.value *= 2;
          score += targetTile.value;
          newTiles.splice(newTiles.indexOf(tile), 1);
        }
        break;
      }

      row = newRow;
      col = newCol;
    }

    tile.position = [row, col];
  }

  return { newTiles, score };
}

export function isGameOver(tiles: Tile[]): boolean {
  if (tiles.length < 16) return false;

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const currentTile = tiles.find(tile => tile.position[0] === i && tile.position[1] === j);
      if (currentTile) {
        const adjacentPositions = [
          [i - 1, j],
          [i + 1, j],
          [i, j - 1],
          [i, j + 1],
        ];

        for (const [adjRow, adjCol] of adjacentPositions) {
          if (adjRow >= 0 && adjRow < 4 && adjCol >= 0 && adjCol < 4) {
            const adjacentTile = tiles.find(tile => tile.position[0] === adjRow && tile.position[1] === adjCol);
            if (adjacentTile && adjacentTile.value === currentTile.value) {
              return false;
            }
          }
        }
      }
    }
  }

  return true;
}

