import React, {useContext, useState} from "react";
import {
    IonButton, IonHeader,
    IonIcon, IonImg,
    IonItem, IonLabel, IonList, IonPopover,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import {
    extensionPuzzle,
    help,
    home,
    logOut,
    peopleCircle,
    settings
} from "ionicons/icons";
import {LoginContext} from "../../authentication";
import "../../genericUser/design/menu.css"
import "../../genericUser/design/general.header.css"
import logo from "../../assets/img/favicon.png";
import {PopoverEvent} from "../../pupils/pages/PupilMenuBar";
import {SettingsPopover} from "../../genericUser/components/SettingsPopover";

export const TeacherMenuBar: React.FC = () => {
    return (
        <>
            <IonHeader>
                <IonToolbar id={"header"}>
                    <IonImg id={"img"} src={logo} onClick={() => window.location.href = "/home"} title={"Acasă"}/>
                    <IonItem class={"menuButton"} lines={"none"} routerLink={"/teachers/groups"}>
                        <IonLabel><IonIcon slot="start" icon={peopleCircle} class={"menuIcon"}/> Grupele mele</IonLabel>
                    </IonItem>
                    <IonItem class={"menuButton"} lines={"none"} >
                        <IonLabel><IonIcon slot="start" icon={extensionPuzzle} class={"menuIcon"}/> Activități</IonLabel>
                    </IonItem>
                    <SettingsPopover userType={"teachers"}/>
                </IonToolbar>
            </IonHeader>
        </>
    )
};