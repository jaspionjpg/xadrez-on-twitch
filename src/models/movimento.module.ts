export class Movimento {
    i: number;
    j: number;

    destinoI: number;
    destinoJ: number;

    capturar: boolean;

    constructor (i: number, j: number, destinoI: number, destinoJ: number, capturar: boolean = false) {
        this.i = i;
        this.j = j;
        this.destinoI = destinoI;
        this.destinoJ = destinoJ;
        this.capturar = capturar
    }
}