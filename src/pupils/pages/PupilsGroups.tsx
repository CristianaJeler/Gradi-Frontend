import React, {useContext, useEffect, useState} from "react";
import {
    IonAlert, IonAvatar,
    IonButton,
    IonCard,
    IonCardSubtitle,
    IonCardTitle,
    IonContent,
    IonFabButton, IonIcon,
    IonImg,
    IonInput,
    IonLabel,
    IonLoading,
    IonModal,
    IonPage,
    IonText,
    IonTitle,
} from "@ionic/react";
import "./design/pupils.groups.css"
import Footer from "../../genericUser/components/Footer";
import {PupilMenuBar} from "./PupilMenuBar";
import {GroupContext} from "../../groups/provider/GroupsProvider";
import bee from "../../groups/defaultGroupsImgs/bee.png"
import butterfly from "../../groups/defaultGroupsImgs/butterfly.png"
import flower from "../../groups/defaultGroupsImgs/flower.png"
import ladybug from "../../groups/defaultGroupsImgs/ladybug.png"
import bear from "../../groups/defaultGroupsImgs/bear.png"
import house from "../../groups/defaultGroupsImgs/house.png"
import kids from "../../groups/defaultGroupsImgs/kids.png"
import turtle from "../../groups/defaultGroupsImgs/turtle.png"
import chick from "../../groups/defaultGroupsImgs/chick.png"

const imgs = [["bee", bee], ["butterfly", butterfly], ["flower", flower]
    , ["ladybug", ladybug], ["bear", bear], ["house", house], ["turtle", turtle], ["chick", chick]]

export const PupilsGroups: React.FC = () => {
    const {groups, fetchingGroupsListError, fetchingGroupsList, fetchGroups} = useContext(GroupContext);
    useEffect(()=>{
        fetchGroups && fetchGroups()
    }, [fetchGroups])
    return (
        <IonPage>
            <PupilMenuBar/>
            <IonContent id="pupilsGroupPageContent">
                <IonTitle id={"groupsTitle"}>Grupe</IonTitle>
                <div id={"pageContent"}>
                    {groups && groups.map(x =>
                        <IonCard class={"groupCard"} key={x.id} routerLink={'/pupils/groups/' + x.id}>
                            <br/>
                            {x.img && <IonAvatar  class={"groupImg"}>
                                <img src={imgs[imgs.findIndex(el => el[0] === x.img)][1]} alt={"Fotografia grupei"}/>
                            </IonAvatar>}
                            {!x.img && <IonAvatar  class={"groupImg"}>
                                <img src={kids} alt={"Fotografia grupei"}/>
                            </IonAvatar>}
                            <br/>
                            <IonCardTitle class={"groupInfo"}>{x.name}</IonCardTitle>
                        </IonCard>)}
                </div>
                <Footer/>
            </IonContent>
            {fetchingGroupsList && <IonLoading isOpen={true} message={"Încărcăm datele grupelor dumneavoastră!"}/>}
            {fetchingGroupsListError &&
            <IonAlert isOpen={true} message={"A apărut o eroare la încărcarea grupelor dumneavoastră!"}/>}
        </IonPage>
    )
};
export default PupilsGroups;