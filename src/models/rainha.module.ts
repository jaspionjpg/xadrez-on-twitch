import { Celula } from './celula.module';
import { Movimento } from './movimento.module';
import { Peca } from './peca.module';

export class Rainha extends Peca {

    constructor(corPeca: string) {
        super("rainha", corPeca);
    }
    
    possiveisMovimentos(i: number, j: number, tabuleiro: Celula[][]): Movimento[] {
        let movimentosPossiveis = [];
        movimentosPossiveis = movimentosPossiveis.concat(super.possiveisAoLado(i,j, tabuleiro, -1, -1));
        movimentosPossiveis = movimentosPossiveis.concat(super.possiveisAoLado(i,j, tabuleiro, +1, +1));
        movimentosPossiveis = movimentosPossiveis.concat(super.possiveisAoLado(i,j, tabuleiro, -1, +1));
        movimentosPossiveis = movimentosPossiveis.concat(super.possiveisAoLado(i,j, tabuleiro, +1, -1));
    
        movimentosPossiveis = movimentosPossiveis.concat(super.possiveisAoLado(i,j, tabuleiro, +1, 0));
        movimentosPossiveis = movimentosPossiveis.concat(super.possiveisAoLado(i,j, tabuleiro, -1, 0));
        movimentosPossiveis = movimentosPossiveis.concat(super.possiveisAoLado(i,j, tabuleiro, 0, +1));
        movimentosPossiveis = movimentosPossiveis.concat(super.possiveisAoLado(i,j, tabuleiro, 0, -1));
        return movimentosPossiveis
    }
}