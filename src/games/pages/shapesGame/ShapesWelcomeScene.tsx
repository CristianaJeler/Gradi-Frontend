export class ShapesWelcomeScene extends Phaser.Scene {
    title: Phaser.GameObjects.Text | undefined;
    hint: Phaser.GameObjects.Image | undefined;
    constructor() {
        super({
            key: "WelcomeScene"
        });
    }
    preload():void{
        this.load.image('startButton', 'assets/play_btn.png');
    }
    create(): void {
        const titleText: string = "Forme";
        this.title = this.add.text(150, 200, titleText,
            { font: '128px Arial Bold', color: '#FBFBAC' });

        this.hint=this.add.image(330, 350,'startButton').setInteractive();
        // this.hint.on('gameobjectdown', (/*pointer*/) => {
        //         this.scene.start("ShapesGameScene");
        //     }, this);
    }
}