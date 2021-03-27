import {IonContent, IonPage} from "@ionic/react";
import React, {useEffect} from "react";
import { Footer } from "../../genericUser/components/Footer";
import {TeacherMenuBar} from "../../teachers/pages/TeacherMenuBar";
import * as Phaser from 'phaser';
import {GameScene} from "./GemaScene";
import {WelcomeScene} from "./WelcomeScene";
import {ScoreScene} from "./ScoreScene";


export const TeacherHome: React.FC = () => {

    // const initGame = (parent: string) => {
    //     return new Phaser.Game(config(parent))
    // }
    // initGame('game-root')

    const config = {
        title: "Starfall",
        width: 800,
        height: 600,
        parent: "game-root",
        scene: [WelcomeScene, GameScene, ScoreScene],
        physics: {
            default: "arcade",
            arcade: {
                debug: false
            }
        },
        backgroundColor: "#18216D"
    };
    class StarfallGame extends Phaser.Game {
        constructor(config:any) {
            super(config);
        }
    }
    useEffect(function initGame(){
        var game = new StarfallGame(config);
    },[])



    return (
        <IonPage>
            <TeacherMenuBar/>
            <IonContent>
                <div id={'game-root'}/>
                <Footer/>
            </IonContent>
        </IonPage>
    )
};
export default TeacherHome;