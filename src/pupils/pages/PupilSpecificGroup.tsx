import React, {useContext, useEffect, useState} from "react";
import {
    IonAvatar,
    IonButton,
    IonCard,
    IonCardSubtitle,
    IonCardTitle,
    IonContent,
    IonIcon,
    IonImg,
    IonItem, IonItemDivider,
    IonLabel,
    IonList,
    IonLoading,
    IonPage,
    IonRouterLink,
    IonSlide,
    IonSlides,
    IonText,
    IonTitle,
} from "@ionic/react";
import {RouteComponentProps} from "react-router-dom";
import {camera, gameController, image, medal, podium} from "ionicons/icons";
import "../pages/design/pupils.specific.group.css"
import {Storage} from "@capacitor/core";
import pic from "../../assets/img/profile.png"
import {GroupContext} from "../../groups/provider/GroupsProvider";
import {UserContext} from "../../genericUser/provider/GenericUserProvider";
import {PICTURE_TYPE, VIDEO_TYPE} from "../../genericUser/utils/constants";
import {usePhotoGallery} from "../../genericUser/utils/usePhotosGallery";
import {
    ActivitiesContext,
    ActivityProps,
    GameResultProps,
    MediaProps
} from "../../activities/provider/ActivitiesProvider";
import {PupilMenuBar} from "./PupilMenuBar";


interface urlDetails {
    id: string;
}

