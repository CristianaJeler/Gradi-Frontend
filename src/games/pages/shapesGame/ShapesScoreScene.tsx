import "phaser";
import {Storage} from "@capacitor/core";

export class ShapesScoreScene extends Phaser.Scene {
    score: number | undefined;
    result: Phaser.GameObjects.Text | undefined;
    hint: Phaser.GameObjects.Text | undefined;
    activityId: string | undefined;

    constructor(activityId?: string) {
        super({
            key: "ScoreScene"
        });
        if (activityId) this.activityId = activityId
    }

    init(params: any): void {
        this.score = params.starsCaught;
        const storeScore = async () => {
            const scores = await Storage.get({key: "gamesResults"});
            const scoresList = JSON.parse(scores.value || '[]');
            if(!scoresList.includes((sc:{game:string, score:number})=>sc.game==="Starfall"))
                scoresList.push({game: "Starfall", result: this.score})
            if(this.activityId) await Storage.set({key: "gamesResults_" + this.activityId, value: JSON.stringify(scoresList)})
        }
        storeScore();
    }

    create(): void {
        let resultText: string = 'Your score is ' + this.score + '!';
        this.result = this.add.text(200, 250, resultText,
            {font: '48px Arial Bold', color: '#FBFBAC'});
        let hintText: string = "Click to restart";
        this.hint = this.add.text(300, 350, hintText,
            {font: '24px Arial Bold', color: '#FBFBAC'});
        this.input.on('pointerdown', (/*pointer*/) => {
            this.scene.start("WelcomeScene");
        }, this);
    }
};