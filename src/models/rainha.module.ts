import { Celula } from './celula.module';
import { Peca } from './peca.module';

export class Rainha extends Peca {

    constructor() {
        super()
        super.nomePeca = "rainha";
    }
    
    possiveisMovimentos(tabuleiro: Celula[][]) {
        
    }
}