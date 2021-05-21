import React, {FormEvent, useContext, useEffect, useReducer, useState} from "react";
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
    IonToast,
    IonDatetime,
    IonImg,
    IonTextarea,
    IonButton,
    IonInput,
    IonRouterLink,
    IonModal,
    IonCheckbox,
    IonCardTitle,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonRadioGroup,
    IonItemGroup,
    IonSelect,
    IonSelectOption,
    IonLoading,
    IonText,
    IonSlide, IonSlides, IonFabButton, IonGrid, IonRow, IonHeader, IonCol, IonItemDivider, IonRadio,
} from "@ionic/react";
import {TeacherMenuBar} from "./TeacherMenuBar";
import {RouteComponentProps} from "react-router-dom";
import {
    appsOutline, arrowBack, body, camera, chatbox,
    checkmarkDone, colorPalette, gameController, globe, medal,
    people, personAdd, personRemove, telescope, thumbsUp, trash, videocam
} from "ionicons/icons";
import pic from "../../assets/img/profile.png"
import {GroupContext} from "../../groups/provider/GroupsProvider";
import {UserContext} from "../../genericUser/provider/GenericUserProvider";
import {PICTURE_TYPE, VIDEO_TYPE} from "../../genericUser/utils/constants";
import squirrel from "../pages/design/images/squirrel.png"
import {usePhotoGallery} from "../../genericUser/utils/usePhotosGallery";
import {GameProps, GamesContext} from "../../games/provider/GamesProvider";
import "../pages/design/teacher.specific.group.css"

import {
    ActivitiesContext,
    ActivityProps, AnswerProps,
    LinkProps,
    MediaProps
} from "../../activities/provider/ActivitiesProvider";
import {IonBackButtonInner} from "@ionic/react/dist/types/components/inner-proxies";


interface urlDetails {
    id: string;
}

const PAGE_SIZE = 7;


