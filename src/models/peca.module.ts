import { Celula } from './celula.module';
import * as myGlobals from 'globals';
import { Movimento } from './movimento.module';

export abstract class Peca {
    nomePeca: string;
    corPeca: string;

    constructor(nomePeca: string, corPeca: string) {
        this.nomePeca = nomePeca;
        this.corPeca = corPeca;
    }

    abstract possiveisMovimentos(i: number, j: number, tabuleiro: Celula[][]): Movimento[];

    possiveisAoLado(i: number, j: number, tabuleiro: Celula[][], incrementoI: number, incrementoJ:number) : Movimento[] {
        let movimentosPossiveis = [];

        for (let incremento=1; this.possivel(i+incremento * incrementoI, j+incremento *incrementoJ, tabuleiro); incremento++) {
            movimentosPossiveis.push(new Movimento(i, j, i + incremento * incrementoI, j + incremento * incrementoJ, tabuleiro[i + incremento * incrementoI][j + incremento * incrementoJ].peca != null));
            if (tabuleiro[i+ incremento * incrementoI][j + incremento * incrementoJ].peca != null){ 
                break;
            }
        }

        return movimentosPossiveis;
    }
    
    possivel(i: number, j: number, tabuleiro: Celula[][]) : boolean {
        if (this.dentroTabuleiro(i, j)
            && (tabuleiro[i][j].peca == null || tabuleiro[i][j].peca.corPeca != this.corPeca)){
            return true;
		} else {
			return false;
		}
    }

    dentroTabuleiro(i: number, j: number) : boolean  {
        return i >= 0 && i <8 && j >= 0 && j < 8;
    }
}