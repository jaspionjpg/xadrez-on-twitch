import { Component } from '@angular/core';
import { Celula } from 'src/models/celula.module';
import { Rainha } from 'src/models/rainha.module';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Bispo } from 'src/models/bispo.module';
import { Cavalo } from 'src/models/cavalo.module';
import { Torre } from 'src/models/torre.module';

import * as tmi from 'tmi.js'
import { Movimento } from 'src/models/movimento.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  timeLeft: number = -1;
  interval;

  startTimer(tempo: number) {
    this.timeLeft = tempo
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = -1
        this.pauseTimer()
        
        var movimentosOrdenados = new Map([...this.movimentosVotos.entries()].sort(this.keyDescOrder2));

        let mov = movimentosOrdenados.values().next().value
        console.log(mov)

        this.moverPeca([mov.movimento.i, mov.movimento.j], mov.movimento.destinoI, mov.movimento.destinoJ)
      }
    },1000)
  }

  pauseTimer() {
    clearInterval(this.interval);
  }
  
  keyDescOrder = (a: any, b: any): number => {
    if (!a.value.podeMover) 
      return 1
    if (!b.value.podeMover) 
      return -1
    return a.value.numeroVezes > b.value.numeroVezes? -1 : (b.value.numeroVezes > a.value.numeroVezes ? 1 : 0);
  }
  keyDescOrder2 = (a: any, b: any): number => {
    if (!a[1].podeMover) 
      return 1
    if (!b[1].podeMover) 
      return -1
    return a[1].numeroVezes > b[1].numeroVezes? -1 : (b[1].numeroVezes > a[1].numeroVezes ? 1 : 0);
  }

  title = 'xadrez-on-twitch';
  tabuleiro: Celula[][];

  minhasPecas = "branco";
  corAMover = "branco";
  nick;
  modoDeJogo;

  posicaoReiPreto = [0, 4]
  posicaoReiBranco = [7, 4]

  constructor(public modalService: NgbModal, 
              public config: NgbModalConfig) {
    config.backdrop = 'static';
    config.keyboard = false;

    this.tabuleiro = this.criarTabuleiro()
  }

  movimentosVotos = new Map()
  votos = new Set()

  async buscarChat(nick: string) {
    const client = new tmi.Client({
      connection: {
        secure: true,
        reconnect: true
      },
      channels: [ nick ],
      logger: {
        error: (message) => {
          this.criarTabuleiro()
          console.log("error: "+message)},
        warn: (message) => {console.log("warn: " +message)},
        info: (message) => {console.log("info: "+message)}
      }
    });
  
    client.connect().catch(it => {
      console.log("deu merda")
    });
  
    client.on('message', (channel, tags, message, self) => {
      if(this.minhasPecas == this.corAMover){
        return;
      }
      let comando = message.trim().toUpperCase();
      if (comando.startsWith("!MOVE")) {
        let palavras = comando.split(" ")
        if (palavras.length == 3 && palavras[1].length == 2 && palavras[2].length == 2) {
          console.log(palavras[1] + " -> " + palavras[2])
          let i = 8 - Number(palavras[1][1])
          let j = Celula.pegarLinha(palavras[1][0])
          let destinoI = 8 - Number(palavras[2][1])
          let destinoJ = Celula.pegarLinha(palavras[2][0])

          let nickMessage = tags['display-name'];
          if (this.tabuleiro[i][j].peca != null && this.tabuleiro[i][j].peca.corPeca != this.minhasPecas
              // && !this.votos.has(nickMessage)
              ) {
            if (this.movimentosVotos.has(comando)) {
              this.movimentosVotos.set(comando, {movimento: this.movimentosVotos.get(comando).movimento, 
                                                numeroVezes: this.movimentosVotos.get(comando).numeroVezes + 1,
                                                de: palavras[1],
                                                para: palavras[2],
                                                podeMover: this.movimentosVotos.get(comando).podeMover})
            } else {
              let podeMover: boolean = this.tabuleiro[i][j].peca.possiveisMovimentos(i, j, this.tabuleiro).filter(it => {
                return it.destinoI == destinoI && it.destinoJ == destinoJ
              }).length > 0
              // if (podeMover) {
                if (this.timeLeft == -1 && podeMover && this.minhasPecas != this.corAMover)
                  this.startTimer(20)

                let movimento = new Movimento(i, j, destinoI, destinoJ, this.tabuleiro[destinoI][destinoJ].peca != null)
                this.movimentosVotos.set(comando, {movimento: movimento, numeroVezes: 1, de: palavras[1], para: palavras[2], podeMover: podeMover})
              // } else {
              //   return;
              // }
            }
            this.votos.add(tags['display-name'])
          }
          console.log(this.movimentosVotos)
          console.log(this.votos)
        }
      }
      console.log(`${tags['display-name']}: ${message}`);
    });
  }

  criarTabuleiro(): Celula[][] {
    let tabuleiro = [];
    for (let i = 0; i < 8; i++) {
      tabuleiro[i] = [];
      for (let j = 0; j < 8; j++) {
        tabuleiro[i][j] = new Celula(i, j, true);
      }
    }

    this.modalService.open(NgbdModalEscolherCor)
      .result.then((result) => {
        let results = result.split("-")
        console.log(result)
        this.modoDeJogo = results[0]
        this.minhasPecas = results[1]
        this.nick = results[2]

        if (this.modoDeJogo == "online") {
          this.buscarChat(this.nick)
        }
    })
    
    return tabuleiro;
  }

  getTabuleiro() {
    return (this.minhasPecas == 'branco') ? this.tabuleiro : this.tabuleiro.slice().reverse();
  }
  getIndexTabuleiro(index) {
    return (this.minhasPecas == 'branco') ? index: 7 - index;
  }

  pecaClicada = [0, 0]
  possiveisIr = []
  movimentosErrados = []

  clicarCelula(i: number, j: number) {
    i = this.getIndexTabuleiro(i);
    this.limparAcoes()

    if (this.minhasPecas == this.corAMover || this.modoDeJogo == "offline") {
      if (this.tabuleiro[i][j].peca != null && this.corAMover == this.tabuleiro[i][j].peca.corPeca) {
        return this.sinalizarMovimentos(i, j)
      }
      
      if (this.possiveisIr.filter(it => it.destinoI == i && it.destinoJ == j).length > 0) {
        return this.moverPeca(this.pecaClicada, i, j);
      }
    }

    this.sinalizarErro(i, j)
  }

  moverPeca(pecaClicada: number[], destinoI: number, destinoJ: number, mudarCor: boolean = true) {
    let pecaAnteriorNoDestino = this.tabuleiro[destinoI][destinoJ].peca;

    this.tabuleiro[destinoI][destinoJ].peca = this.tabuleiro[pecaClicada[0]][pecaClicada[1]].peca
    this.tabuleiro[pecaClicada[0]][pecaClicada[1]].peca = null

    if (this.tabuleiro[destinoI][destinoJ].peca.nomePeca == "rei") {
      if (!this.tabuleiro[destinoI][destinoJ].peca.seMoveu) {
        if (2 == destinoJ) {
          this.moverPeca([destinoI, 0], destinoI, 3, false) 
        } 
        if (6 == destinoJ) {
          this.moverPeca([destinoI, 7], destinoI, 5, false) 
        }
      }

      if (this.tabuleiro[destinoI][destinoJ].peca.corPeca == "branco") 
        this.posicaoReiBranco = [destinoI, destinoJ]
      else 
        this.posicaoReiPreto = [destinoI, destinoJ]
    }

    // if(this.verificarSeReiNaoEstaEmCheque()) {
    //   console.log("rei cagado")
    //   this.tabuleiro[pecaClicada[0]][pecaClicada[1]].peca = this.tabuleiro[destinoI][destinoJ].peca
    //   this.tabuleiro[destinoI][destinoJ].peca = pecaAnteriorNoDestino
    //   return;
    // } 

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

    if (mudarCor) {
      if (this.corAMover == "preto") 
        this.corAMover = "branco"
      else 
        this.corAMover = "preto" 
    }

    this.possiveisIr = []
    this.votos = new Set()
    this.movimentosVotos = new Map()
    this.tabuleiro[destinoI][destinoJ].peca.seMoveu = true
    
    if (this.verificarMate()) {
      this.modalService.open(NgbdModalChequeMate)
        .result.then(it => {
          // this.tabuleiro = this.criarTabuleiro()
        })
      console.log("MATEEEEE SE FUDEUU OTARIO")
    }
  }
  
  verificarMate() :boolean {
    for (let x = 0; x < this.tabuleiro.length; x++) {
      let linha = this.tabuleiro[x];
      for (let y = 0; y < linha.length; y++) {
        let celula = linha[y];

        if (celula.peca != null && celula.peca.corPeca == this.corAMover) {
          let movimentos = this.pegaPossiveisMovimentos(x, y)
          if (movimentos.length > 0) {
            return false
          }
        }
      }
    }
    return true;
  }

  verificarSeReiNaoEstaEmCheque(movimento: Movimento) {
    let rei = Object.assign({}, this.pegarMeuRei())
    let reiEmCheque: boolean = false

    let tabuleiroAUsar;
    tabuleiroAUsar = this.clonaTabuleiro()
    tabuleiroAUsar[movimento.destinoI][movimento.destinoJ].peca = tabuleiroAUsar[movimento.i][movimento.j].peca
    tabuleiroAUsar[movimento.i][movimento.j].peca = null

    if (tabuleiroAUsar[movimento.destinoI][movimento.destinoJ].peca.nomePeca == "rei") {
      rei = [movimento.destinoI, movimento.destinoJ]
    }
   
    for (let x = 0; x < tabuleiroAUsar.length; x++) {
      let linha = tabuleiroAUsar[x];
      for (let y = 0; y < linha.length; y++) {
        let celula = linha[y];

        if (celula.peca != null && celula.peca.corPeca != this.corAMover) {
          let pecasAAtacar = celula.peca.possiveisMovimentos(x, y, tabuleiroAUsar)
            .filter(it => {
              return it.destinoI == rei[0] && it.destinoJ == rei[1] && it.capturar
            })

          if (pecasAAtacar.length > 0) {
            //   pecasAAtacar.forEach(it => {
            //     this.sinalizarErro(rei[0], rei[1])
            //     this.sinalizarErro(x, y)
            //   })
            return true;
          }  
          
            // reiEmCheque = true
          
        }
      }
    }
    return reiEmCheque
  }

  clonaTabuleiro() {
    let copiaTabuleiro = [];
    for (let i = 0; i < 8; i++) {
      copiaTabuleiro[i] = [];
      for (let j = 0; j < 8; j++) {
        copiaTabuleiro[i][j] = Object.assign({}, this.tabuleiro[i][j]);
      }
    }
    return copiaTabuleiro;
  }

  pegarMeuRei() {
    if(this.corAMover == "branco") {
      return this.posicaoReiBranco;
    } else {
      return this.posicaoReiPreto;
    }
  }

  sinalizarMovimentos(i: number, j: number) {
    this.pecaClicada = [i, j]

    if (this.tabuleiro[i][j].peca != null) {
      this.tabuleiro[i][j].clicada = true;
      this.possiveisIr = this.pegaPossiveisMovimentos(i, j)
      this.possiveisIr.forEach(lancePossivel => {
        this.tabuleiro[lancePossivel.destinoI][lancePossivel.destinoJ].possivelIr = true;
      })
    }
  }
  pegaPossiveisMovimentos(i: number, j: number) {
    return this.tabuleiro[i][j].peca
      .possiveisMovimentos(i, j, this.tabuleiro)
      .filter(it => {
        let reiEmCheque = this.verificarSeReiNaoEstaEmCheque(it);
        return !reiEmCheque
      })
  }

  limparAcoes() {
    this.votos = new Set()
    this.movimentosVotos = new Map()
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
  constructor(public activeModal: NgbActiveModal) {}
}


