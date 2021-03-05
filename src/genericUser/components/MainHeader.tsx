import React from "react";
import {IonHeader, IonImg,
   IonMenuButton,  IonToolbar, IonButtons} from "@ionic/react";
import "../design/general.header.css"
import logo from "../../assets/img/favicon.png"
export const MainHeader: React.FC = () => {
    return (
        <>
            <IonHeader>
                <IonToolbar id={"header"}>
                    <IonImg id={"img"} src={logo} onClick={()=>window.location.href="/teachers"}/>

                    <IonButtons slot="start">
                        <IonMenuButton/>
                    </IonButtons>

                </IonToolbar>
            </IonHeader>
        </>
    )
};