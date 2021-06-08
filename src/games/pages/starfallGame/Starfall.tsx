import { IonContent, IonIcon, IonItem, IonPage, IonText, IonTitle } from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { Footer } from "../../../genericUser/components/Footer";
import { TeacherMenuBar } from "../../../teachers/pages/TeacherMenuBar";
import * as Phaser from 'phaser';
import { GameScene } from "./GameScene";
import { WelcomeScene } from "./WelcomeScene";
import { ScoreScene } from "./ScoreScene";
import { RouteComponentProps } from "react-router-dom";
import "./starfall.page.css"

export class StarfallGame extends Phaser.Game {
    constructor(config: any) {
        super(config);
    }
}
interface urlDetails {
    act: string;
}
export const Starfall: React.FC<RouteComponentProps<urlDetails>> = (props) => {
    useEffect(() => {
        new StarfallGame({
            title: "Starfall",
            width: 800,
            height: 650,
            parent: "starfallGameParent",
            scene: [WelcomeScene, GameScene, new ScoreScene(props.match.params.act)],
            physics: {
                default: "arcade",
                arcade: {
                    debug: false
                }
            },
            backgroundColor: "#18216D"
        });

    }, [props.match.params.act])


    return (
        <IonPage>
            {/* <TeacherMenuBar /> */}
            <IonContent id="pageContent">
                <div id={'starfallGameParent'} />
                {/* <IonContent scrollY={false} id={"descriptionContent"}>
                    <IonTitle size={"large"}>Stelute</IonTitle>
                </IonContent> */}
                {/* <Footer /> */}
            </IonContent>
        </IonPage>
    )
};
export default Starfall;