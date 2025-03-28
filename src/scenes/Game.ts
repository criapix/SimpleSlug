import { Scene, Tilemaps } from 'phaser';
import { Player } from '../entities/Player';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text : Phaser.GameObjects.Text;
    
    // Tile Map properties
    map: Tilemaps.Tilemap;
    tileset: Tilemaps.Tileset;
    platformLayer: Tilemaps.TilemapLayer;
    decorationLayer: Tilemaps.TilemapLayer;
    endLayer: Tilemaps.TilemapLayer;
    player: Player;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x87CEEB); // Cor de céu

        // Adiciona o background com menor opacidade
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        this.background = this.add.image(width * 0.5, height * 0.5, 'background');
        this.background.setScale(Math.max(width / this.background.width, height / this.background.height));
        this.background.setAlpha(0.3);
        
        // Cria o tilemap a partir do JSON carregado
        this.map = this.make.tilemap({ key: 'map' });
        
        // Calcula a escala para fazer o mapa ocupar toda a altura da tela
        const mapHeight = this.map.heightInPixels;
        const screenHeight = this.cameras.main.height;
        const scale = screenHeight / mapHeight;
        
        // Adiciona o tileset ao mapa
        const tileset = this.map.addTilesetImage('tileset', 'tileset');
        if (!tileset) {
            throw new Error('Failed to load tileset');
        }
        this.tileset = tileset;
        
        // Cria as camadas do mapa
        const decorationLayer = this.map.createLayer('decorations', this.tileset, 0, 0);
        if (!decorationLayer) {
            throw new Error('Failed to create decoration layer');
        }
        this.decorationLayer = decorationLayer;
        this.decorationLayer.setScale(scale);

        const platformLayer = this.map.createLayer('platforms', this.tileset, 0, 0);
        if (!platformLayer) {
            throw new Error('Failed to create platform layer');
        }
        this.platformLayer = platformLayer;
        this.platformLayer.setScale(scale);

        const endLayer = this.map.createLayer('end', this.tileset, 0, 0);
        if (!endLayer) {
            throw new Error('Failed to create end layer');
        }
        this.endLayer = endLayer;
        this.endLayer.setScale(scale);
        
        // Configura colisões para a camada de plataformas
        this.platformLayer.setCollisionByExclusion([-1, 0]);

        // Cria o jogador na posição inicial e ajusta sua escala
        this.player = new Player(this, 100 * scale, 300 * scale);
        this.player.setScale(scale);

        // Adiciona colisão entre o jogador e as plataformas
        this.physics.add.collider(this.player, this.platformLayer);
        
        // Ajusta a câmera para seguir o jogador
        this.camera.setBounds(0, 0, this.map.widthInPixels * scale, this.map.heightInPixels * scale);
        this.camera.startFollow(this.player, true, 0.5, 0.5); // Seguimento suave em ambos os eixos
        this.camera.setLerp(0.1, 0.1); // Suaviza o movimento da câmera em ambos os eixos
        
        // Adiciona texto de instrução
        this.msg_text = this.add.text(this.cameras.main.width * 0.5, this.cameras.main.height * 0.15, 'Use as setas para mover e pular\nEspaço para atirar', {
            fontFamily: 'Arial Black', fontSize: 24, color: '#ffffff',
            stroke: '#000000', strokeThickness: 6,
            align: 'center'
        });
        this.msg_text.setOrigin(0.5);
        this.msg_text.setScrollFactor(0); // Fixa o texto na tela

    }

    update() {
        // Atualiza o jogador
        this.player.update();
    }
}
