import { IonContent } from "@ionic/react";
import React, { useEffect } from "react";
import * as Phaser from 'phaser';
import "./pe.game.css"
import { AnimationWelcomeScene } from "./PEWelcomeScene"
import { AnimationGameScene } from "./PEGameScene"
import { AnimationScoreScene } from "./PEScoreScene"

export class AnimationGame extends Phaser.Game {
    constructor(config: any) {
        super(config);
    }
}
interface urlDetails {
    act: string;
}
export const Animation: React.FC<urlDetails> = (props) => {
    useEffect(() => {
        new AnimationGame({
            title: "Animation",
            width: 900,
            height: 500,
            parent: "animationGameParent",
            scene: [AnimationWelcomeScene, AnimationGameScene, new AnimationScoreScene(props.act)],
            physics: {
                default: "arcade",
                arcade: {
                    debug: false
                }
            },
            backgroundColor: "#ffffff"
        });
    }, [props.act])
    return (
        <IonContent id={"pageContent"}>
            <div id={'animationGameParent'} />
        </IonContent>
    )
};
export default Animation;