import React, {useContext, useEffect, useState} from "react";
import {
    IonImg, IonIcon, IonPopover, IonList, IonItem, IonLabel, IonCardSubtitle, IonCard, IonBadge, IonButton
} from "@ionic/react";
// import "../design/general.header.css"
import "../design/notifications.button.css"
import {logOut, notifications, notificationsOff} from "ionicons/icons";
import {LoginContext} from "../../authentication";
import {PopoverEvent} from "../../pupils/pages/PupilMenuBar";

export const NotificationsPopover: React.FC = () => {
    const [showPopover, setShowPopover] = useState<PopoverEvent>({show: false, event: undefined})

    return (
        <>
            <div id={"notificationsButton"} slot={"end"}
                     onClick={(event) => setShowPopover({show: true, event: event.nativeEvent})}>
                    {/*<IonBadge color={"danger"} id={"notificationBadge"} hidden={false}> </IonBadge>*/}
                    <IonIcon slot="start" icon={notificationsOff} id={"notificationsIcon"}>
                        <IonPopover isOpen={showPopover.show} animated={true}
                                    onDidDismiss={() => setShowPopover({show: false, event: undefined})}
                                    event={showPopover.event} id={"userPopover"}>
                            <IonList>
                                <IonItem lines={"none"}>
                                    <IonCardSubtitle>Nu există notificări</IonCardSubtitle>
                                </IonItem>
                            </IonList>
                        </IonPopover>
                    </IonIcon>
            </div>
        </>
    )
};