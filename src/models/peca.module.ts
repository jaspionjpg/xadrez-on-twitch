import { Celula } from './celula.module';

export abstract class Peca {
    nomePeca: string;
    corPeca: string;

    constructor(nomePeca: string, corPeca: string) {
        this.nomePeca = nomePeca;
        this.corPeca = corPeca;
    }

    abstract possiveisMovimentos(tabuleiro: Celula[][]);

    possivel() {
    }
}