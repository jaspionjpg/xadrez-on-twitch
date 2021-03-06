import { Celula } from './celula.module';
import { Movimento } from './movimento.module';
import { Peca } from './peca.module';

export class Peao extends Peca {

    constructor(corPeca: string) {
        super("peao", corPeca);
    }

    possiveisMovimentos(i: number, j: number, tabuleiro: Celula[][]): Movimento[] {
        let movimentosPossiveis = [];
        let somarXTabuleiro = this.corPeca == "branco" ? -1 : 1

        if (super.dentroTabuleiro(i  + somarXTabuleiro, j) && tabuleiro[i + somarXTabuleiro][j].peca == null) {
            movimentosPossiveis.push(new Movimento(i, j, i + somarXTabuleiro, j));
            if (((i == 1 && this.corPeca == "preto") || (i == 6 && this.corPeca == "branco")) 
                && tabuleiro[i + somarXTabuleiro * 2][j].peca == null) {
                movimentosPossiveis.push(new Movimento(i, j, i + somarXTabuleiro * 2, j));
            }
        }
        
        if (super.dentroTabuleiro(i  + somarXTabuleiro, j-1) && tabuleiro[i + somarXTabuleiro][j-1].peca != null)
            movimentosPossiveis.push(new Movimento(i, j, i + somarXTabuleiro, j - 1, true));
            
        if (super.dentroTabuleiro(i  + somarXTabuleiro, j+1) && tabuleiro[i + somarXTabuleiro][j+1].peca != null)
            movimentosPossiveis.push(new Movimento(i, j, i + somarXTabuleiro, j + 1, true));

        return movimentosPossiveis;
    }
}