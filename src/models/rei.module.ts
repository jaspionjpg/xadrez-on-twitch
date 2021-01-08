import { Celula } from './celula.module';
import { Movimento } from './movimento.module';
import { Peca } from './peca.module';

export class Rei extends Peca {

    constructor(corPeca: string) {
        super("rei", corPeca);
    }
    
    possiveisMovimentos(i: number, j: number, tabuleiro: Celula[][]): Movimento[] {
        let movimentosPossiveis = [];
        if (super.possivel(i - 1, j - 1, tabuleiro)) 
            movimentosPossiveis.push(new Movimento(i, j, i - 1, j - 1, tabuleiro[i -1][j-1].peca != null))
        if (super.possivel(i + 1, j + 1, tabuleiro)) 
            movimentosPossiveis.push(new Movimento(i, j, i + 1, j + 1, tabuleiro[i +1][j+1].peca != null))
        if (super.possivel(i - 1, j + 1, tabuleiro)) 
            movimentosPossiveis.push(new Movimento(i, j, i - 1, j + 1, tabuleiro[i -1][j+1].peca != null))
        if (super.possivel(i + 1, j - 1, tabuleiro)) 
            movimentosPossiveis.push(new Movimento(i, j, i + 1, j - 1, tabuleiro[i +1][j-1].peca != null))
        if (super.possivel(i + 1, j, tabuleiro)) 
            movimentosPossiveis.push(new Movimento(i, j, i + 1, j, tabuleiro[i +1][j].peca != null))
        if (super.possivel(i - 1, j, tabuleiro)) 
            movimentosPossiveis.push(new Movimento(i, j, i - 1, j, tabuleiro[i -1][j].peca != null))
        if (super.possivel(i, j + 1, tabuleiro)) 
            movimentosPossiveis.push(new Movimento(i, j, i, j + 1, tabuleiro[i][j + 1].peca != null))
        if (super.possivel(i, j - 1, tabuleiro)) 
            movimentosPossiveis.push(new Movimento(i, j, i, j - 1, tabuleiro[i][j - 1].peca != null))
        return movimentosPossiveis
    }
}