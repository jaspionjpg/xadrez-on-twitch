import { Celula } from './celula.module';
import { Peca } from './peca.module';

export class Rainha extends Peca {

    constructor(corPeca: string) {
        super("rainha", corPeca);
    }
    
    possiveisMovimentos(tabuleiro: Celula[][]) {
        
    }
}