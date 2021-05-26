import React, { useEffect } from "react";
import {
    IonHeader,
    IonIcon, IonImg,
    IonItem, IonLabel,
    IonToolbar
} from "@ionic/react";
import {
    extensionPuzzle,
    peopleCircle,
} from "ionicons/icons";
import "../../genericUser/design/menu.css"
import "../../genericUser/design/general.header.css"
import logo from "../../assets/img/favicon.png";
import { SettingsPopover } from "../../genericUser/components/SettingsPopover";
import { NotificationsPopover } from "../../genericUser/components/NotificationsPopover";

export const TeacherMenuBar: React.FC = () => {
    useEffect(() => {
        return () => {
            console.log("Unmounted TeacherMenuBar component");
        };
    }, []);
    return (
        <>
            <IonHeader>
                <IonToolbar id={"header"}>
                    <IonImg id={"img"} src={logo} onClick={() => window.location.href = "/home"} title={"Acasă"} />
                    <IonItem class={"menuButton"} lines={"none"} routerLink={"/teachers/groups"}>
                        <IonLabel><IonIcon slot="start" icon={peopleCircle} class={"menuIcon"} /> Grupe</IonLabel>
                    </IonItem>
                    <IonItem class={"menuButton"} lines={"none"} >
                        <IonLabel><IonIcon slot="start" icon={extensionPuzzle} class={"menuIcon"} /> Jocuri</IonLabel>
                    </IonItem>
                    {/* <NotificationsPopover/> */}
                    <SettingsPopover userType={"teachers"} />
                </IonToolbar>
            </IonHeader>
        </>
    )
};