import React from "react";
import {IonHeader, IonImg, IonToolbar} from "@ionic/react";
import "./login.header.css"
export const AuthHeader: React.FC = () => {
    return (
        <>
            <IonHeader>
                <IonToolbar id={"header"}>
                <IonImg id={"img"} src={"../../../assets/img/pencils.jpg"}/>
                </IonToolbar>
            </IonHeader>
        </>
    )
};