import { Component } from '@angular/core';
import { Celula } from 'src/models/celula.module';
import * as myGlobals from 'globals';
import { Rainha } from 'src/models/rainha.module';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Bispo } from 'src/models/bispo.module';
import { Cavalo } from 'src/models/cavalo.module';
import { Torre } from 'src/models/torre.module';

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

  closeResult = '';
  
  constructor(private modalService: NgbModal, config: NgbModalConfig) {
    config.backdrop = 'static';
    config.keyboard = false;
    
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
  movimentosErrados = []

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

    if(this.verificarMate()) {

    }

    if (this.tabuleiro[destinoI][destinoJ].peca?.nomePeca == "peao" && (destinoI == 0 || destinoI == 7)) {
      this.modalService.open(NgbdModalEscolherPeca)
        .result.then((result) => {
          if  (result == "bispo") 
            this.tabuleiro[destinoI][destinoJ].peca = new Bispo(this.tabuleiro[destinoI][destinoJ].peca.corPeca)
          if  (result == "rainha") 
            this.tabuleiro[destinoI][destinoJ].peca = new Rainha(this.tabuleiro[destinoI][destinoJ].peca.corPeca)
          if  (result == "cavalo") 
            this.tabuleiro[destinoI][destinoJ].peca = new Cavalo(this.tabuleiro[destinoI][destinoJ].peca.corPeca)
          if  (result == "torre") 
            this.tabuleiro[destinoI][destinoJ].peca = new Torre(this.tabuleiro[destinoI][destinoJ].peca.corPeca)
        })}
  }
  
  verificarMate() :boolean{
    return false;
  }

  verificarSeReiNaoEstaEmCheque() {
    let rei = this.pegarMeuRei()
    let reiEmCheque: boolean = false
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
            reiEmCheque = true
          }
        }
      }
    }
    return reiEmCheque
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
    this.movimentosErrados.forEach(it => {
      this.tabuleiro[it[0]][it[1]].movimentoNaoPossivel = false;
    })
    this.movimentosErrados = [];
    this.tabuleiro[this.pecaClicada[0]][this.pecaClicada[1]].clicada = false;
    this.possiveisIr.forEach(lancePossivel => {
      this.tabuleiro[lancePossivel.destinoI][lancePossivel.destinoJ].possivelIr = false;
    })
  }

  sinalizarErro(i: number, j: number) {
    this.movimentosErrados.push([i, j]);
    this.tabuleiro[i][j].movimentoNaoPossivel = true
  }
}


@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  template: `
    <div class="modal-header">
      <h4 class="modal-title" center id="modal-basic-title">Escolha uma peça</h4>
    </div>
    <div class="modal-body">
      <div class="row ">
        <div class="col escolherPecaPeao">
          <img width="70px" class="peca" [src]="'assets/images/torre-branco.png'" (click)="activeModal.close('torre')"/>
        </div>
        <div class="col escolherPecaPeao">
          <img width="70px" class="peca" [src]="'assets/images/cavalo-branco.png'" (click)="activeModal.close('cavalo')"/>
        </div>
        <div class="col escolherPecaPeao">
          <img width="70px" class="peca" [src]="'assets/images/rainha-branco.png'" (click)="activeModal.close('rainha')"/>
        </div>
        <div class="col escolherPecaPeao">
          <img width="70px" class="peca" [src]="'assets/images/bispo-branco.png'" (click)="activeModal.close('bispo')"/>
        </div>
      </div>
    </div>
  `
})
export class NgbdModalEscolherPeca {
  coiso = "asdfasdfas"
  constructor(public activeModal: NgbActiveModal) {}
}