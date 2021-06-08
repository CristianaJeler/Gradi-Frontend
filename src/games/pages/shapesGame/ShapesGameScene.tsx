import "phaser";
import { GameObjects } from "phaser";
import Shapes from "./Shapes";
export class ShapesGameScene extends Phaser.Scene {
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

    changeObject(): void {
        let x = 150
        if (this.clickedObject) {
            if (this.currentIndex < this.objects.length) {
                let idx = this.renderingObjects.indexOf(this.clickedObject.object)
                x += 300 * idx;

                let key = this.objects[this.currentIndex]
                let img = this.add.image(x, 400, key)
                img.setScale(0.3, 0.3)
                img.setInteractive({ useHandCursor: true })
                img.on("pointerdown", () => {
                    if (this.clickedObject) this.clickedObject.object.tint = 0xffffff
                    img.tint = 0xcac9c9
                    this.clickedObject = { object: img, key: key };
                    this.checkMatch()
                })

                this.renderingObjects.splice(idx, 1, img)
            }

            this.clickedObject?.object.destroy()
            this.currentIndex += 1;

            console.log(this.currentIndex)
        }
    }

    checkMatch(): void {
        if (this.clickedObject && this.clickedShape) {
            let diff = 0;
            switch (this.clickedShape.key) {
                case "circle":
                    if (this.clickedObject.key === "earth" || this.clickedObject.key === "clock" || this.clickedObject.key === "ball")
                        diff = 1
                    else diff = -1
                    break;
                case "square":
                    if (this.clickedObject.key === "envelope" || this.clickedObject.key === "present"
                        || this.clickedObject.key === "choco") diff = 1
                    else diff = -1
                    break;
                case "triangle":
                    if (this.clickedObject.key === "watermelon" || this.clickedObject.key === "cheese")
                        diff = 1
                    else diff = -1
                    break;
            }

            setTimeout(() => {
                if (this.clickedObject && this.clickedShape) {
                    // console.log(this.clickedObject.key + " " + this.clickedShape.key)
                    this.clickedShape.shape.setStrokeStyle(1)
                    this.clickedObject.object.tint = 0xffffff
                    if (diff === 1) this.changeObject()
                    if (this.points + diff >= 0) this.points += diff
                    else this.points = 0
                    this.clickedObject = null
                    this.clickedShape = null
                }
            }, 200)
        }

    }

    create(): void {
        let sky = this.add.image(450, 300, 'sky')
        sky.setScale(1.5, 1.5)


        this.info = this.add.text(10, 10, '',
            { font: '30px Arial Bold', color: '#fefeeb' });

        let circle = this.add.circle(150, 150, 80, 0xfb7e7e, 1);
        circle.strokeColor = 0x000000
        circle.isStroked = true
        circle.setInteractive({ useHandCursor: true })
        circle.on("pointerdown", () => {
            if (this.clickedShape) this.clickedShape.shape.setStrokeStyle(1)
            circle.setStrokeStyle(5)
            this.clickedShape = { shape: circle, key: 'circle' };
            this.checkMatch()
        })

        let square = this.add.rectangle(450, 150, 150, 150, 0xa6f7d5, 1);
        square.strokeColor = 0x000000
        square.isStroked = true
        square.setInteractive({ useHandCursor: true })
        square.on("pointerdown", () => {
            if (this.clickedShape) this.clickedShape.shape.setStrokeStyle(1)
            square.setStrokeStyle(5)
            this.clickedShape = { shape: square, key: "square" };
            this.checkMatch()
        })

        let triangle = this.add.triangle(750, 150, 0, 120, 120, 120, 60, 0, 0xd7a1f7, 1);
        triangle.strokeColor = 0x000000
        triangle.isStroked = true
        triangle.setInteractive({ useHandCursor: true })
        triangle.on("pointerdown", () => {
            if (this.clickedShape) this.clickedShape.shape.setStrokeStyle(1)
            triangle.setStrokeStyle(5)
            this.clickedShape = { shape: triangle, key: 'triangle' };
            this.checkMatch()
        })


        let ob1 = this.add.image(150, 400, this.objects[0])
        ob1.setScale(0.3, 0.3);
        ob1.setInteractive({ useHandCursor: true })
        ob1.on("pointerdown", () => {
            if (this.clickedObject) this.clickedObject.object.tint = 0xffffff
            ob1.tint = 0xcac9c9
            this.clickedObject = { object: ob1, key: this.objects[0] };
            this.checkMatch()
        })

        let ob2 = this.add.image(450, 400, this.objects[1])
        ob2.setScale(0.3, 0.3);
        ob2.setInteractive({ useHandCursor: true })
        ob2.on("pointerdown", () => {
            if (this.clickedObject) this.clickedObject.object.tint = 0xffffff
            ob2.tint = 0xcac9c9
            this.clickedObject = { object: ob2, key: this.objects[1] };
            this.checkMatch()
        })

        let ob3: GameObjects.Image = this.add.image(750, 400, this.objects[2])
        ob3.setScale(0.3, 0.3);
        ob3.setInteractive({ useHandCursor: true })
        ob3.on("pointerdown", () => {
            if (this.clickedObject) this.clickedObject.object.tint = 0xffffff
            ob3.tint = 0xcac9c9
            this.clickedObject = { object: ob3, key: this.objects[2] };

            this.checkMatch()
        })

        this.renderingObjects.push(ob1, ob2, ob3)
    }
    update(): void {
        if (this.points >= 0) this.info!.text = this.points + " puncte"

        if (this.currentIndex === this.objects.length + 3) {
            this.scene.start("ShapesScoreScene",
                { points: this.points });
        }
    }
}