import { Celula } from './celula.module';
import * as myGlobals from 'globals';

export abstract class Peca {
    nomePeca: string;
    corPeca: string;

    constructor(nomePeca: string, corPeca: string) {
        this.nomePeca = nomePeca;
        this.corPeca = corPeca;
    }

    abstract possiveisMovimentos(i: number, j: number, tabuleiro: Celula[][]): number[][];

    
    possivel(i: number, j: number, tabuleiro: Celula[][]) {
        if (this.dentroTabuleiro(i, j)
            && !(tabuleiro[i][j].peca?.corPeca == myGlobals.minhaCor)){
            return true;
		} else {
			return false;
		}
    }

    dentroTabuleiro(i: number, j: number) : boolean  {
        return i >= 0 && i <8 && j >= 0 && j < 8;
    }
}