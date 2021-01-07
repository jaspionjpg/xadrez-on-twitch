import { Celula } from './celula.module';
import { Peca } from './peca.module';

export class Torre extends Peca {

    constructor(corPeca: string) {
        super("torre", corPeca);
    }
    
    possiveisMovimentos(tabuleiro: Celula[][]) {
        
    }
}