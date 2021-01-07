import { Component } from '@angular/core';
import { Celula } from 'src/models/celula.module';

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

  
}
