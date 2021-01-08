import { Celula } from './celula.module';
import { Peca } from './peca.module';

export class Cavalo extends Peca {

    constructor(corPeca: string) {
        super("cavalo", corPeca);
    }

    possiveisMovimentos(i: number, j: number, tabuleiro: Celula[][]): number[][] {
        let possiveisMovimentosCavalo = [[i-1,j-2], [i+1,j+2], [i+1,j-2], [i-1,j+2], [i-2,j-1], [i+2,j+1], [i+2,j-1], [i-2,j+1]];
        return possiveisMovimentosCavalo.filter(it => super.possivel(it[0], it[1], tabuleiro))
    }
}