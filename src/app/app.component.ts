import { Component } from '@angular/core';
import { Celula } from 'src/models/celula.module';
import * as myGlobals from 'globals';
import { moveCursor } from 'readline';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'xadrez-on-twitch';
  tabuleiro: Celula[][];

  minhasPecas = "branco"

  constructor() {
    myGlobals.minhaCor = "branco"
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
    
    if (this.possiveisIr.filter(it => it[0] == i && it[1] == j).length > 0) {
      return this.moverPeca(this.pecaClicada, i, j);
    }

    this.sinalizarErro(i, j)
  }

  moverPeca(pecaClicada: number[], destinoI: number, destinoJ:number) {
    console.log("mover peca")
    this.tabuleiro[destinoI][destinoJ].peca = this.tabuleiro[pecaClicada[0]][pecaClicada[1]].peca
    this.tabuleiro[pecaClicada[0]][pecaClicada[1]].peca = null
  }

  sinalizarMovimentos(i: number, j: number) {
    this.pecaClicada = [i, j]

    if (this.tabuleiro[i][j].peca != null) {
      this.tabuleiro[i][j].clicada = true;
      this.possiveisIr = this.tabuleiro[i][j].peca.possiveisMovimentos(i, j, this.tabuleiro)
      console.log(this.possiveisIr)
      this.possiveisIr.forEach(lancePossivel => {
        this.tabuleiro[lancePossivel[0]][lancePossivel[1]].possivelIr = true;
      })
    }
  }

  limparAcoes() {
    this.tabuleiro[this.movimentoErrado[0]][this.movimentoErrado[1]].movimentoNaoPossivel = false;
    this.tabuleiro[this.pecaClicada[0]][this.pecaClicada[1]].clicada = false;
    this.possiveisIr.forEach(lancePossivel => {
      this.tabuleiro[lancePossivel[0]][lancePossivel[1]].possivelIr = false;
    })
  }

  sinalizarErro(i: number, j: number) {
    this.movimentoErrado = [i, j]
    this.tabuleiro[i][j].movimentoNaoPossivel = true
  }
}
