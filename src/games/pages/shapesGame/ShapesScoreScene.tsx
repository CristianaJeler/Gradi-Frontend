import "phaser";
import { Storage } from "@capacitor/core";

export class ShapesScoreScene extends Phaser.Scene {
    score: number | undefined;
    activityId: string | undefined;

    constructor(activityId?: string) {
        super({
            key: "ShapesScoreScene"
        });
        console.log(activityId)
        if (activityId) this.activityId = activityId
    }
    preload(): void {
        this.load.setBaseURL("http://192.168.0.186:5500/src/games/pages/shapesGame/")
        this.load.image("shapes", "assets/wellcome_background.png");
    }
    init(params: any): void {
        this.score = params.points;
        const storeScore = async () => {
            const scores = await Storage.get({ key: "gamesResults_" + this.activityId });
            const scoresList = [...JSON.parse(scores.value || '[]')];

            let idx = scoresList.findIndex(e => e.game === "Forme geometrice")
            if (idx === -1) scoresList.push({ game: "Forme geometrice", result: this.score })
            else scoresList.splice(idx, 1, { game: "Forme geometrice", result: this.score })

            if (this.activityId) {
                await Storage.set({ key: "gamesResults_" + this.activityId, value: JSON.stringify(scoresList) })
            }
        }
        storeScore();
    }

    create(): void {
        this.add.image(450, 250, 'shapes')

        let resultText: string = 'Felicitări!\nAi ' + this.score + ' puncte!';
        this.add.text(300, 150, resultText,
            { font: '75px Arial Bold', color: '#FBFBAC', align: 'center' });
    }
};