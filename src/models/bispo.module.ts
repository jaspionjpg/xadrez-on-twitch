import { Celula } from './celula.module';
import { Peca } from './peca.module';

export class Bispo extends Peca {

    constructor(corPeca: string) {
        super("bispo", corPeca);
    }
    
    possiveisMovimentos(tabuleiro: Celula[][]) {
        
    }
}