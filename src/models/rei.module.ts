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

        if (!this.seMoveu) {
            if(tabuleiro[i][0].peca != null && !tabuleiro[i][0].peca.seMoveu && tabuleiro[i][0].peca.nomePeca == "torre") {
                if(tabuleiro[i][3].peca == null && tabuleiro[i][2].peca == null && tabuleiro[i][1].peca == null) {
                    movimentosPossiveis.push(new Movimento(i, j, i, 2, false))
                }
            }
            
            if(tabuleiro[i][7].peca != null && !tabuleiro[i][7].peca.seMoveu && tabuleiro[i][7].peca.nomePeca == "torre") {
                if(tabuleiro[i][6].peca == null && tabuleiro[i][5].peca == null) {
                    movimentosPossiveis.push(new Movimento(i, j, i, 6, false))
                }
            }
        }
        return movimentosPossiveis
    }
}