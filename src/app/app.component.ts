import { Component } from '@angular/core';
import { Celula } from 'src/models/celula.module';
import * as myGlobals from 'globals';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'xadrez-on-twitch';
  tabuleiro: Celula[][];

  minhasPecas = "branco"

  posicaoReiPreto = [0, 4]
  posicaoReiBranco = [7, 4]

  constructor() {
    myGlobals.minhaCor = this.minhasPecas
    this.tabuleiro = this.criarTabuleiro();
  }

  criarTabuleiro(): Celula[][] {
    let tabuleiro = [];
    for (let i = 0; i < 8; i++) {
      tabuleiro[i] = [];
      for (let j = 0; j < 8; j++) {
        tabuleiro[i][j] = new Celula(i, j, true);
      }
    }
    return tabuleiro;
  }

  pecaClicada = [0, 0]
  possiveisIr = []
  movimentoErrado = [0, 0]

  clicarCelula(i: number, j: number) {
    this.limparAcoes()

    if (this.tabuleiro[i][j].peca != null && this.minhasPecas == this.tabuleiro[i][j].peca.corPeca) {
      return this.sinalizarMovimentos(i, j)
    }
    
    if (this.possiveisIr.filter(it => it.destinoI == i && it.destinoJ == j).length > 0) {
      return this.moverPeca(this.pecaClicada, i, j);
    }

    this.sinalizarErro(i, j)
  }

  moverPeca(pecaClicada: number[], destinoI: number, destinoJ: number) {
    let pecaAnteriorNoDestino = this.tabuleiro[destinoI][destinoJ].peca;

    this.tabuleiro[destinoI][destinoJ].peca = this.tabuleiro[pecaClicada[0]][pecaClicada[1]].peca
    this.tabuleiro[pecaClicada[0]][pecaClicada[1]].peca = null
    console.log(this.tabuleiro[destinoI][destinoJ].peca)

    if (this.tabuleiro[destinoI][destinoJ].peca.nomePeca == "rei") {
      this.posicaoReiBranco = [destinoI, destinoJ]
    }

    if(this.verificarSeReiNaoEstaEmCheque()) {
      console.log("rei cagado")
      this.tabuleiro[pecaClicada[0]][pecaClicada[1]].peca = this.tabuleiro[destinoI][destinoJ].peca
      this.tabuleiro[destinoI][destinoJ].peca = pecaAnteriorNoDestino
    } 
  }

  verificarSeReiNaoEstaEmCheque() {
    let rei = this.pegarMeuRei()
    for (let x = 0; x < this.tabuleiro.length; x++) {
      let linha = this.tabuleiro[x];
      for (let y = 0; y < linha.length; y++) {
        let celula = linha[y];

        if (celula.peca != null && celula.peca.corPeca != this.minhasPecas) {
          let pecasAAtacar = celula.peca.possiveisMovimentos(x, y, this.tabuleiro).filter(it => {
            return it.destinoI == rei[0] && it.destinoJ == rei[1] && it.capturar
          })

          if (pecasAAtacar.length > 0) {
            pecasAAtacar.forEach(it => {
              this.sinalizarErro(rei[0], rei[1])
              this.sinalizarErro(x, y)
            })
            return true
          }
        }
      }
    }
    return false
  }

  pegarMeuRei() {
    if(this.minhasPecas == "branco") {
      return this.posicaoReiBranco;
    } else {
      return this.posicaoReiPreto;
    }
  }

  sinalizarMovimentos(i: number, j: number) {
    this.pecaClicada = [i, j]

    if (this.tabuleiro[i][j].peca != null) {
      this.tabuleiro[i][j].clicada = true;
      this.possiveisIr = this.tabuleiro[i][j].peca.possiveisMovimentos(i, j, this.tabuleiro)
      this.possiveisIr.forEach(lancePossivel => {
        this.tabuleiro[lancePossivel.destinoI][lancePossivel.destinoJ].possivelIr = true;
      })
    }
  }

  limparAcoes() {
    this.tabuleiro[this.movimentoErrado[0]][this.movimentoErrado[1]].movimentoNaoPossivel = false;
    this.tabuleiro[this.pecaClicada[0]][this.pecaClicada[1]].clicada = false;
    this.possiveisIr.forEach(lancePossivel => {
      this.tabuleiro[lancePossivel.destinoI][lancePossivel.destinoJ].possivelIr = false;
    })
  }

  sinalizarErro(i: number, j: number) {
    this.movimentoErrado = [i, j]
    this.tabuleiro[i][j].movimentoNaoPossivel = true
  }
}
