export class PaintWelcomeScene extends Phaser.Scene {
    title: Phaser.GameObjects.Text | undefined;
    // startButton: Phaser.GameObjects.Image | undefined;
    startButton: Phaser.GameObjects.Image | undefined;
    constructor() {
        super({
            key: "WelcomeScene"
        });
    }
    preload(): void {
        this.load.setBaseURL("http://192.168.0.186:5500/src/games/pages/paintGame/")
        this.load.image('startButton', 'assets/play_btn.png');
        this.load.image('background', 'assets/painting.png')
    }
    create(): void {
        this.cameras.main.setBackgroundColor(0xf5f5d1)
        let background = this.add.image(450, 250, 'background');
        background.scale = 0.35;

        const titleText: string = "Colorăm";
        this.title = this.add.text(325, 125, titleText,
            { font: '70px Arial Bold', color: '#0b305b', align: 'center' });

        this.startButton = this.add.image(465, 265, 'startButton').setInteractive({ useHandCursor: true });
        this.startButton.scaleX = 0.15;
        this.startButton.scaleY = 0.15;
        this.startButton.on('pointerdown', () => {
            this.scene.start("PaintGameScene");
        }, this);
    }
}