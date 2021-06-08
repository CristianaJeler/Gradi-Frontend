import "phaser";
import { Storage } from "@capacitor/core";

export class PaintFinalScene extends Phaser.Scene {
    score: number | undefined;

    constructor() {
        super({
            key: "PaintFinalScene"
        });
    }
    preload(): void {
        this.load.setBaseURL("http://192.168.0.186:5500/src/games/pages/paintGame/")
        this.load.image("colours", "assets/final_image.png")

    }
    init(params: any): void {

    }

    create(): void {
        this.cameras.main.setBackgroundColor(0xffffff)
        this.add.image(200, 250, "colours")

        let resultText: string = 'Felicitări!';
        this.add.text(300, 200, resultText,
            {
                font: '75px Arial Bold',
                color: '#103984', align: 'center'
            }
        );
    }
};