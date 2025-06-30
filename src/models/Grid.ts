type CellState = 'empty' | 'boat' | 'hit'  ;

export interface Boat {
  id: number;
  positions: Array<{ row: number; col: number }>;
  hits: number;
  sunk: boolean;
}

export interface Grid {
  size: number;
  cells: CellState[][];
  boatSizes: number;
  boatNumber: number;
  placedBoats: Boat[];
}

export class BattleshipGrid {
  private grid: Grid;

  constructor(gridSize: number, boatSizes: number, boatNumber: number) {
    const totalSpace = gridSize * gridSize;
    const maxRequiredSpace = boatSizes * boatNumber;

    if (maxRequiredSpace > totalSpace) {
      throw new Error("Spazio insufficiente per posizionare tutte le barche.");
    }

    this.grid = {
      size: gridSize,
      cells: Array(gridSize).fill(null).map(() => Array(gridSize).fill('empty')),
      boatSizes,
      boatNumber,
      placedBoats: [],
    };

    this.placeBoats();
  }

  private placeBoats(): void {
    let boatIndex = 0;
/*let attempts = 0;
const maxAttempts = 1000;

while (boatIndex < this.grid.boatNumber && attempts < maxAttempts) {
  attempts++;
  // ...
}

if (attempts === maxAttempts) {
  throw new Error("Impossibile posizionare tutte le barche dopo molti tentativi.");
}

*/
    while (boatIndex < this.grid.boatNumber) {
      const x = Math.floor(Math.random() * this.grid.size);
      const y = Math.floor(Math.random() * (this.grid.size - this.grid.boatSizes + 1));

      if (this.canPlaceBoat(x, y)) {
        const boatPosition: Array<{ row: number; col: number }> = [];

        for (let i = 0; i < this.grid.boatSizes; i++) {
          this.grid.cells[x][y + i] = 'boat';
          boatPosition.push({ row: x, col: y + i });
        }

        this.grid.placedBoats.push({
          id: boatIndex,
          positions: boatPosition,
          hits:0,
          sunk:false
        });

        boatIndex++;
      }
    }
  }

  private canPlaceBoat(x: number, y: number): boolean {
    for (let j = 0; j < this.grid.boatSizes; j++) {
      if (this.grid.cells[x][y + j] !== 'empty') {
        return false;
      }
    }
    return true;
  }

  public getGrid(): Grid {
    return this.grid;
  }
}

