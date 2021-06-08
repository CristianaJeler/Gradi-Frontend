import "phaser";
import { GameObjects } from "phaser";

export class StoryGameScene extends Phaser.Scene {
    private images: string[]
    private clickedImages: GameObjects.Image[]
    private renderedImages: { name: string, img: GameObjects.Image }[]
    private LINES: number = 4;
    private COLUMNS: number = 5;
    private TOTAL_IMGS_NO = this.LINES * this.COLUMNS;
    private IMG_WIDTH: number = 146;
    private IMG_HEIGHT: number = 114;

    constructor() {
        super({
            key: "StoryGameScene"
        });
        this.images = []
        this.clickedImages = []
        this.renderedImages = []
    }

    init(params: any): void {

    }

    preload(): void {
        this.load.setBaseURL("http://192.168.0.186:5500/src/games/pages/storyGame/")

        let imageToLoad = "assets/image_part_0";
        for (let i = 1; i <= this.TOTAL_IMGS_NO; i++)
            if (i < 10) this.load.image("img" + i, imageToLoad + "0" + i + ".jpg");
            else this.load.image("img" + i, imageToLoad + i + ".jpg");
    }

    create() {
        this.cameras.main.setBackgroundColor(0xf2eded)

        this.makeImagesList();

        this.placeImages();
    }

    makeImagesList(): void {
        for (let i = 1; i <= this.TOTAL_IMGS_NO; i++)
            this.images.push("img" + i);

        this.images.sort(() => Math.random() - 0.5)
    }

    placeImages(): void {
        let y = 80;
        for (let i = 1; i <= this.LINES; i++) {
            let x = 160;
            for (let j = 1; j <= this.COLUMNS; j++) {
                let img = this.add.image(x, y, this.images[(i - 1) * this.COLUMNS + j - 1])
                img.height = this.IMG_HEIGHT
                img.width = this.IMG_WIDTH
                img.setInteractive({ useHandCursor: true })
                img.on("pointerdown", () => {
                    img.tint = 0xcac9c9
                    this.clickedImages.push(img)

                    if (this.clickedImages.length === 2) {
                        this.swapImages()
                        setTimeout(() => {
                            this.clickedImages[0].tint = 0xffffff
                            this.clickedImages[1].tint = 0xffffff

                            this.clickedImages.splice(0, this.clickedImages.length)
                        }, 500)
                    }
                })

                this.renderedImages.push({ name: this.images[(i - 1) * this.COLUMNS + j - 1], img })

                x += this.IMG_WIDTH
            }
            y += this.IMG_HEIGHT;
        }
    }


    swapImages(): void {
        let auxX = this.clickedImages[0].x
        let auxY = this.clickedImages[0].y

        this.clickedImages[0].x = this.clickedImages[1].x
        this.clickedImages[0].y = this.clickedImages[1].y

        this.clickedImages[1].x = auxX
        this.clickedImages[1].y = auxY

        let idx1 = this.renderedImages.findIndex(elem => elem.img === this.clickedImages[0])
        let idx2 = this.renderedImages.findIndex(elem => elem.img === this.clickedImages[1])
        let temp = this.renderedImages[idx1]
        this.renderedImages[idx1] = this.renderedImages[idx2]
        this.renderedImages[idx2] = temp


        if (this.verifyIfFinished() === true) {
            this.renderedImages.forEach(image => {
                image.img.setInteractive({ useHandCursor: false })
                image.img.tint = 0xd3b6b6
                setTimeout(() => image.img.tint = 0xffffff, 500)
            })
            setTimeout(() =>
                this.scene.start("StoryFinalScene", { points: 10 }), 2000)
        }
    }

    update(): void {

    }


    verifyIfFinished(): boolean {
        for (let i = 1; i <= this.TOTAL_IMGS_NO; i++) {
            if (this.renderedImages[i - 1].name !== ("img" + i)) return false;
        }
        return true;
    }
}