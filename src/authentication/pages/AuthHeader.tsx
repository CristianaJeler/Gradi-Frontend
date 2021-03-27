import React from "react";
import {IonHeader, IonImg, IonToolbar} from "@ionic/react";
import "./design/login.header.css"
import logo from "../../assets/img/favicon.png"
export const AuthHeader: React.FC = () => {
    return (
        <>
            <IonHeader>
                <IonToolbar id={"header"}>
                <IonImg id={"img"} src={logo} onClick={()=>window.location.href="/home"}/>
                </IonToolbar>
            </IonHeader>
        </>
    )
};