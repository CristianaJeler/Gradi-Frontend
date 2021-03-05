import React, {useContext, useEffect, useState} from "react";
import {
    IonCard,
    IonCardSubtitle,
    IonContent,
    IonHeader, IonIcon,
    IonImg, IonItem, IonLabel,
    IonList, IonMenu,
    IonMenuToggle, IonRouterOutlet,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import defaultProfilePic from "../../assets/img/profile.png";
import {
    help,
    home,
    logOut,
    peopleCircle,
    settings
} from "ionicons/icons";
import {LoginContext} from "../../authentication";
import {UserContext} from "../../genericUser/provider/GenericUserProvider";
import {PICTURE_TYPE} from "../../genericUser/utils/pictureType";
import "../../genericUser/design/menu.css"

export const PupilSideMenu: React.FC = () => {
    const {firstName, lastName, picture}=useContext(UserContext)
    const {logout} = useContext(LoginContext)
    const [menuPic, setMenuPic]=useState(defaultProfilePic);
    const handleLogout = () => {
        logout && logout()
    }

    useEffect(()=>{
        if(picture)
            if(picture.startsWith(PICTURE_TYPE)) setMenuPic(picture)
            else setMenuPic(PICTURE_TYPE+picture)
        else setMenuPic(defaultProfilePic)
    }, [picture])



    return (
        <>
            <IonMenu side="start" id="myMenu" contentId="content" type={"overlay"}>
                <IonHeader id={"menuHeader"}>
                    <IonToolbar>
                        <IonTitle>Meniu</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent color="default">
                    <IonList>
                        <IonMenuToggle autoHide={false} slot={"start"}>
                            <IonCard id={"menuPhotoAndNameCard"}>
                                {/*{(!menuPic || menuPic.length===0) && <IonImg alt={"Profile picture"} id={"user_img"} src={defaultProfilePic}/>}*/}
                                {menuPic && <IonImg alt={"Profile picture"} id={"user_img"} src={menuPic}/>}
                                {firstName && lastName && <IonCardSubtitle id={"profileMail"}>{firstName} {lastName}</IonCardSubtitle>}
                            </IonCard>

                            <IonItem class={"menuItem"} routerLink={"/pupils"}>
                                <IonIcon slot="start" icon={home} class={"menuIcon"}/>
                                <IonLabel>Acasă</IonLabel>
                            </IonItem>
                            {/*<IonItem class={"menuItem"}>*/}
                            {/*    <IonIcon slot="start" icon={timer} class={"menuIcon"}/>*/}
                            {/*    <IonLabel>Planificări</IonLabel>*/}
                            {/*</IonItem>*/}
                            {/*<IonItem class={"menuItem"}>*/}
                            {/*    <IonIcon slot="start" icon={book} class={"menuIcon"}/>*/}
                            {/*    <IonLabel>Catalog</IonLabel>*/}
                            {/*</IonItem>*/}
                            <IonItem class={"menuItem"}>
                                <IonIcon slot="start" icon={peopleCircle} class={"menuIcon"}/>
                                <IonLabel>Grupele mele</IonLabel>
                            </IonItem>
                            <IonItem class={"menuItem"} routerLink={"/pupils/settings"}>
                                <IonIcon slot="start" icon={settings} class={"menuIcon"}/>
                                <IonLabel>Setări & Cont</IonLabel>
                            </IonItem>
                            <IonItem onClick={handleLogout} class={"menuItem"}>
                                <IonIcon slot="start" icon={logOut} class={"menuIcon"}/>
                                <IonLabel>Deconectare</IonLabel>
                            </IonItem>

                            <IonItem class={"menuItem"} routerLink={"/pupils/help"}>
                                <IonIcon slot="start" icon={help} class={"menuIcon"}/>
                                <IonLabel>Ajutor</IonLabel>
                            </IonItem>
                        </IonMenuToggle>
                    </IonList>
                </IonContent>
            </IonMenu>
            <IonRouterOutlet id="content"/>
        </>
    )
};