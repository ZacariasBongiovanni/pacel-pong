import Phaser from "phaser";
import ball from "../components/ball";
import racket from "../components/racket";
import events from "./EventCenter";

export default class Pong extends Phaser.Scene {
  constructor() {
    super("pong");
    this.level;
    this.score;
    this.obstacles;
    this.racket;
    this.ball;
    this.velocityRacket;
    this.velocityBall;

  }
  
  init(data) {
    this.level = data.level || 1;
    this.score = data.score || 0;
    this.velocityRacket = data.setVelocityRacket || 300;
    this.velocidadBall = data.velocityBall || 200;
  }

  create() {
    this.scene.launch("ui", {
      level: this.level,
      score: this.score,
    });

    this.racket = new racket(
      this,
      400,
      550,
      100,
      20,
      0xffffff,
      this.velocityRacket
    );
    this.ball = new ball(
      this,
      400,
      300,
      10,
      0xffffff,
      this.velocityBall
    );

    // add collider
    this.physics.add.collider(
      this.paleta,
      this.pelota,
      this.chocaPaleta,
      null,
      this
    );

    // colision con los obstaculos
    this.obstaculos.forEach((obstaculo) => {
      const item = this.add.rectangle(
        obstaculo.x,
        obstaculo.y,
        obstaculo.ancho,
        obstaculo.alto,
        0xffffff
      );
      this.physics.add.existing(item);
      item.body.setImmovable(true);
      this.physics.add.collider(this.pelota, item);
    });
  }

  update() {
    this.paleta.actualizar();
  }

  chocaPaleta() {
    this.puntos += 1;
    events.emit("actualizarDatos", {
      nivel: this.nivel,
      puntos: this.puntos,
    });

    if (this.puntos === 3) {
      this.pasarNivel();
    }

    this.pelota.cambiarColor();
  }

  pasarNivel() {
    this.nivel += 1;
    this.puntos = 0;
    this.velocidadPelota *= 1.1;
    this.velocidadPaleta += 50;
    this.obstaculos.push({
      x: Phaser.Math.Between(100, 700),
      y: Phaser.Math.Between(0, 400),
      ancho: Phaser.Math.Between(50, 100),
      alto: Phaser.Math.Between(20, 40),
    });

    this.scene.start("pong", {
      nivel: this.nivel,
      puntos: this.puntos,
      velocidadPelota: this.velocidadPelota,
      velocidadPaleta: this.velocidadPaleta,
      obstaculos: this.obstaculos,
    });
  }
}