import React, {useContext, useEffect, useState} from "react";
import {IonImg, IonIcon, IonPopover, IonList, IonItem, IonLabel, IonCardSubtitle, IonCard
} from "@ionic/react";
import "../design/general.header.css"
import {help, logOut, settings} from "ionicons/icons";
import {LoginContext} from "../../authentication";
import {PopoverEvent} from "../../pupils/pages/PupilMenuBar";
import {UserContext} from "../provider/GenericUserProvider";
import defaultProfilePic from "../../assets/img/profile.png";
import {PICTURE_TYPE} from "../utils/pictureType";
export const SettingsPopover: React.FC<{userType:string}> = (usertype) => {
    const {logout} = useContext(LoginContext)
    const [showPopover, setShowPopover] = useState<PopoverEvent>({show:false,event:undefined})
    const {firstName, lastName, picture}=useContext(UserContext)
    const [menuPic, setMenuPic]=useState(defaultProfilePic);
    // const [canceled, setCanceled]=useState(false);
    // useEffect(()=>{},[canceled])
    useEffect(()=>{
        if(picture)
            if(picture.startsWith(PICTURE_TYPE)) setMenuPic(picture)
            else setMenuPic(PICTURE_TYPE+picture)
        else setMenuPic(defaultProfilePic)
    }, [picture])

    const handleLogout = () => {
        logout && logout();
    }


    return (
        <>
            <IonItem id={"settingsButton"} slot={"end"} lines={"none"}>
                <IonIcon slot="start" icon={settings} id={"settingsIcon"} onClick={(event) => setShowPopover({show:true,event:event.nativeEvent})}>
                    <IonPopover isOpen={showPopover.show} animated={true} onDidDismiss={() => setShowPopover({show:false,event:undefined})} event={showPopover.event} id={"userPopover"}>
                        <IonCard id={"menuPhotoAndNameCard"}>
                            <br/>
                            {menuPic && <IonImg alt={"Profile picture"} id={"user_img"} src={menuPic}/>}
                            {firstName && lastName && <IonCardSubtitle id={"profileMail"}>{firstName} {lastName}</IonCardSubtitle>}
                            <br/>
                        </IonCard>
                        <IonList>
                            {/*<IonItem lines={"none"} routerLink={"/"+usertype.userType+"/help"} class={"popoverItem"}>*/}
                            {/*    <IonLabel><IonIcon slot="start" icon={help}*/}
                            {/*                       class={"menuIcon"}/>Ajutor</IonLabel>*/}
                            {/*</IonItem>*/}
                            <IonItem lines={"none"} routerLink={"/"+usertype.userType+"/settings"} class={"popoverItem"}>
                                <IonLabel><IonIcon slot="start" icon={settings} class={"menuIcon"}/> Setări și
                                    confidențialitate</IonLabel>
                            </IonItem>
                            <IonItem lines={"none"} onClick={handleLogout} class={"popoverItem"}>
                                <IonLabel><IonIcon slot="start" icon={logOut}
                                                   class={"menuIcon"}/>Deconectare</IonLabel>
                            </IonItem>
                        </IonList>
                    </IonPopover>
                </IonIcon>
            </IonItem>
        </>
    )
};