import "phaser";
import { GameObjects } from "phaser";

export class AnimationGameScene extends Phaser.Scene {
    points = 0;
    info: any;
    objects: string[];
    clickedShape?: { shape: GameObjects.Shape, key: string } | null
    clickedObject?: { object: GameObjects.Image, key: string } | null
    currentIndex: number
    renderingObjects: GameObjects.Image[]


    constructor() {
        super({
            key: "ShapesGameScene"
        });
        this.objects = []
        this.currentIndex = 3
        this.renderingObjects = []
    }
    init(params: any): void {
        this.points = 0;
        this.clickedShape = null
        this.clickedObject = null
        this.objects.push("ball", "present", "cheese", "choco", "clock", "earth", "envelope", "watermelon")
        this.objects.sort(() => Math.random() - 0.5)
        // console.log(this.objects)
    }
    preload(): void {
        this.load.setBaseURL("http://192.168.0.186:5500/src/games/pages/shapesGame/")
        this.load.image("ball", "assets/ball.png");
        this.load.image("sky", "assets/sky.png");
        this.load.image("present", "assets/present.png");
        this.load.image("cheese", "assets/cheese.png");
        this.load.image("choco", "assets/choco.png");
        this.load.image("clock", "assets/clock.png");
        this.load.image("earth", "assets/earth.png");
        this.load.image("envelope", "assets/envelope.png");
        this.load.image("watermelon", "assets/watermelon.png");
        this.load.image("triangle", "assets/triangle.png");
        this.load.image("square", "assets/square.png");
        this.load.image("circle", "assets/circle.png");
    }

    create(): void {

    }
    update(): void {
        if (this.points >= 0) this.info!.text = this.points + " puncte"

        if (this.currentIndex === this.objects.length + 3) {
            this.scene.start("ShapesScoreScene",
                { points: this.points });
        }
    }
}