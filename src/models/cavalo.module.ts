import { Celula } from './celula.module';
import { Peca } from './peca.module';

export class Cavalo extends Peca {

    constructor(corPeca: string) {
        super("cavalo", corPeca);
    }
    
    possiveisMovimentos(tabuleiro: Celula[][]) {
        
    }
}