export const PupilSpecificGroup: React.FC<RouteComponentProps<urlDetails>> = (props) => {
    const {
        searchUsers,
        username
    } = useContext(UserContext)
    const {getGroupDetails, getGroupDetailsError, currentGroup} = useContext(GroupContext);
    const {currentActivities, getCurrentActivities, fetchingActivities, sendAnswer} = useContext(ActivitiesContext)


    const [renderingComponent, setRenderingComponent] = useState('currentActivities')
    const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])
    const [selectedActivity, setSelectedActivity] = useState<ActivityProps>({})
    const [gamesResults, setGamesResults] = useState<GameResultProps[]>([])


    useEffect(() => {
        window.addEventListener('storage', () => {
            async function getResults() {
                let results = JSON.parse((await Storage.get({key: "gamesResults_" + selectedActivity.id})).value)
                if (results !== null) setGamesResults(results)
                else setGamesResults([])
            }

            getResults()
        })
    })
    useEffect(() => {
        async function getResults() {
            let results = JSON.parse((await Storage.get({key: "gamesResults_" + selectedActivity.id})).value)
            if (results !== null) setGamesResults(results)
            else setGamesResults([])
        }

        getResults()

        setUploadedPhotos([])
    }, [selectedActivity.id]);


    useEffect(() => {
        getGroupDetails && getGroupDetails(props.match.params.id)
    }, [getGroupDetails, props.match.params.id])

    useEffect(() => {
        username && getCurrentActivities && getCurrentActivities(username, currentGroup?.id!)
    }, [getCurrentActivities, username])

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

    const {takePhoto} = usePhotoGallery()

    async function loadPhoto() {
        let media = await takePhoto()
        let photosListCpy = [...uploadedPhotos]
        if (!photosListCpy.includes(media)) {
            photosListCpy.push(media)
            setUploadedPhotos(photosListCpy)
        }

    }

    function sendAnswerHandle() {
        let photos: MediaProps[] = []
        uploadedPhotos.forEach(p => photos.push({contentType: PICTURE_TYPE, content: p}))
        currentGroup && sendAnswer && sendAnswer({
            photos,
            gameResults: gamesResults,
            groupId: currentGroup.id,
            activityId: selectedActivity.id
        })
    }


    return (<>
        <IonPage>
            <PupilMenuBar/>
            <IonContent scrollY={false}>
                <IonContent id={"renderingOptionsList"} scrollY={false}>
                    <IonTitle
                        class={"title"}>{currentGroup?.name}
                    </IonTitle>
                    <IonItem class={"renderingOption"} onClick={() => {
                        deselectOption();
                        let opt = document.getElementById("currentActivitiesOption");
                        let ico = document.getElementById("currentActivitiesOptionIcon");
                        if (opt !== null && ico !== null) {
                            opt.style.color = "#6d4e04";
                            opt.style.backgroundColor = "#f3e9d7";
                            ico.style.color = "#d69c09";
                        }
                        setRenderingComponent("currentActivities");
                    }} id={"currentActivitiesOption"}>
                        <IonLabel>
                            Activități curente
                        </IonLabel>
                        <IonIcon icon={gameController} class={"renderingOptionIcon"}
                                 id={"currentActivitiesOptionIcon"}/>
                    </IonItem>

                    <IonItem class={"renderingOption"} onClick={() => {
                        deselectOption();
                        let opt = document.getElementById("earnedBadgesOption");
                        let ico = document.getElementById("earnedBadgesOptionIcon");
                        if (opt !== null && ico !== null) {
                            opt.style.color = "#6d4e04";
                            opt.style.backgroundColor = "#f3e9d7";
                            ico.style.color = "#d69c09";
                        }
                        setRenderingComponent("earnedBadges");
                    }} id={"earnedBadgesOption"}>
                        <IonLabel>
                            Insigne primite
                        </IonLabel>
                        <IonIcon icon={medal} class={"renderingOptionIcon"} id={"earnedBadgesOptionIcon"}/>
                    </IonItem>
                </IonContent>

                {/*CURRENT ACTIVITIES*/}
                {renderingComponent === "currentActivities" &&
                <IonContent class={"renderedComponent"} scrollY={false}>
                    <IonList>
                        {/*{searchedUsers.length === 0 && <IonImg id={"searchMemberTitle"} src={squirrel}/>}*/}
                        {currentActivities && currentActivities.map(act => {
                            return (<IonCard class={"currentActivity"} key={act.id} onClick={() => {
                                setRenderingComponent("selectedActivity");
                                setSelectedActivity(act)
                            }}>
                                <div>
                                    <IonCardTitle>{act.title}</IonCardTitle>
                                    <IonCardSubtitle>Activă până în: {new Date(act.dueDate!).toLocaleString('ro', {
                                        year: "numeric", month: "long",
                                        day: "numeric"
                                    })}</IonCardSubtitle>
                                </div>
                            </IonCard>)
                        })}

                        <IonLoading isOpen={fetchingActivities} message={"Încărcăm lista de activități..."}/>

                    </IonList>
                </IonContent>}

                {/*SELECTED ACTIVTY*/}
                {renderingComponent === "selectedActivity" &&
                <IonContent class={"renderedComponent"}>
                    <IonButton onClick={() => setRenderingComponent("currentActivities")}
                               id={"btnBack"}>Înapoi</IonButton>
                    <IonItem lines={"none"}>
                        <IonTitle class={"title"}>{selectedActivity.title}</IonTitle>
                    </IonItem>
                    {selectedActivity.dueDate && <IonItem className={"activityItems"} lines={"none"}>
                        <IonCardSubtitle id={"dateSubtitle"}>{new Date(selectedActivity.dueDate!).toLocaleString('ro', {
                            year: "numeric", month: "long",
                            day: "numeric"
                        })}</IonCardSubtitle>
                    </IonItem>}
                    {selectedActivity.description && selectedActivity.description.trim() !== '' &&
                    <IonItem className={"activityItems"}>
                        <IonText>{selectedActivity.description}</IonText>
                    </IonItem>}


                    {selectedActivity.media && selectedActivity.media.length > 0 && <div
                        className={"activityItems"}>{selectedActivity.media?.filter(m => m.contentType === VIDEO_TYPE).map(m => {
                        return <video className={"loadedVideo"}
                                      key={m.content?.substr(100, 10)}
                                      width={200} height={200} controls>
                            <source src={VIDEO_TYPE + m.content} type="video/mp4"/>
                        </video>
                    })}</div>}

                    {selectedActivity.media && selectedActivity.media.length > 0 &&
                    <div className={"activityItems"}><IonSlides options={{
                        speed: 500,
                        effect: "cube",
                        paginationType: "fraction",
                        loop: true

                    }} pager={true}> {selectedActivity.media?.filter(m => m.contentType === PICTURE_TYPE).map(m =>
                        <IonSlide>
                            <IonImg src={PICTURE_TYPE + m.content}
                                    key={m.content?.substr(100, 10)}/>
                        </IonSlide>)}
                    </IonSlides>
                    </div>}

                    {selectedActivity.links && selectedActivity.links.length > 0 &&
                    <IonItem class={"activityItems"}>{selectedActivity.links.map(l =>
                        <a href={l.link} rel="noreferrer" target={"_blank"}>{l.description}</a>
                    )}</IonItem>}
                    {selectedActivity.games && selectedActivity.games.length > 0 &&
                    <IonItem className={"activityItems"}>
                        {selectedActivity.games.map(g => <div key={g.id} className={"checkedGamesListItem"}>
                            <IonRouterLink className={"gameModalListItemLabel"}
                                           href={"/games/" + g.name!.toLowerCase() + "/" + selectedActivity.id}
                                           target={"_blank"}><IonAvatar>
                                <img key={g.id}
                                     className={"checkedGamesListItemAvatar"}
                                     src={g.picture ? (PICTURE_TYPE + g.picture) : (pic)}
                                     alt={"Fotografie joc"}/>
                            </IonAvatar>
                                <IonCardTitle>{g.name}</IonCardTitle>
                            </IonRouterLink>
                        </div>)}
                    </IonItem>}

                    <br/><br/>

                    <IonTitle class={"title"}>Răspunsuri</IonTitle>
                    {gamesResults && gamesResults.length > 0 &&
                    <div className={"answerDiv"}>
                        <IonTitle class={"gamePoints"}><u>PUNCTAJE JOCURI</u> <IonIcon icon={podium}/></IonTitle>
                        <br/>
                        {gamesResults.map(gr =>
                            <div className={"result"}>
                                <IonCardTitle>{gr.game}</IonCardTitle>
                                <IonCardSubtitle>Rezultat: {gr.result}</IonCardSubtitle>
                            </div>
                        )}
                    </div>}
                    <IonItemDivider/>
                    <div className={"answerDiv"}>
                        <IonTitle class={"gamePoints"}><u>Răspunsuri foto</u> <IonIcon icon={image}/></IonTitle>
                        <IonItem class={"activityItems addActivityComponentBtn"} onClick={loadPhoto} lines={"none"}>
                            <IonIcon icon={camera} class={"addActivityComponentIcon"}/>
                            <IonLabel>Atașează răspunsuri foto</IonLabel>
                        </IonItem>
                        <div id={"mediaContent"} className={"newActivityLink"}>
                            {uploadedPhotos && uploadedPhotos.map(photo => <IonImg src={photo} class={"loadedImage"}
                                                                                   key={photo.substr(100, 10)}/>)}
                        </div>
                    </div>

                    <IonItem class={"activityItems"} lines={"none"}>
                        <IonButton slot={"end"} onClick={sendAnswerHandle} id={"answerBtn"}>Răspunde</IonButton>
                    </IonItem>
                </IonContent>}
            </IonContent>
        </IonPage>
    </>)
}