export class StoryWelcomeScene extends Phaser.Scene {
    title: Phaser.GameObjects.Text | undefined;
    constructor() {
        super({
            key: "WelcomeScene"
        });
    }
    preload(): void {
        this.load.setBaseURL("http://192.168.0.186:5500/src/games/pages/storyGame/")
        this.load.image('storyBook', 'assets/storyBook.png')
    }
    create(): void {
        this.cameras.main.setBackgroundColor(0xd5f6f3)
        let background = this.add.image(450, 320, 'storyBook');
        background.scale = 0.6;

        const titleText: string = "Găsește povestea!";
        this.title = this.add.text(220, 20, titleText,
            { font: '70px Arial Bold', color: '#0b305b', align: 'center' });

        this.input.on('pointerdown', () => {
            this.scene.start("StoryGameScene");
        }, this);
    }
}