@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  template: `
    <div class="modal-header">
      <h4 class="modal-title" center id="modal-basic-title">Vitoria das Brancas</h4>
    </div>
    <div class="modal-body">
      <div class="row ">
        <div class="col escolherPecaPeao" align="center">
          <img width="210px" class="peca" [src]="'assets/images/rei-branco.png'" (click)="activeModal.close()"/>
        </div>
      </div>
    </div>
  `
})
export class NgbdModalChequeMate {
  constructor(public activeModal: NgbActiveModal) {}
}

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  template: `
    <div class="modal-header">
      <h4 class="modal-title" center id="modal-basic-title">Escolha a cor a jogar</h4>
    </div>
    <div class="modal-body">
      <div class="row" align="center">
        <div class="col-12 modo">
          Modo de jogo:
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-6" align="center">
          <button type="button" class="btn" align="center" 
            [class.btn-outline-primary]="modoJogo!='online'" 
            [class.btn-primary]="modoJogo=='online'" (click)="escolherModo('online')">
          Online</button>
        </div>
        <div class="col-6" align="center">
          <button type="button" class="btn" align="center" 
            [class.btn-outline-primary]="modoJogo!='offline'" 
            [class.btn-primary]="modoJogo=='offline'"  (click)="escolherModo('offline')">
          Offline</button>
        </div>
      </div>
      <div class="row mt-4" align="center" [style.display]="modoJogo=='offline' ? 'none' : 'block'">
        <div class="col-12">
          <div class="col-6" >
            <input type="text" class="form-control" (keyup)="onKey($event)" placeholder="Entre com o seu nick">
          </div>
        </div>
      </div>
      <div class="row mt-4" align="center">
        <div class="col-12 modo">
          Escolha uma cor
        </div>
      </div>
      <div class="row ">
        <div class="col escolherPecaPeao" align="center">
          <button type="button" class="btn"
            [class.btn-outline-success]="corPeca!='branco'" 
            [class.btn-success]="corPeca=='branco'" align="center">
            <img width="70px" class="peca" [src]="'assets/images/rei-branco.png'" (click)="escolherCor('branco')"/>
          </button>
        </div>
        <div class="col escolherPecaPeao" align="center">
          <button type="button" class="btn" 
            [class.btn-outline-success]="corPeca!='preto'" 
            [class.btn-success]="corPeca=='preto'"align="center">
            <img width="70px" class="peca" [src]="'assets/images/rei-preto.png'" (click)="escolherCor('preto')"/>
          </button>
        </div>
      </div>

      <div class="row mt-4">
        <div class="col-12" align="center">
        <button type="button" class="btn btn-success" align="center" (click)="activeModal.close(modoJogo + '-' + corPeca +  '-' + nick)">
          Jogar</button>
        </div>
      </div>
    </div>
  `
})
export class NgbdModalEscolherCor {
  modoJogo = "online";
  corPeca = "branco"
  nick: string;
  constructor(public activeModal: NgbActiveModal) {}

  onKey(event: any) {
    this.nick = event.target.value.trim();
  }
  escolherModo(modo:string) {
    this.modoJogo = modo;
    console.log(this.modoJogo)
  }
  escolherCor(cor:string) {
    this.corPeca = cor;
  }
}