import "phaser";
import { GameObjects } from "phaser";
import { Storage } from "@capacitor/core";

export class PaintGameScene extends Phaser.Scene {
    private brush: String | null;
    private eraser: GameObjects.Image | null
    private currentColor: GameObjects.Shape | null
    private activityId?: string;

    constructor(activityId?: string) {
        super({
            key: "PaintGameScene"
        });
        this.brush = "blue_brush"
        this.eraser = null
        this.currentColor = null
        this.activityId = activityId
    }

    init(params: any): void {

    }

    preload(): void {
        this.load.setBaseURL("http://192.168.0.186:5500/src/games/pages/paintGame/")
        this.load.image("blue", "assets/blue.jpg");
        this.load.image("green", "assets/green.jpg");
        this.load.image("orange", "assets/orange.jpg");
        this.load.image("purple", "assets/purple.jpg");
        this.load.image("red", "assets/red.jpg");
        this.load.image("yellow", "assets/yellow.jpg");

        this.load.image('blue_brush', 'assets/blue_brush.png');
        this.load.image('green_brush', 'assets/green_brush.png');
        this.load.image('orange_brush', 'assets/orange_brush.png');
        this.load.image('purple_brush', 'assets/purple_brush.png');
        this.load.image('red_brush', 'assets/red_brush.png');
        this.load.image('yellow_brush', 'assets/yellow_brush.png');

        this.load.image("butterfly", "assets/butterfly.jpg")
        this.load.image("eraser_brush", "assets/eraser_brush.png")
        this.load.image("eraser", "assets/eraser.png")

        this.load.image("camera", "assets/camera.png")
    }

    create() {
        this.cameras.main.setBackgroundColor(0xffffff)

        let eraser = this.add.image(100, 325, "eraser")
            .setScale(0.25, 0.25)
            .setInteractive({ useHandCursor: true })
        eraser.on("pointerdown", () => {
            this.currentColor?.setStrokeStyle(0)
            this.currentColor = null
            this.eraser = eraser
            this.eraser.scale = 0.3
        })

        let blue = this.add.rectangle(50, 50, 60, 60, 0x4EC5F1, 1);
        blue.fillColor = 0x4EC5F1
        blue.setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.brush = "blue_brush"
                this.eraser?.setScale(0.25, 0.25)
                this.eraser = null
                this.currentColor?.setStrokeStyle(0)
                this.currentColor = blue
                this.currentColor.setStrokeStyle(5)
            })

        let green = this.add.rectangle(50, 120, 60, 60, 0x22ce3b, 1);
        green.fillColor = 0x22ce3b
        green.setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.brush = "green_brush"
                this.eraser?.setScale(0.25, 0.25)
                this.eraser = null
                this.currentColor?.setStrokeStyle(0)
                this.currentColor = green
                this.currentColor.setStrokeStyle(5)
            })

        let orange = this.add.rectangle(50, 190, 60, 60, 0xff9500, 1);
        orange.fillColor = 0xff9500
        orange.setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.brush = "orange_brush"
                this.eraser?.setScale(0.25, 0.25)
                this.eraser = null
                this.currentColor?.setStrokeStyle(0)
                this.currentColor = orange
                this.currentColor.setStrokeStyle(5)
            })

        let purple = this.add.rectangle(150, 50, 60, 60, 0xb257a9, 1);
        purple.fillColor = 0xb257a9
        purple.setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.brush = "purple_brush"
                this.eraser?.setScale(0.25, 0.25)
                this.eraser = null
                this.currentColor?.setStrokeStyle(0)
                this.currentColor = purple
                this.currentColor.setStrokeStyle(5)
            })

        let red = this.add.rectangle(150, 120, 60, 60, 0xff1f1f, 1);
        red.fillColor = 0xff1f1f
        red.setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.brush = "red_brush"
                this.eraser?.setScale(0.25, 0.25)
                this.eraser = null
                this.currentColor?.setStrokeStyle(0)
                this.currentColor = red
                this.currentColor.setStrokeStyle(5)
            })


        let yellow = this.add.rectangle(150, 190, 60, 60, 0xffeb0f, 1);
        yellow.fillColor = 0xffeb0f
        yellow.setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.brush = "yellow_brush"
                this.eraser?.setScale(0.25, 0.25)
                this.eraser = null
                this.currentColor?.setStrokeStyle(0)
                this.currentColor = yellow
                this.currentColor.setStrokeStyle(5)
            })

        var rt = this.add.renderTexture(220, 0, 680, 500)

        this.input.on('pointermove', (pointer: any) => {
            if (pointer.isDown && this.brush) {
                rt.draw(this.brush, pointer.x - 225, pointer.y);
            }
        }, this);
        this.input.on('pointerdown', (pointer: any) => {
            if (pointer.isDown && this.brush) {
                rt.draw(this.brush, pointer.x - 225, pointer.y);
            }
        }, this);

        var eraser_brush = this.make.image({ key: 'eraser_brush' }, false).setScale(0.5);

        this.input.on('pointermove', (pointer: any) => {

            if (pointer.isDown && this.eraser) {
                this.brush = null
                rt.erase(eraser_brush, pointer.x - 225, pointer.y);
            }

        }, this);

        this.add.image(100, 450, "camera")
            .setScale(0.2, 0.2)
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => {
                this.takeSnapshot(rt)
            })

    }

    takeSnapshot(rt: GameObjects.RenderTexture) {
        rt.snapshot((pic) => {

            async function setInStorage(picSource: string, activityId?: string) {
                await Storage.set({ key: "drawing_" + activityId, value: picSource })
            }
            try {
                if (pic instanceof HTMLImageElement)
                    setInStorage(pic.src, this.activityId)
            } catch (ex) {

            }
        }, "image/png", 0.92);

        setTimeout(() =>
            this.scene.start("PaintFinalScene"), 1000
        )
    }

    update(): void {

    }
}