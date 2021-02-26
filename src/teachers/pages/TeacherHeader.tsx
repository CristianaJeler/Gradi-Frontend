import React, {useContext} from "react";
import {IonHeader, IonIcon, IonImg,
   IonMenuButton,  IonToolbar, IonMenuToggle, IonMenu, IonTitle, IonContent, IonList, IonItem, IonButtons} from "@ionic/react";
import "./design/teachers.header.css"
export const TeacherHeader: React.FC = () => {

    return (
        <>
            <IonHeader>
                <IonToolbar id={"header"}>
                    <IonImg id={"img"} src={"../../../assets/img/favicon.ico"}/>
                    <IonButtons slot="start">
                        <IonMenuButton color="dark"/>
                    </IonButtons>

                </IonToolbar>
            </IonHeader>
        </>
    )
};