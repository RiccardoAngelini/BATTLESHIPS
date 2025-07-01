"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BattleshipGrid = void 0;
// Classe che genera e gestisce la griglia di battaglia navale
class BattleshipGrid {
    constructor(gridSize, boatSizes, boatNumber) {
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
    placeBoats() {
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
                const boatPosition = [];
                for (let i = 0; i < this.grid.boatSizes; i++) {
                    this.grid.cells[x][y + i] = 'boat';
                    boatPosition.push({ row: x, col: y + i });
                }
                this.grid.placedBoats.push({
                    id: boatIndex,
                    positions: boatPosition,
                    hits: 0,
                    sunk: false
                });
                boatIndex++;
            }
        }
    }
    //Controlla se la barca di lunghezza boatSizes può essere posizionata a partire da (x,y)
    canPlaceBoat(x, y) {
        for (let j = 0; j < this.grid.boatSizes; j++) {
            if (this.grid.cells[x][y + j] !== 'empty') {
                return false;
            }
        }
        return true;
    }
    getGrid() {
        return this.grid;
    }
}
exports.BattleshipGrid = BattleshipGrid;
