import React, {useContext, useEffect} from "react";
import {RouteComponentProps} from "react-router-dom";
import {
    IonButtons,
    IonImg,
    IonContent,
    IonHeader,
    IonCardSubtitle,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonMenu,
    IonMenuButton,
    IonMenuToggle,
    IonPage,
    IonRouterOutlet,
    IonTitle,
    IonToolbar,
    IonCard
} from "@ionic/react";
import {TeacherHeader} from "./TeacherHeader";
import {book, home, list, logOut, settings, timer} from "ionicons/icons";
import {LoginContext} from "../../authentication";
import "./design/teachers.home.css"

export const TeacherHome: React.FC<RouteComponentProps> = () => {
    // const game = {
    //     width: "50%",
    //     height: "50%",
    //     type: Phaser.AUTO,
    //     scene: [MainScene]
    // }
    const {logout, username, password} = useContext(LoginContext)
    const handleLogout = () => {
        logout && logout(username, password)
    }
    return (
        <IonPage>
            <TeacherHeader/>
            <IonMenu side="start" menuId="myMenu" contentId="content" type={"push"}>
                <IonHeader>
                    <IonToolbar color="warning">
                        <IonTitle>Meniu</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent color="default">
                    <IonList>
                        <IonMenuToggle autoHide={false} slot={"start"}>
                            <IonCard>
                                <IonImg alt={"Profile picture"} id={"user_img"} src={"../Untitled.png"}/>
                                <IonCardSubtitle>user@gmail.com</IonCardSubtitle>
                            </IonCard>

                            <IonItem>
                                <IonIcon slot="start" icon={home} color={"warning"}/>
                                <IonLabel>Acasă</IonLabel>
                            </IonItem>
                            <IonItem>
                                <IonIcon slot="start" icon={timer} color={"warning"}/>
                                <IonLabel>Planificări</IonLabel>
                            </IonItem>
                            <IonItem>
                                <IonIcon slot="start" icon={book} color={"warning"}/>
                                <IonLabel>Catalog</IonLabel>
                            </IonItem>
                            <IonItem>
                                <IonIcon slot="start" icon={settings} color={"warning"}/>
                                <IonLabel>Setări & Cont</IonLabel>
                            </IonItem>
                            <IonItem onClick={handleLogout}>
                                <IonIcon slot="start" icon={logOut} color={"warning"}/>
                                <IonLabel>Deconectare</IonLabel>
                            </IonItem>
                        </IonMenuToggle>
                    </IonList>
                </IonContent>
            </IonMenu>
            <IonRouterOutlet id="content"/>
        </IonPage>
    )
};
export default TeacherHome;