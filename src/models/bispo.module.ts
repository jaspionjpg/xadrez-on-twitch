import { Celula } from './celula.module';
import { Peca } from './peca.module';

export class Bispo extends Peca {

    constructor(corPeca: string) {
        super("bispo", corPeca);
    }
    
    possiveisMovimentos(i: number, j: number, tabuleiro: Celula[][]): number[][] {
        let movimentosPossiveis = [];
        for(let incremento=1;super.possivel(i-incremento,j-incremento, tabuleiro);incremento++)
            movimentosPossiveis.push([i - incremento, j - incremento]);
		for(let incremento=1;super.possivel(i+incremento,j+incremento, tabuleiro);incremento++)
            movimentosPossiveis.push([i + incremento, j + incremento]);
		for(let incremento=1;super.possivel(i-incremento,j+incremento, tabuleiro);incremento++)
            movimentosPossiveis.push([i - incremento, j + incremento]);
        for(let incremento=1;super.possivel(i+incremento,j-incremento, tabuleiro);incremento++)
            movimentosPossiveis.push([i + incremento, j - incremento]);
        
        return movimentosPossiveis
    }
}