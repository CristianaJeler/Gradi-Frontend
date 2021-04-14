import React, {useContext, useEffect, useState} from "react";
import {
    IonImg, IonIcon, IonPopover, IonList, IonItem, IonLabel, IonCardSubtitle, IonCard, IonBadge, IonButton
} from "@ionic/react";
// import "../design/general.header.css"
import "../design/notifications.button.css"
import {logOut, notifications} from "ionicons/icons";
import {LoginContext} from "../../authentication";
import {PopoverEvent} from "../../pupils/pages/PupilMenuBar";

export const NotificationsPopover: React.FC = () => {
    const {logout} = useContext(LoginContext)
    const [showPopover, setShowPopover] = useState<PopoverEvent>({show: false, event: undefined})

    const handleLogout = () => {
        logout && logout();
    }


    return (
        <>
            <div id={"notificationsButton"} slot={"end"}
                     onClick={(event) => setShowPopover({show: true, event: event.nativeEvent})}>
                    <IonBadge color={"danger"} id={"notificationBadge"} hidden={false}> </IonBadge>
                    <IonIcon slot="start" icon={notifications} id={"notificationsIcon"}>
                        <IonPopover isOpen={showPopover.show} animated={true}
                                    onDidDismiss={() => setShowPopover({show: false, event: undefined})}
                                    event={showPopover.event} id={"userPopover"}>
                            <IonList>
                                <IonItem lines={"none"} onClick={handleLogout} class={"popoverItem"}>
                                    <IonLabel>
                                        <IonIcon slot="start" icon={logOut} class={"menuIcon"}/>
                                        Deconectare
                                    </IonLabel>
                                </IonItem>
                            </IonList>
                        </IonPopover>
                    </IonIcon>
            </div>
        </>
    )
};