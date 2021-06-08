import { IonContent } from "@ionic/react";
import React, { useEffect } from "react";
import * as Phaser from 'phaser';
import "./story.game.css"
import { StoryWelcomeScene } from "./StoryWelcomeScene"
import { StoryGameScene } from "./StoryGameScene"
import { StoryFinalScene } from "./StoryFinalScene"
import { RouteComponentProps } from "react-router";

export class StoryGame extends Phaser.Game {
    constructor(config: any) {
        super(config);
    }
}
interface urlDetails {
    act: string;
}
export const Story: React.FC<RouteComponentProps<urlDetails>> = (props) => {
    useEffect(() => {
        new StoryGame({
            title: "Story",
            width: 900,
            height: 500,
            parent: "storyGameParent",
            scene: [StoryWelcomeScene, StoryGameScene, new StoryFinalScene(props.match.params.act)],
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
            <div id={'storyGameParent'} />
        </IonContent>
    )
};
export default Story;