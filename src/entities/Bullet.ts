import { Scene } from 'phaser';

export class Bullet extends Phaser.Physics.Arcade.Sprite {
    private speed: number = 400;

    constructor(scene: Scene, x: number, y: number, direction: number) {
        super(scene, x, y, 'bullet');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Configurar física do projétil
        this.setVelocityX(direction * this.speed);
        this.setGravityY(0);

        // Destruir o projétil após 2 segundos
        scene.time.delayedCall(2000, () => {
            this.destroy();
        });
    }
}