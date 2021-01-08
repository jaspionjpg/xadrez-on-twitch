import { Celula } from './celula.module';
import { Peca } from './peca.module';

export class Rei extends Peca {

    constructor(corPeca: string) {
        super("rei", corPeca);
    }
    
    possiveisMovimentos(tabuleiro: Celula[][]) {
        
    }
}