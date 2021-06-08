import { infinite } from "ionicons/icons";

export class AnimationWelcomeScene extends Phaser.Scene {
    title: Phaser.GameObjects.Text | undefined;
    startButton: Phaser.GameObjects.Image | undefined;
    runner?: Phaser.GameObjects.Sprite;
    runAndJump?: Phaser.GameObjects.Sprite;
    biker?: Phaser.GameObjects.Sprite;
    constructor() {
        super({
            key: "WelcomeScene"
        });
    }
    preload(): void {
        this.load.setBaseURL("http://192.168.0.186:5500/src/games/pages/PEGame/")
        // this.load.image('startButton', 'assets/play_btn.png');
        // this.load.image('background', 'assets/wellcome_background.png')
        // this.load.spritesheet('nice', 'assets/girl.jpg', { frameWidth: 260, frameHeight: 325, spacing: 10 });
        this.load.spritesheet('running_boy', 'assets/running_boy.jpg', { frameWidth: 130, frameHeight: 210, spacing: 10 });
        this.load.spritesheet('run_jump', 'assets/run_jump.png', { frameWidth: 117, frameHeight: 330, spacing: 10 });
        this.load.spritesheet('bike', 'assets/bike.jpg', { frameWidth: 125, frameHeight: 125, spacing: 10 });

    }
    create(): void {
        //     this.add.image(450, 250, 'background');

        //     const titleText: string = "Forme\ngeometrice";
        //     this.title = this.add.text(300, 90, titleText,
        //         { font: '70px Arial Bold', color: '#0b305b', align: 'center' });

        //     this.startButton = this.add.image(470, 300, 'startButton').setInteractive({ useHandCursor: true });
        //     this.startButton.scaleX = 0.15;
        //     this.startButton.scaleY = 0.15;
        //     this.startButton.on('pointerdown', () => {
        //         this.scene.start("AnimationGameScene");
        //     }, this);
        // }


        this.runner = this.add.sprite(200, 200, "running_boy");
        this.runAndJump = this.add.sprite(400, 200, "run_jump")
        this.biker = this.add.sprite(600, 200, "bike")

        this.anims.create({
            key: "run",
            frameRate: 7,
            frames: this.anims.generateFrameNames("running_boy", { start: 0, end: 8 }),
            repeat: -1
        });

        this.anims.create({
            key: "runAndJump",
            frameRate: 7,
            frames: this.anims.generateFrameNames("run_jump", { start: 0, end: 13 }),
            repeat: -1
        });

        this.anims.create({
            key: "ride",
            frameRate: 7,
            frames: this.anims.generateFrameNames("bike", { start: 0, end: 4 }),
            repeat: -1
        });

        this.runAndJump.play("runAndJump")
        this.runner.play("run");
        this.biker.play("ride");

        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.runner?.play("run");
                this.runAndJump?.play("runAndJump")
                this.biker?.play("ride");
            }
        });
    }
}