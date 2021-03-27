import React, {useContext, useEffect, useState} from "react";
import {
    IonAlert,
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
import "./design/teachers.groups.css"
import Footer from "../../genericUser/components/Footer";
import {TeacherMenuBar} from "./TeacherMenuBar";
import {add} from "ionicons/icons";
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
import squirrel from "../../groups/defaultGroupsImgs/squirrel.png"

const imgs = [["bee", bee], ["butterfly", butterfly], ["flower", flower]
    , ["ladybug", ladybug], ["bear", bear], ["house", house], ["turtle", turtle], ["chick", chick]]

export const TeachersGroups: React.FC = () => {
    const {groups, fetchingGroupsListError, fetchingGroupsList, addNewGroup} = useContext(GroupContext);
    const [openModal, setOpenModal] = useState(false)
    const [newGroupName, setNewGroupName] = useState('')
    const [newGroupImg, setNewGroupImg] = useState('')


    function deselectPic() {
        const el = document.getElementById(newGroupImg);
        if (el !== null) el.style.border = "dotted transparent";
    }

    function handleAddGroup() {
        addNewGroup && addNewGroup(newGroupName, newGroupImg);
        setOpenModal(false)
    }

    return (
        <IonPage>
            <TeacherMenuBar/>
            <IonContent>
                <IonTitle id={"groupsTitle"}>Grupe</IonTitle>
                <IonButton id={"openAddBtn"} onClick={() => {
                    setOpenModal(true);
                    setNewGroupName('')
                }}>ADĂUGAȚI O GRUPĂ NOUĂ</IonButton>
                <div id={"pageContent"}>
                    {groups && groups.map(x =>
                        <IonCard class={"groupCard"} key={x.id} routerLink={'/teachers/groups/' + x.id}>
                            <br/>
                            {x.img &&
                            <IonImg src={imgs[imgs.findIndex(el => el[0] === x.img)][1]} class={"groupImg"}/>}
                            {!x.img && <IonImg src={kids} class={"groupImg"}/>}
                            <br/>
                            <IonCardTitle class={"groupInfo"}>{x.name}</IonCardTitle>
                            <IonCardSubtitle class={"groupInfo"}>{x.membersNo} membrii</IonCardSubtitle>
                        </IonCard>)}
                </div>
                <IonModal isOpen={openModal} onDidDismiss={() => setOpenModal(false)} id={"groupModal"}>
                    <div id={"newImgsDiv"} role={"group"}>
                        <IonImg src={squirrel} id={"newGroupLabel"}/>
                        {imgs.map(x => <IonImg key={x[0]} src={x[1]} class={"newGroupImg"} id={x[0]} onClick={() => {
                            deselectPic();
                            setNewGroupImg(x[0]);
                            const el = document.getElementById(x[0]);
                            if (el !== null) {
                                el.style.borderTop = "dotted blue";
                                el.style.borderBottom = "dotted blue";
                            }
                        }}/>)}
                    </div>
                    <IonInput placeholder={"Numele grupei"} value={newGroupName} id={"groupNameInput"}
                              onIonChange={(ev) => setNewGroupName(ev.detail.value!)}/>
                    <IonButton onClick={handleAddGroup} id={"addBtn"} title={"Adaugă grupa"}>Adaugă</IonButton>
                </IonModal>
                <Footer/>
            </IonContent>
            {fetchingGroupsList && <IonLoading isOpen={true} message={"Încărcăm datele grupelor dumneavoastră!"}/>}
            {fetchingGroupsListError &&
            <IonAlert isOpen={true} message={"A apărut o eroare la încărcarea grupelor dumneavoastră!"}/>}
        </IonPage>
    )
};
export default TeachersGroups;