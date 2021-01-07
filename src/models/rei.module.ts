import { Celula } from './celula.module';
import { Peca } from './peca.module';

export class Rei extends Peca {

    constructor() {
        super()
        super.nomePeca = "rei";
    }
    
    possiveisMovimentos(tabuleiro: Celula[][]) {
        
    }
}