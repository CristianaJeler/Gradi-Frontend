import {IonContent, IonPage} from "@ionic/react";
import React, {useEffect} from "react";
import {Footer} from "../../../genericUser/components/Footer";
import {TeacherMenuBar} from "../../../teachers/pages/TeacherMenuBar";
import * as Phaser from 'phaser';
import {ShapesGameScene} from "./ShapesGameScene";
import {ShapesWelcomeScene} from "./ShapesWelcomeScene";
import {ShapesScoreScene} from "./ShapesScoreScene";
import {RouteComponentProps} from "react-router-dom";


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
        new ShapesGame({
            title: "Shapes",
            width: 800,
            height: 650,
            parent: "shapesGameParent",
            scene: [ShapesWelcomeScene, ShapesGameScene, new ShapesScoreScene(props.match.params.act)],
            physics: {
                default: "arcade",
                arcade: {
                    debug: false
                }
            },
            backgroundColor: "#8193ef"
        });

    }, [props.match.params.act])


    return (
        <IonPage>
            <TeacherMenuBar/>
            <IonContent>
                <IonContent scrollY={false} id={'shapesGameParent'}/>
                {/*<IonContent scrollY={false} id={"descriptionContent"}>*/}
                {/*    <IonTitle size={"large"}>Stelute</IonTitle>*/}
                {/*</IonContent>*/}
            </IonContent>
            <Footer/>
        </IonPage>
    )
};
export default Shapes;