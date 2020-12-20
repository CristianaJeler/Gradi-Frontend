import React from "react";
import {IonHeader, IonImg, IonToolbar} from "@ionic/react";
import "./login.header.css"
export const LoginHeader: React.FC = () => {
    return (
        <>
            <IonHeader>
                <IonToolbar id={"header"}>
                <IonImg src={"./favicon.ico"} id={"img"}/>
                </IonToolbar>
            </IonHeader>
        </>
    )
};