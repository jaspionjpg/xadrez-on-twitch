import { Celula } from './celula.module';
import { Peca } from './peca.module';

export class Peao extends Peca {

    constructor(corPeca: string) {
        super("peao", corPeca);
    }

    possiveisMovimentos(tabuleiro: Celula[][]) {
        
    }
}