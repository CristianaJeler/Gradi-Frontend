import React, {ReactComponentElement, useContext, useEffect, useRef, useState} from "react";
import {
    IonContent,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    IonTitle,
    IonSearchbar,
    IonCardSubtitle,
    IonAlert,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonAvatar,
    IonToast, IonDatetime, IonImg, IonTextarea, IonButton, IonInput, IonRouterLink, IonModal, IonCheckbox,
} from "@ionic/react";
import {TeacherMenuBar} from "./TeacherMenuBar";
import Footer from "../../genericUser/components/Footer";
import {RouteComponentProps} from "react-router-dom";
import {
    add,
    appsOutline,
    checkmarkDone,
    people, personAdd, personRemove
} from "ionicons/icons";
import "../pages/design/specific.group.css"
import pic from "../../assets/img/profile.png"
import {GroupContext} from "../../groups/provider/GroupsProvider";
import {UserContext} from "../../genericUser/provider/GenericUserProvider";
import {PICTURE_TYPE} from "../../genericUser/utils/pictureType";
import squirrel from "../pages/design/images/squirrel.png"

interface urlDetails {
    id: string;
}

const PAGE_SIZE = 7;

export const TeacherSpecificGroup: React.FC<RouteComponentProps<urlDetails>> = (props) => {
    const [linksList] = useState<{ linkToAdd: string, linkToAddDescription: string }[]>([]);
    const [linkToAdd, setLinkToAdd] = useState('')
    const [linkToAddDescription, setLinkToAddDescription] = useState('')
    const {getGroupDetails, getGroupDetailsError, currentGroup} = useContext(GroupContext);
    const [openMembersToAssignModal, setOpenMembersToAssignModal] = useState(false)
    const {
        searchUsersError,
        searchedUsers,
        searchUsers,
        addMemberToGroup,
        deleteMemberFromGroup
    } = useContext(UserContext)
    const [currentPage, setCurrentPage] = useState(0)
    const [renderingComponent, setRenderingComponent] = useState('members')
    const [openDeleteMember, setDeleteMember] = useState(false)
    const [openAddMember, setAddMember] = useState(false)
    const [disableInfiniteScroll, setDisableInfiniteScroll] = useState(false)
    const [searchCriteria, setSearchCriteria] = useState('')
    const [clickedMember, setClickedMember] = useState('')
    const [openLinkModal, setOpenLinkModal] = useState(false);

    async function searchNextPage(event?: CustomEvent<void>) {
        searchUsers && searchUsers(searchCriteria, currentGroup?.id, currentPage, PAGE_SIZE)
        setCurrentPage(currentPage + 1)
        event && await (event.target as HTMLIonInfiniteScrollElement).complete();
    }

    useEffect(() => {
        getGroupDetails && getGroupDetails(props.match.params.id)
    }, [getGroupDetails, props.match.params.id])

    useEffect(() => {
        setCurrentPage(0)
        setDisableInfiniteScroll(false)
    }, [searchCriteria])

    useEffect(() => {
        searchUsers && searchUsers(searchCriteria)
    }, [renderingComponent])

    function deselectOption() {
        let opt = document.getElementById(renderingComponent + "Option");
        let ico = document.getElementById(renderingComponent + "OptionIcon")
        if (opt != null && ico !== null) {
            opt.style.color = "black";
            ico.style.color = "grey";
            opt.style.backgroundColor = "transparent";
        }
    }

    useEffect(() => {
        let opt = document.getElementById(renderingComponent + "Option");
        let ico = document.getElementById(renderingComponent + "OptionIcon")
        if (opt !== null && ico !== null) {
            opt.style.color = "#6d4e04";
            opt.style.backgroundColor = "#f3e9d7";
            ico.style.color = "#d69c09";
        }
    }, []);


    function deleteMember() {
        currentGroup && deleteMemberFromGroup && deleteMemberFromGroup(clickedMember, currentGroup.id!)
    }

    function addMember() {
        currentGroup && addMemberToGroup && addMemberToGroup(clickedMember, currentGroup.id!)
    }

    return (<>
        <IonPage>
            <TeacherMenuBar/>
            <IonContent scrollY={false}>
                <IonContent id={"renderingOptionsList"} scrollY={false}>
                    <IonTitle
                        class={"title"}>{currentGroup?.name}
                    </IonTitle>
                    <IonItem class={"renderingOption"} id={"membersOption"} onClick={() => {
                        deselectOption();
                        let opt = document.getElementById("membersOption");
                        let ico = document.getElementById("membersOptionIcon");
                        if (opt !== null && ico !== null) {
                            opt.style.color = "#6d4e04";
                            opt.style.backgroundColor = "#f3e9d7";
                            ico.style.color = "#d69c09";
                        }
                        setRenderingComponent("members");
                        setSearchCriteria('')
                    }}>
                        <IonLabel>Membrii</IonLabel>
                        <IonIcon icon={people} class={"renderingOptionIcon"} id={"membersOptionIcon"}/>
                    </IonItem>
                    <IonItem class={"renderingOption"} onClick={() => {
                        deselectOption();
                        let opt = document.getElementById("assignActivityOption");
                        let ico = document.getElementById("assignActivityOptionIcon");
                        if (opt !== null && ico !== null) {
                            opt.style.color = "#6d4e04";
                            opt.style.backgroundColor = "#f3e9d7";
                            ico.style.color = "#d69c09";
                        }
                        setRenderingComponent("assignActivity");
                        setSearchCriteria('')
                    }} id={"assignActivityOption"}>
                        <IonLabel>
                            Asociați activități
                        </IonLabel>
                        <IonIcon icon={appsOutline} class={"renderingOptionIcon"} id={"assignActivityOptionIcon"}/>
                    </IonItem>
                    <IonItem class={"renderingOption"} onClick={() => {
                        deselectOption();
                        let opt = document.getElementById("returnedAssignsOption");
                        let ico = document.getElementById("returnedAssignsOptionIcon");
                        if (opt !== null && ico !== null) {
                            opt.style.color = "#6d4e04";
                            opt.style.backgroundColor = "#f3e9d7";
                            ico.style.color = "#d69c09";
                        }
                        setRenderingComponent("returnedAssigns");
                        setSearchCriteria('')
                    }} id={"returnedAssignsOption"}>
                        <IonLabel>
                            Răspunsuri primite
                        </IonLabel>
                        <IonIcon icon={checkmarkDone} class={"renderingOptionIcon"} id={"returnedAssignsOptionIcon"}/>
                    </IonItem>
                </IonContent>

                {/*SEARCH MEMBERS*/}
                {renderingComponent === "members" &&
                <IonContent class={"renderedComponent"} scrollY={false}>
                    <IonSearchbar placeholder={"Căutați membrii"}
                                  id={"searchbar"}
                                  value={searchCriteria}
                                  debounce={200}
                                  onIonInput={(e: any) => {
                                      setSearchCriteria(e.target.value)
                                  }}
                                  onIonChange={() => {
                                      searchNextPage();
                                  }}
                    />
                    <IonContent>
                        <IonList>
                            {searchedUsers.length === 0 && <IonImg id={"searchMemberTitle"} src={squirrel}/>}
                            {searchedUsers && searchedUsers.map(user => {
                                return (<IonItem class={"searchedMember"} lines={"none"} key={user.id}>
                                    <IonAvatar class={"memberProfile"} slot={"end"}>
                                        <img src={user.img ? (PICTURE_TYPE + user.img) : (pic)}
                                             alt={"Fotografie profil"}/>
                                    </IonAvatar>
                                    <div>
                                        <IonLabel>{user.firstName} {user.lastName}</IonLabel>
                                        <IonCardSubtitle>{user.username}</IonCardSubtitle>
                                    </div>
                                    {user.inGroup === false &&
                                    <IonIcon icon={personAdd} slot={"start"} class={"memberIconAdd"}
                                             title={"Adaugați membru"}
                                             onClick={() => {
                                                 setAddMember(true);
                                                 setClickedMember(user.id!)
                                             }}/>}
                                    {user.inGroup === true &&
                                    <IonIcon icon={personRemove} slot={"start"} class={"memberIconDelete"}
                                             title={"Adaugați membru"} onClick={() => {
                                        setDeleteMember(true);
                                        setClickedMember(user.id!)
                                    }}/>}
                                </IonItem>)
                            })}

                        </IonList>
                        <IonInfiniteScroll
                            threshold="30px"
                            disabled={disableInfiniteScroll}
                            onIonInfinite={(e) => {
                                searchNextPage(e);
                            }}>
                            <IonInfiniteScrollContent
                                loadingSpinner={"bubbles"}
                                loadingText="Se încarcă mai mulți membri...">
                            </IonInfiniteScrollContent>
                        </IonInfiniteScroll>
                    </IonContent>
                </IonContent>}

                {/*ASSIGN ACTIVITY*/}
                {renderingComponent === "assignActivity" &&
                <IonContent class={"renderedComponent"} scrollY={false}>
                    <IonItem class={"newActivityItems"}>
                        <IonLabel>Data expirării</IonLabel>
                        <IonDatetime displayFormat={"DD MMMM YYYY, HH:mm"} id={"datePicker"}
                                     displayTimezone={"Europe/Helsinki"}
                                     monthNames={"ianuarie, februarie, martie, aprilie, mai, iunie, iulie, august, septembrie, octombrie, noiembrie, decembrie"}
                                     placeholder={(new Date()).toLocaleString('ro', {
                                         year: "numeric", month: "long",
                                         day: "numeric", hour: "2-digit", minute: "2-digit"
                                     })}
                                     cancelText={"Închide"}
                                     doneText={"Alege"}
                                     pickerOptions={{
                                         cssClass: "datePicker",
                                         showBackdrop: true,
                                         animated: true,
                                         backdropDismiss: true,
                                     }}/>
                    </IonItem>
                    <IonItem class={"newActivityItems"}>
                        <IonTextarea placeholder={"Descrierea activității"} id={"descriptionText"}
                                     rows={8}/>
                    </IonItem>
                    <IonItem class={"newActivityItems addActivityComponentBtn"}>
                        <IonIcon icon={add} class={"addActivityComponentIcon"}/>
                        <IonLabel>Atașează fotografii sau filmulețe</IonLabel>
                    </IonItem>
                    <IonItem class={"newActivityItems addActivityComponentBtn"}>
                        <IonIcon icon={add} class={"addActivityComponentIcon"}/>
                        <IonLabel>Atașează jocuri</IonLabel>
                    </IonItem>
                    <IonItem class={"newActivityItems addActivityComponentBtn"} onClick={() => {
                        setOpenLinkModal(true)
                    }}>
                        <IonIcon icon={add} class={"addActivityComponentIcon"}/>
                        <IonLabel>Adaugă un link spre o activitate</IonLabel>
                    </IonItem>
                    {linksList && linksList.length > 0 && <IonItem key={'_' + Math.random().toString(36).substr(2, 9)}>
                        {linksList.map(l => <a key={'_' + Math.random().toString(36).substr(2, 9)}
                                               href={l.linkToAdd}>{l.linkToAddDescription}</a>)}
                    </IonItem>}
                    <IonItem lines={"none"} class={"newActivityItems"}>
                        <IonButton id={"btnSendActivity"} slot={"end"}
                                   onClick={() => setOpenMembersToAssignModal(true)}>
                            Trimite către...
                        </IonButton>
                    </IonItem>
                    <IonModal isOpen={openLinkModal} onDidDismiss={() => {
                        setOpenLinkModal(false);
                        setLinkToAdd('');
                        setLinkToAddDescription('')
                    }}>
                        <IonInput placeholder={"O descriere a conținutului din link..."} value={linkToAddDescription}
                                  onIonChange={e => setLinkToAddDescription(e.detail.value!)}/>
                        <IonInput placeholder={"Link-ul dumneavoastră"} value={linkToAdd}
                                  onIonChange={e => setLinkToAdd(e.detail.value!)}/>
                        <IonButton onClick={() => {
                            linksList.push({linkToAdd, linkToAddDescription});
                            setOpenLinkModal(false)
                        }}>Adauga</IonButton>
                    </IonModal>
                    <IonModal isOpen={openMembersToAssignModal} onDidDismiss={() => setOpenMembersToAssignModal(false)}>
                        <IonSearchbar></IonSearchbar>
                        <IonList>
                            <IonItem>
                                <IonLabel color={"danger"}>
                                    Selectează-i pe toți
                                </IonLabel>
                                <IonCheckbox color={"danger"}/>
                            </IonItem>
                        </IonList>
                    </IonModal>
                </IonContent>}


                <IonAlert cssClass={"alert"}
                          isOpen={openDeleteMember}
                          header={"Eliminare membru"}
                          message={"Doriți să eliminați acest membru din grupă?"}
                          onDidDismiss={() => setDeleteMember(false)}
                          buttons={[
                              {
                                  text: 'DA',
                                  cssClass: 'alertBtn',
                                  handler: () => {
                                      deleteMember();
                                  }
                              },
                              {
                                  cssClass: 'alertBtn',
                                  text: 'NU'
                              }
                          ]}/>
                <IonAlert cssClass={"alert"}
                          isOpen={openAddMember}
                          header={"Adăugare membru"}
                          message={"Doriți să adăugați acest membru în grupă?"}
                          onDidDismiss={() => setAddMember(false)}
                          buttons={[
                              {
                                  text: 'DA',
                                  cssClass: 'alertBtn',
                                  handler: () => {
                                      addMember();
                                  }
                              },
                              {
                                  cssClass: 'alertBtn',
                                  text: 'NU'
                              }
                          ]}/>
                {getGroupDetailsError && <IonAlert isOpen={true} header={"A apărut o eroare!"}
                                                   message={"A apărut o problemă, iar datele grupei dumneavoastră nu au putut fi încărcate!"}/>}
            </IonContent>

            {searchUsersError &&
            <IonToast isOpen={true} message={"A apărut o eroare la încărcarea datelor solicitate..."}/>}

            <Footer/>
        </IonPage>
    </>)
}