import { IonContent, IonPage } from "@ionic/react";
import React, { useEffect } from "react";
import { Footer } from "../../../genericUser/components/Footer";
import { TeacherMenuBar } from "../../../teachers/pages/TeacherMenuBar";
import * as Phaser from 'phaser';
import { ShapesGameScene } from "./ShapesGameScene";
import { ShapesWelcomeScene } from "./ShapesWelcomeScene";
import { ShapesScoreScene } from "./ShapesScoreScene";
import { RouteComponentProps } from "react-router-dom";
import "./shapes.game.css"

export class ShapesGame extends Phaser.Game {
    constructor(config: any) {
        super(config);
    }
}
interface urlDetails {
    act: string;
}
export const Shapes: React.FC<RouteComponentProps<urlDetails>> = (props) => {
    useEffect(() => {
        console.log(props.match.params.act)
        new ShapesGame({
            title: "Shapes",
            width: 900,
            height: 500,
            parent: "shapesGameParent",
            scene: [ShapesWelcomeScene, ShapesGameScene, new ShapesScoreScene(props.match.params.act)],
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
        // <IonPage>
        //     <TeacherMenuBar />
        <IonContent id={"pageContent"}>
            <div id={'shapesGameParent'} />
        </IonContent>
        //     <Footer />
        // </IonPage>
    )
};
export default Shapes;