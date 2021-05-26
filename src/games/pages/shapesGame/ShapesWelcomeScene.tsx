export class ShapesWelcomeScene extends Phaser.Scene {
    title: Phaser.GameObjects.Text | undefined;
    // startButton: Phaser.GameObjects.Image | undefined;
    startButton: Phaser.GameObjects.Image | undefined;
    constructor() {
        super({
            key: "WelcomeScene"
        });
    }
    preload(): void {
        this.load.setBaseURL("https://github.com/CristianaJeler/Gradi-Frontend/blob/286496a4e7ddfef1d69fd445d0fa2bc03c3cec52/src/games/pages/shapesGame")
        this.load.image('startButton', 'assets/play_btn.png');
        this.load.image('background', 'assets/wellcome_background.png')
    }
    create(): void {
        this.add.image(450, 250, 'background');

        const titleText: string = "Forme\ngeometrice";
        this.title = this.add.text(300, 90, titleText,
            { font: '70px Arial Bold', color: '#0b305b', align: 'center' });

        this.startButton = this.add.image(470, 300, 'startButton').setInteractive({ useHandCursor: true });
        this.startButton.scaleX = 0.15;
        this.startButton.scaleY = 0.15;
        this.startButton.on('pointerdown', () => {
            this.scene.start("ShapesGameScene");
        }, this);
    }
}