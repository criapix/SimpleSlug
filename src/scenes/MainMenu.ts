import { Scene, GameObjects } from 'phaser';

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.background = this.add.image(width * 0.5, height * 0.5, 'background');
        this.background.setScale(Math.max(width / this.background.width, height / this.background.height));

        this.logo = this.add.image(width * 0.5, height * 0.4, 'logo');
        const logoScale = (height * 0.4) / this.logo.height;
        this.logo.setScale(logoScale);

        this.title = this.add.text(width * 0.5, height * 0.6, 'Main Menu', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {
            this.scene.start('Game');
        });

        this.input.keyboard?.once('keydown-SPACE', () => {
            this.scene.start('Game');
        });
    }
}
