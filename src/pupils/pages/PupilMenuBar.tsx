import React, {useContext, useState} from "react";
import {
    IonButton, IonHeader,
    IonIcon, IonImg,
    IonItem, IonLabel,
    IonList,
    IonPopover,
    IonTitle,
    IonToolbar,
} from "@ionic/react";
import {
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
import {SettingsPopover} from "../../genericUser/components/SettingsPopover";
export interface PopoverEvent{
    show:boolean,
    event:Event|undefined
}
export const PupilMenuBar: React.FC = () => {
    return (
        <>
            <IonHeader>
                <IonToolbar id={"header"}>
                    <IonImg id={"img"} src={logo} onClick={() => window.location.href = "/home"} title={"Acasă"}/>
                    <IonItem class={"menuButton"} lines={"none"} routerLink={"/pupils/groups"}>
                        <IonLabel><IonIcon slot="start" icon={peopleCircle} class={"menuIcon"}/> Grupele mele</IonLabel>
                    </IonItem>
                    <SettingsPopover userType={"pupils"}/>
                </IonToolbar>
            </IonHeader>
        </>
    )
};