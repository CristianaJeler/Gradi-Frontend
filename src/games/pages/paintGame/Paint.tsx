import { IonContent } from "@ionic/react";
import React, { useEffect } from "react";
import * as Phaser from 'phaser';
import "./paint.game.css"
import { PaintWelcomeScene } from "./PaintWelcomeScene"
import { PaintGameScene } from "./PaintGameScene"
import { PaintFinalScene } from "./PaintFinalScene"
import { RouteComponentProps } from "react-router";

export class PaintGame extends Phaser.Game {
    constructor(config: any) {
        super(config);
    }
}
interface urlDetails {
    act: string;
}
export const Paint: React.FC<RouteComponentProps<urlDetails>> = (props) => {
    useEffect(() => {
        new PaintGame({
            title: "Paint",
            width: 900,
            height: 500,
            parent: "paintGameParent",
            scene: [PaintWelcomeScene, new PaintGameScene(props.match.params.act), PaintFinalScene],
            physics: {
                default: "arcade",
                arcade: {
                    debug: false
                }
            },
            backgroundColor: "transparent"
        });
    }, [props.match.params.act])
    return (
        <IonContent id={"pageContent"}>
            <div id={'paintGameParent'} />
        </IonContent>
    )
};
export default Paint;