export const TeacherSpecificGroup: React.FC<RouteComponentProps<urlDetails>> = (props) => {
    const {
        searchUsersError,
        searchedUsers,
        searchUsers,
        addMemberToGroup,
        deleteMemberFromGroup,
        fetchGroupMembers,
        username
    } = useContext(UserContext)
    const {getGroupDetails, getGroupDetailsError, currentGroup} = useContext(GroupContext);
    const {
        addActivity,
        getAnswers,
        fetchingActivities,
        answers,
        getActivitiesAssignedFromThisGroup,
        groupActivities,
        badges,
        getAllBadges,
        gettingBadges,
        getBadgesError,
        awardBadge,
        awardBadgeError,
        awardingBadge
    } = useContext(ActivitiesContext)



    const [currentPage, setCurrentPage] = useState(0)
    const [renderingComponent, setRenderingComponent] = useState('members')
    const [openDeleteMember, setDeleteMember] = useState(false)
    const [openAddMember, setAddMember] = useState(false)
    const [disableInfiniteScroll, setDisableInfiniteScroll] = useState(false)
    const [generalSearchCriteria, setGeneralSearchCriteria] = useState('')
    const [clickedMember, setClickedMember] = useState('')
    const [activityDescription, setActivityDescription] = useState('')
    const [checkedMembers, setCheckedMembers] = useState<string[]>([])
    const [uploadedVideos, setUploadedVideos] = useState<string[]>([])
    const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])
    const [expiryDate, setExpiryDate] = useState((new Date()).toLocaleString('ro', {
        year: "numeric", month: "long",
        day: "numeric"
    }))
    const [linksList, setLinksList] = useState<LinkProps[]>([])
    const [checkedGames, setCheckedGames] = useState<GameProps[]>([])
    const [openMembersToAssignModal, setOpenMembersToAssignModal] = useState(false)
    const [groupMembersSearchCriteria, setGroupMembersSearchCriteria] = useState('')
    const [openLinkModal, setOpenLinkModal] = useState(false)
    const [linkToAdd, setLinkToAdd] = useState('')
    const [linkToAddDescription, setLinkToAddDescription] = useState('')
    const [openGamesModal, setOpenGamesModal] = useState(false)
    const [checkedFields, setCheckedFields] = useState<string[]>([])
    const {games, getAllGames} = useContext(GamesContext)
    const [field, setField] = useState('')
    const [title, setTitle] = useState('')
    const [selectedActivity, setSelectedActivity] = useState<ActivityProps>({})
    const [selectedAnswer, setSelectedAnswer] = useState<AnswerProps>({})
    const [selectedBadge, setSelectedBadge] = useState('')


    function checkGame(game: GameProps, checked: boolean) {
        let checkedGamesCpy = [...checkedGames]
        if (checked && !checkedGames.includes(checkedGames.find(g => g.id === game.id)!))
            checkedGamesCpy.push(game)
        else if (!checked) checkedGamesCpy.splice(checkedGamesCpy.indexOf(game), 1)
        setCheckedGames(checkedGamesCpy)
    }

    function checkField(field: string, checked: boolean) {
        let checkedFieldsCpy = [...checkedFields]
        if (checked && !checkedFields.includes(checkedFields.find(f => f === field)!))
            checkedFieldsCpy.push(field)
        else if (!checked) checkedFieldsCpy.splice(checkedFieldsCpy.indexOf(field), 1)
        setCheckedFields(checkedFieldsCpy)
    }

    function fetchAllGames() {
        getAllGames && getAllGames()
    }

    async function searchNextPage(event?: CustomEvent<void>) {
        searchUsers && searchUsers(generalSearchCriteria, currentGroup?.id, currentPage, PAGE_SIZE)
        setCurrentPage(currentPage + 1)
        event && await (event.target as HTMLIonInfiniteScrollElement).complete();
    }


    useEffect(() => {
        getGroupDetails && getGroupDetails(props.match.params.id)
    }, [getGroupDetails, props.match.params.id])

    useEffect(() => {
        setCurrentPage(0)
        setDisableInfiniteScroll(false)
    }, [generalSearchCriteria])

    useEffect(() => {
        searchUsers && searchUsers(generalSearchCriteria)
    }, [renderingComponent])

    useEffect(() => {
        let opt = document.getElementById(renderingComponent + "Option");
        let ico = document.getElementById(renderingComponent + "OptionIcon")
        if (opt !== null && ico !== null) {
            opt.style.color = "#6d4e04";
            opt.style.backgroundColor = "#f3e9d7";
            ico.style.color = "#d69c09";
        }
    });


    function deselectOption() {
        let opt = document.getElementById(renderingComponent + "Option");
        let ico = document.getElementById(renderingComponent + "OptionIcon")
        if (opt != null && ico !== null) {
            opt.style.color = "black";
            ico.style.color = "grey";
            opt.style.backgroundColor = "transparent";
        }
    }


    function deleteMember() {
        currentGroup && deleteMemberFromGroup && deleteMemberFromGroup(clickedMember, currentGroup.id!)
    }

    function addMember() {
        currentGroup && addMemberToGroup && addMemberToGroup(clickedMember, currentGroup.id!)
    }

    function getGroupMembers() {
        currentGroup && fetchGroupMembers && fetchGroupMembers(currentGroup.id!)
    }

    function checkMember(checkedMember: string, checked: boolean) {
        let checkedMembersCpy = [...checkedMembers]
        if (checked && !checkedMembers.includes(checkedMembers.find(m => m === checkedMember)!))
            checkedMembersCpy.push(checkedMember)
        else if (!checked) checkedMembersCpy.splice(checkedMembersCpy.indexOf(checkedMember), 1)
        setCheckedMembers(checkedMembersCpy)
    }

    function newActivity() {
        let media: MediaProps[] = []
        uploadedVideos.forEach(v => media.push({content: v, contentType: VIDEO_TYPE}))
        uploadedPhotos.forEach(p => media.push({content: p, contentType: PICTURE_TYPE}))
        const activity: ActivityProps = {
            title: title,
            field: field,
            description: activityDescription,
            dueDate: expiryDate,
            games: checkedGames,
            links: linksList,
            media: media,
            groupId: currentGroup?.id,
            assignedBy:username
        }
        addActivity && addActivity(activity, checkedMembers)
    }

    const {takePhoto, toBase64} = usePhotoGallery()

    async function loadPhoto() {
        let media = await takePhoto()
        let photosListCpy = [...uploadedPhotos]
        if (!photosListCpy.includes(media)) {
            photosListCpy.push(media)
            setUploadedPhotos(photosListCpy)
        }

    }


    async function loadVideo(e: any) {
        let media = e.target.files[0]
        let videosListCpy = [...uploadedVideos]
        let base64 = await toBase64(media);
        if (!videosListCpy.includes(base64)) {
            videosListCpy.push(base64)
            setUploadedVideos(videosListCpy)
        }
    }

    function removeLinkFromList(linkToRemove: string) {
        let idx = linksList.findIndex(link => link.link === linkToRemove)
        let arrCopy = [...linksList];
        arrCopy.splice(idx, 1)
        setLinksList(arrCopy)
    }

    useEffect(() => {
        function fetchAnswers() {
            getAnswers && getAnswers(selectedActivity.id)
        }

        if (renderingComponent === "activityAnswers")
            fetchAnswers && fetchAnswers()

    }, [getAnswers, renderingComponent, selectedActivity.id]);


    useEffect(() => {
        if (renderingComponent === 'returnedAssigns')
            getActivitiesAssignedFromThisGroup && getActivitiesAssignedFromThisGroup(currentGroup?.id!)
    }, [currentGroup?.id, getActivitiesAssignedFromThisGroup, renderingComponent]);


    useEffect(() => {
        if (renderingComponent === 'badges') {
            getAllBadges && getAllBadges()
        }
    }, [renderingComponent]);

    function deselectPic() {
        const el = document.getElementById(selectedBadge);
        if (el !== null) el.style.border = "dotted transparent";
    }

    function rewardBadge(userId: string) {
        awardBadge && awardBadge(userId, selectedBadge)
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
                        let opt = document.getElementById("membersOption");
                        let ico = document.getElementById("membersOptionIcon");
                        if (opt !== null && ico !== null) {
                            opt.style.color = "#6d4e04";
                            opt.style.backgroundColor = "#f3e9d7";
                            ico.style.color = "#d69c09";
                        }
                        setRenderingComponent("members");
                        setGeneralSearchCriteria('')
                    }}>
                        <IonLabel>Membri</IonLabel>
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
                        setGeneralSearchCriteria('')
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
                        setGeneralSearchCriteria('')
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
                                  value={generalSearchCriteria}
                                  debounce={200}
                                  onIonInput={(e: any) => {
                                      setGeneralSearchCriteria(e.target.value)
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
                <IonContent class={"renderedComponent"}>
                    {/*ASSIGNMENT TITLE*/}
                    <IonItem class={"newActivityItems"}>
                        <IonInput placeholder={"Titlul temei"} value={title}
                                  onIonChange={(e) => setTitle(e.detail.value!)}/>
                    </IonItem>
                    {/*FIELD*/}
                    <IonItem class={"newActivityItems"}>
                        <IonSelect interface={"popover"} value={field} onIonChange={(e) => setField(e.detail.value!)}
                                   placeholder={"Domeniul activității"}>
                            <IonSelectOption>Științe</IonSelectOption>
                            <IonSelectOption>Om și societate</IonSelectOption>
                            <IonSelectOption>Estetic și creativ</IonSelectOption>
                            <IonSelectOption>Psihomotric</IonSelectOption>
                            <IonSelectOption>Limbă și comunicare</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                    {/*CHOOSE DATE*/}
                    {/*<ExpirationDate/>*/}
                    <IonItem class={"newActivityItems"}>
                        <IonLabel>Data expirării</IonLabel>
                        <IonDatetime displayFormat={"DD MMMM YYYY"} id={"datePicker"}
                                     displayTimezone={"Europe/Helsinki"}
                                     monthNames={"ianuarie, februarie, martie, aprilie, mai, iunie, iulie, august, septembrie, octombrie, noiembrie, decembrie"}
                                     placeholder={(new Date()).toLocaleString('ro', {
                                         year: "numeric", month: "long",
                                         day: "numeric"
                                     })}
                                     cancelText={"Închide"}
                                     doneText={"Alege"}
                                     pickerOptions={{
                                         cssClass: "datePicker",
                                         showBackdrop: true,
                                         animated: true,
                                         backdropDismiss: true,
                                     }}
                                     value={expiryDate}

                                     onIonChange={(e) => {
                                         setExpiryDate(e.detail.value!)
                                     }}/>
                    </IonItem>

                    {/*ACTIVITY DESCRIPTION*/}
                    <IonItem class={"newActivityItems"}>
                        <IonTextarea placeholder={"Descrierea activității"} id={"descriptionText"}
                                     rows={8}
                                     value={activityDescription}
                                     onIonChange={(e) => setActivityDescription(e.detail.value!)}
                                     key={"activityField"}/>
                    </IonItem>


                    {/*ATTACH PHOTOS*/}
                    {/*<AttachPhotos/>*/}
                    <IonItem class={"newActivityItems addActivityComponentBtn"} onClick={loadPhoto}>
                        <IonIcon icon={camera} class={"addActivityComponentIcon"}/>
                        <IonLabel>Atașează fotografii</IonLabel>
                    </IonItem>
                    <div id={"mediaContent"} className={"newActivityLink"}>
                        {uploadedPhotos && uploadedPhotos.map(photo => <IonImg src={photo} class={"loadedImage"}
                                                                               key={photo.substr(100, 10)}/>)}
                    </div>


                    {/*ATTACH VIDEOS*/}
                    {/*<AttachVideos/>*/}
                    <IonItem class={"newActivityItems addActivityComponentBtn"}>
                        <IonIcon icon={videocam} class={"addActivityComponentIcon"}/>
                        <label>
                            <input type={"file"} accept={"video/mp4"} onChange={(e) => loadVideo(e)}/>
                            Atașează filmulețe</label>
                    </IonItem>
                    <div id={"mediaContent"} className={"newActivityLink"}>
                        {uploadedVideos && uploadedVideos.map(video => <video className={"loadedVideo"}
                                                                              key={video.substr(100, 10)}
                                                                              width={200} height={200} controls>
                            <source src={video} type="video/mp4"/>
                        </video>)}
                    </div>


                    {/*ATTACH GAMES*/}
                    <IonItem class={"newActivityItems addActivityComponentBtn"} onClick={() => {
                        setOpenGamesModal(true)
                        fetchAllGames()
                    }}>
                        <IonIcon icon={gameController} class={"addActivityComponentIcon"}/>
                        <IonLabel>Atașează jocuri</IonLabel>
                    </IonItem>
                    <div className={"newActivityLink"}>
                        {!openGamesModal && checkedGames && checkedGames.map(game =>
                            <div key={game.id} className={"checkedGamesListItem"}>
                                <IonAvatar><img className={"checkedGamesListItemAvatar"}
                                                src={game.picture ? (PICTURE_TYPE + game.picture) : (pic)}
                                                alt={"Fotografie joc"}/></IonAvatar>
                                <IonCardTitle>{game.name}</IonCardTitle>
                            </div>)}
                    </div>
                    <IonModal isOpen={openGamesModal} onDidDismiss={() => setOpenGamesModal(false)} cssClass={"modal"}>
                        <div>
                            <IonLabel class={"fieldLabel"}>
                                <IonCheckbox class={"gameCheckbox"} color={"warning"}
                                             onIonChange={(e) => {
                                                 checkField("Științe", e.detail.checked);
                                             }}/> Științe <IonIcon icon={telescope}/>
                            </IonLabel>
                            <IonLabel class={"fieldLabel"}>

                                <IonCheckbox class={"gameCheckbox"} color={"warning"}
                                             onIonChange={(e) => {
                                                 checkField("Limbă și comunicare", e.detail.checked);
                                             }}/> Limbă și comunicare <IonIcon icon={chatbox}/>
                            </IonLabel>
                            <IonLabel class={"fieldLabel"}>

                                <IonCheckbox class={"gameCheckbox"} color={"warning"}
                                             onIonChange={(e) => {
                                                 checkField("Activități psihomotrice", e.detail.checked);
                                             }}/> Activități psihomotrice <IonIcon icon={body}/>
                            </IonLabel>
                            <IonLabel class={"fieldLabel"}>
                                <IonCheckbox class={"gameCheckbox"} color={"warning"}
                                             onIonChange={(e) => {
                                                 checkField("Om și societate", e.detail.checked);
                                             }}/> Om și societate <IonIcon icon={people}/>
                            </IonLabel>
                            <IonLabel class={"fieldLabel"}>
                                <IonCheckbox class={"gameCheckbox"} color={"warning"}
                                             onIonChange={(e) => {
                                                 checkField("Estetic și creativ", e.detail.checked);
                                             }}/> Estetic și creativ <IonIcon icon={colorPalette}/>
                            </IonLabel>
                        </div>
                        <IonContent class={"modalContent"}>
                            <IonList class={"modalContent"}>
                                {games && games
                                    .filter(game => {
                                        if (checkedFields.length === 0) return true;
                                        for (const field of checkedFields) {
                                            if (game.field === field) return true;
                                        }
                                        return false;
                                    })
                                    .map(game => {
                                            return (
                                                <IonCard class={"modalListItem gameModalListItem"} key={game.id}>
                                                    <IonCardContent>
                                                        <IonCardHeader class={"gameCardHeader"}>
                                                            Domeniu: {game.field?.toUpperCase()}
                                                        </IonCardHeader>
                                                        <IonAvatar class={"gameModalListItemAvatar"}>
                                                            <img src={game.picture ? (PICTURE_TYPE + game.picture) : (pic)}
                                                                 alt={"Fotografie joc"}/>
                                                        </IonAvatar>

                                                        <div className={"gameTitleAndDescription"}>
                                                            <IonCardTitle class={"gameModalListItemTitle"}>
                                                                {game.name}
                                                            </IonCardTitle><br/>
                                                            <IonCardSubtitle class={"gameModalListItemDescription"}>
                                                                {game.shortDescription}
                                                            </IonCardSubtitle>
                                                        </div>
                                                        <div className={"gameCheckBoxDiv"}>
                                                            <IonRouterLink className={"gameModalListItemLabel"}
                                                                           href={"/games/" + game.name!.toLowerCase()}
                                                                           target={"_blank"}>Probează
                                                                <IonIcon icon={gameController}/></IonRouterLink>
                                                            <br/>
                                                            <IonLabel>
                                                                Selectează
                                                            </IonLabel>
                                                            <IonCheckbox class={"gameCheckbox"} color={"warning"}
                                                                         onIonChange={(e) => {
                                                                             checkGame(game, e.detail.checked);
                                                                         }}/>
                                                        </div>
                                                    </IonCardContent>
                                                </IonCard>
                                            )
                                        }
                                    )}
                            </IonList>
                        </IonContent>
                    </IonModal>


                    {/*ATTACH LINKS*/}
                    <IonItem class={"newActivityItems addActivityComponentBtn"} lines={"none"} onClick={() => {
                        setOpenLinkModal(true)
                    }}>
                        <IonIcon icon={globe} class={"addActivityComponentIcon"}/>
                        <IonLabel>Adaugă un link spre o activitate</IonLabel>
                    </IonItem>
                    {linksList &&
                    <IonList class={"newActivityLink"}>
                        {linksList.map(l =>
                            <div className={"activityLinks"}>
                                <span title={"Șterge"} className={"trashIcon"}>
                                    <IonIcon icon={trash} onClick={() => removeLinkFromList(l.link)}/>
                                </span>
                                <a key={l.link}
                                   href={l.link} rel={"noreferrer"} target={"_blank"}>
                                    {l.description}</a>
                            </div>)}
                    </IonList>}
                    <IonModal isOpen={openLinkModal} onDidDismiss={() => {
                        setOpenLinkModal(false)
                        setLinkToAdd('')
                        setLinkToAddDescription('')
                    }} cssClass={"modal"} id={"linkModal"}>
                        <IonInput placeholder={"O descriere a conținutului din link..."} value={linkToAddDescription}
                                  onIonChange={e => setLinkToAddDescription(e.detail.value!)} class={"linkModalInput"}/>
                        <IonInput placeholder={"Link-ul dumneavoastră"} value={linkToAdd}
                                  onIonChange={e => setLinkToAdd(e.detail.value!)} class={"linkModalInput"}/>
                        <IonButton onClick={() => {
                            linksList.push({link: linkToAdd, description: linkToAddDescription});
                            setOpenLinkModal(false)
                        }} id={"linkModalButton"}>Adauga</IonButton>
                    </IonModal>


                    {/*SEND TO*/}
                    <IonItem lines={"none"} class={"newActivityItems"}>
                        <IonButton id={"btnSendActivity"} slot={"end"}
                                   onClick={() => {
                                       setOpenMembersToAssignModal(true)
                                       getGroupMembers();
                                   }}>
                            Trimite către...
                        </IonButton>
                    </IonItem>

                    <IonModal isOpen={openMembersToAssignModal} onDidDismiss={() => {
                        setOpenMembersToAssignModal(false)
                        setGroupMembersSearchCriteria('')
                    }}
                              cssClass={"modal"}>
                        <IonSearchbar placeholder={"Căutați membrii..."}
                                      class={"searchbarInModal"}
                                      value={groupMembersSearchCriteria}
                                      debounce={200}
                                      onIonInput={(e: any) => {
                                          setGroupMembersSearchCriteria(e.target.value)
                                      }}
                        />
                        <IonContent class={"modalContent"}>
                            <IonList class={"modalContent"}>
                                {searchedUsers && searchedUsers
                                    .filter(user => {
                                        if (groupMembersSearchCriteria === '') return searchedUsers;
                                        return user.lastName?.startsWith(groupMembersSearchCriteria) || user.lastName?.toLowerCase().startsWith(groupMembersSearchCriteria)
                                            || user.firstName?.startsWith(groupMembersSearchCriteria) || user.lastName?.toLowerCase().startsWith(groupMembersSearchCriteria)
                                    })
                                    .map(user => {
                                        return <IonItem class={"modalListItem"} lines={"none"} key={user.id}>
                                            <IonAvatar>
                                                <img src={user.img ? (PICTURE_TYPE + user.img) : (pic)}
                                                     alt={"Fotografie profil"}/>
                                            </IonAvatar>
                                            <IonLabel>
                                                {user.firstName + " " + user.lastName}
                                            </IonLabel>
                                            <IonCheckbox onIonChange={(e) => checkMember(user.id!, e.detail.checked)}/>
                                        </IonItem>
                                    })}
                            </IonList>
                        </IonContent>
                        <IonButton id={"groupMembersListButton"} onClick={() => newActivity()}>Trimite</IonButton>
                    </IonModal>
                </IonContent>}


                {/*RECEIVED ANSWERS*/}
                {
                    renderingComponent === "returnedAssigns" &&
                    <IonContent class={"renderedComponent"}>
                        <IonTitle><u>Activități curente</u></IonTitle>
                        <IonList>
                            {groupActivities && groupActivities.map(act => {
                                return (<IonCard class={"currentActivity"} key={act.id} onClick={() => {
                                    setRenderingComponent("activityAnswers");
                                    setSelectedActivity(act)
                                }}>
                                    <div>
                                        <IonCardTitle>{act.title}</IonCardTitle>
                                        <IonCardSubtitle>Activă până în: {act.dueDate}</IonCardSubtitle>
                                    </div>
                                </IonCard>)
                            })}

                            <IonLoading isOpen={fetchingActivities} message={"Încărcăm lista de activități..."}/>

                        </IonList>
                    </IonContent>
                }

                {
                    renderingComponent === "activityAnswers" &&
                    <IonContent class={"renderedComponent"}>
                        <br/>
                        <IonFabButton onClick={() => {
                            setRenderingComponent("returnedAssigns");
                        }}
                                      id={"btnBack"}><IonIcon icon={arrowBack}/></IonFabButton>
                        <br/>

                        <IonList>
                            <IonTitle><u>Răspunsuri</u></IonTitle>
                            {answers && answers.map(ans => {
                                return (<><IonCard class={"currentActivity"} key={ans.id} onClick={() => {
                                    setRenderingComponent("selectedAnswer");
                                    setSelectedAnswer(ans)
                                }}>
                                    <div>
                                        <IonText>Răspuns de
                                            la:</IonText><IonCardTitle>{ans.memberName}</IonCardTitle>
                                        <IonCardSubtitle>Activitate: {selectedActivity.title},
                                            din: {selectedActivity.dueDate}</IonCardSubtitle>
                                    </div>
                                </IonCard>
                                </>)
                            })}

                            <IonLoading isOpen={fetchingActivities} message={"Încărcăm lista de răspunsuri..."}/>
                        </IonList>
                    </IonContent>
                }

                {
                    renderingComponent === 'selectedAnswer' &&
                    <IonContent class={"renderedComponent"}>
                        <br/>
                        <IonFabButton onClick={() => {
                            setRenderingComponent("activityAnswers");
                        }}
                                      id={"btnBack"}><IonIcon icon={arrowBack}/></IonFabButton>
                        <br/>
                        <IonItem lines={"none"} id={"answerComponentHeader"}>
                            <IonFabButton onClick={() => {
                                setRenderingComponent("activityAnswers");
                            }}
                                          id={"btnBack"}><IonIcon icon={arrowBack}/></IonFabButton>
                            <IonTitle><u><b>{selectedAnswer.memberName}</b> a lucrat:</u></IonTitle><br/>
                            <IonFabButton slot="end" onClick={() => {
                                setRenderingComponent("badges");
                            }}
                                          id={"btnBadge"}><IonIcon icon={medal}/></IonFabButton>
                        </IonItem>
                        <br/>


                        <IonSlides options={{
                            speed: 500,
                            effect: "cube",
                            paginationType: "fraction",
                            loop: true

                        }} pager={true}>
                            {selectedAnswer.photos?.map(m =>
                                <IonSlide>
                                    <IonImg class={"slideImg"} src={PICTURE_TYPE + m.content}
                                            key={m.content?.substr(100, 10)}/>
                                </IonSlide>)}
                        </IonSlides>
                        <IonItemDivider/>
                        {selectedAnswer.gameResults && selectedAnswer.gameResults.length > 0 &&
                        <>
                            <IonTitle><u>Rezultate jocuri:</u></IonTitle>
                            <IonGrid class={"resultsDiv"}>
                                <IonRow>
                                    <IonTitle class={"tableCell"}>Joc</IonTitle>
                                    <IonTitle class={"tableCell"}>Rezultat</IonTitle>
                                </IonRow>
                                {selectedAnswer.gameResults.map(a =>
                                    <IonRow>
                                        <IonCol class={"tableCell"}>{a.game} </IonCol>
                                        <IonCol class={"tableCell"}>{a.result} pct.</IonCol>
                                    </IonRow>
                                )}
                            </IonGrid>
                        </>}
                    </IonContent>
                }


                {/*BADGES*/}
                {renderingComponent === 'badges' && <IonContent class={"renderedComponent"}>
                    <br/>
                    <IonFabButton onClick={() => {
                        setRenderingComponent("selectedAnswer");
                    }}
                                  id={"btnBack"}><IonIcon icon={arrowBack}/></IonFabButton>
                    <IonButton id={"giveBadgeBtn"} onClick={() => rewardBadge(selectedAnswer.userId!)}>Acordă
                        insigna</IonButton>
                    <br/><br/><br/>
                    <IonRadioGroup>
                        {badges && badges.map(badge => {
                            return <IonAvatar className={"badgeDiv"} key={badge.id}>
                                <IonImg src={PICTURE_TYPE + badge.content} id={badge.id!.toString()} class={"badgeImg"}
                                        onClick={() => {
                                            deselectPic();
                                            setSelectedBadge(badge.id!.toString());
                                            const el = document.getElementById(badge.id!.toString());
                                            if (el !== null) {
                                                el.style.border = "5px dotted blue";
                                            }
                                        }}/>
                            </IonAvatar>
                        })}
                    </IonRadioGroup>
                </IonContent>}

                {/*ALERTS*/}
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
                {getGroupDetailsError &&
                <IonAlert isOpen={true} header={"A apărut o eroare!"}
                          message={"A apărut o problemă, iar datele grupei dumneavoastră nu au putut fi încărcate!"}/>}

                {awardBadgeError &&
                <IonAlert isOpen={true} header={"A apărut o eroare!"}
                          message={awardBadgeError.message}/>}

                {getBadgesError && <IonAlert isOpen={true} header={"A apărut o eroare!"}
                                             message={getBadgesError.message}/>}

            </IonContent>

            {/*ERRORS*/}
            {searchUsersError &&
            <IonToast isOpen={true}
                      message={"A apărut o eroare la încărcarea datelor solicitate..."}/>}


        </IonPage>
    </>)
}