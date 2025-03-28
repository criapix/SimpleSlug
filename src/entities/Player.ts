import { Scene } from 'phaser';
import { Bullet } from './Bullet';

export class Player extends Phaser.Physics.Arcade.Sprite {
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private spaceKey: Phaser.Input.Keyboard.Key;
    private isJumping: boolean = false;
    private moveSpeed: number = 200;
    private jumpForce: number = -400;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'player');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Configurar física do jogador
        this.setCollideWorldBounds(true);
        this.setBounce(0.1);
        this.setGravityY(1000);

        // Configurar controles
        if (!scene.input.keyboard) {
            throw new Error('Keyboard plugin não está habilitado na cena.');
        }
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.spaceKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        if (!this.cursors || !this.body) return;

        // Movimento horizontal
        if (this.cursors.left?.isDown) {
            this.setVelocityX(-this.moveSpeed);
            this.setFlipX(true);
        } else if (this.cursors.right?.isDown) {
            this.setVelocityX(this.moveSpeed);
            this.setFlipX(false);
        } else {
            this.setVelocityX(0);
        }

        // Pulo
        if (this.cursors.up?.isDown && (this.body.touching.down || this.body.blocked.down)) {
            this.setVelocityY(this.jumpForce);
            this.isJumping = true;
        }

        // Tiro
        if (this.spaceKey && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.shoot();
        }
    }

    private shoot() {
        const direction = this.flipX ? -1 : 1;
        new Bullet(this.scene, this.x + (direction * 20), this.y, direction);
    }
}