// Tipi per lo stato di ogni cella della griglia
type CellState = 'empty' | 'boat' | 'hit'  ;
// Rappresenta una singola barca con posizioni, colpi subiti e stato affondato
export interface Boat {
  id: number;
  positions: Array<{ row: number; col: number }>;
  hits: number;
  sunk: boolean;
}
// Definizione della griglia di gioco
export interface Grid {
  size: number;
  cells: CellState[][];
  boatSizes: number;
  boatNumber: number;
  placedBoats: Boat[];
}
// Classe che genera e gestisce la griglia di battaglia navale
export class BattleshipGrid {
  private grid: Grid;

  constructor(gridSize: number, boatSizes: number, boatNumber: number) {
    const totalSpace = gridSize * gridSize;
    const maxRequiredSpace = boatSizes * boatNumber;

    if (maxRequiredSpace > totalSpace) {
      throw new Error("Spazio insufficiente per posizionare tutte le barche.");
    }
// Inizializza la griglia vuota
    this.grid = {
      size: gridSize,
      cells: Array(gridSize).fill(null).map(() => Array(gridSize).fill('empty')),
      boatSizes,
      boatNumber,
      placedBoats: [],
    };

    this.placeBoats();
  }
//Posiziona tutte le barche in modo orizzontale, evitando sovrapposizioni
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
   // Se nello spazio selezionato non ci sono altre barche, posiziona
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
//Controlla se la barca di lunghezza boatSizes può essere posizionata a partire da (x,y)
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

