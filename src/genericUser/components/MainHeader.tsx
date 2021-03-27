import React from "react";
import {IonHeader, IonImg,
     IonToolbar, IonButtons, IonButton} from "@ionic/react";
import "../design/general.header.css"
import logo from "../../assets/img/favicon.png"
export const MainHeader: React.FC = () => {
    return (
        <>
            <IonHeader>
                <IonToolbar id={"header"}>
                    <IonImg id={"img"} src={logo} onClick={()=>window.location.href="/homepage"}/>

                    <IonButtons slot="end">
                        <IonButton routerLink={"/login"}>
                            LOGIN
                        </IonButton>
                        <IonButton routerLink={"signup"}>
                            SIGNUP
                        </IonButton>
                    </IonButtons>

                </IonToolbar>
            </IonHeader>
        </>
    )
};