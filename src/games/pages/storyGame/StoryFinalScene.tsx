import "phaser";
import { Storage } from "@capacitor/core";

export class StoryFinalScene extends Phaser.Scene {
    score: number | undefined;
    activityId: string | undefined;

    constructor(activityId?: string) {
        super({
            key: "StoryFinalScene"
        });
        if (activityId) this.activityId = activityId
    }
    preload(): void {
        this.load.setBaseURL("http://192.168.0.186:5500/src/games/pages/storyGame/")
        this.load.image("final", "assets/final.png")

    }
    init(params: any): void {
        this.score = params.points;
        const storeScore = async () => {
            const scores = await Storage.get({ key: "gamesResults_" + this.activityId });
            const scoresList = [...JSON.parse(scores.value || '[]')];

            let idx = scoresList.findIndex(e => e.game === "Puzzle poveste")
            if (idx === -1) scoresList.push({ game: "Puzzle poveste", result: this.score })
            else scoresList.splice(idx, 1, { game: "Puzzle poveste", result: this.score })

            if (this.activityId) {
                await Storage.set({ key: "gamesResults_" + this.activityId, value: JSON.stringify(scoresList) })
            }
        }
        storeScore();
    }

    create(): void {
        this.cameras.main.setBackgroundColor(0xffffff)
        this.add.image(390, 250, "final").setScale(0.8)
    }
};