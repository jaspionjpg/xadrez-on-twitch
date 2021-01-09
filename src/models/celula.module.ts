import { Bispo } from './bispo.module';
import { Cavalo } from './cavalo.module';
import { Peao } from './peao.module';
import { Peca } from './peca.module';
import { Rainha } from './rainha.module';
import { Rei } from './rei.module';
import { Torre } from './torre.module';

var letras = new Map();
letras.set(0, "A")
letras.set(1, "B")
letras.set(2, "C")
letras.set(3, "D")
letras.set(4, "E")
letras.set(5, "F")
letras.set(6, "G")
letras.set(7, "H")

var linhas = new Map();
linhas.set("A", 0)
linhas.set("B", 1)
linhas.set("C", 2)
linhas.set("D", 3)
linhas.set("E", 4)
linhas.set("F", 5)
linhas.set("G", 6)
linhas.set("H", 7)

var pecasInicias = new Map();
pecasInicias.set("00", new Torre("preto"))
pecasInicias.set("01", new Cavalo("preto"));
pecasInicias.set("02", new Bispo("preto"));
pecasInicias.set("03", new Rainha("preto"));
pecasInicias.set("04", new Rei("preto"));
pecasInicias.set("05", new Bispo("preto"));
pecasInicias.set("06", new Cavalo("preto"));
pecasInicias.set("07", new Torre("preto"));
pecasInicias.set("70", new Torre("branco"));
pecasInicias.set("71", new Cavalo("branco"));
pecasInicias.set("72", new Bispo("branco"));
pecasInicias.set("73", new Rainha("branco"));
pecasInicias.set("74", new Rei("branco"));
pecasInicias.set("75", new Bispo("branco"));
pecasInicias.set("76", new Cavalo("branco"));
pecasInicias.set("77", new Torre("branco"));
pecasInicias.set("10", new Peao("preto"));
pecasInicias.set("11", new Peao("preto"));
pecasInicias.set("12", new Peao("preto"));
pecasInicias.set("13", new Peao("preto"));
pecasInicias.set("14", new Peao("preto"));
pecasInicias.set("15", new Peao("preto"));
pecasInicias.set("16", new Peao("preto"));
pecasInicias.set("17", new Peao("preto"));
pecasInicias.set("60", new Peao("branco"));
pecasInicias.set("61", new Peao("branco"));
pecasInicias.set("62", new Peao("branco"));
pecasInicias.set("63", new Peao("branco"));
pecasInicias.set("64", new Peao("branco"));
pecasInicias.set("65", new Peao("branco"));
pecasInicias.set("66", new Peao("branco"));
pecasInicias.set("67", new Peao("branco"));

export class Celula {
    public corPreta: boolean; 
    public letra: string;

    public linha: number;
    public coluna: number;

    public peca: Peca = null;

    public possivelIr: boolean = false;
    public movimentoNaoPossivel: boolean = false;
    public clicada: boolean = false;

    constructor(linha:number, coluna:number, iniciarComPeca: boolean =  false) {
        this.linha = linha;
        this.coluna = coluna;

        this.corPreta = (linha % 2 == 0 && coluna % 2 != 0) 
            || (linha % 2 != 0 && coluna % 2 == 0);

        this.letra = letras.get(coluna)

        if (iniciarComPeca && pecasInicias.has(linha+""+coluna)) {
            this.peca = pecasInicias.get(linha+""+coluna);
        }
    }

    static pegarLinha(letra: string){
        return linhas.get(letra.toUpperCase())
    }
}