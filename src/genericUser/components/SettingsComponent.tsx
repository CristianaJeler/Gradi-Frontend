import React, {useContext, useEffect, useState} from "react";

import {
    CreateAnimation,
    createAnimation,
    IonAlert,
    IonButton,
    IonIcon,
    IonImg,
    IonInput,
    IonItem,
    IonItemDivider,
    IonItemGroup,
    IonLabel,
    IonList,
    IonLoading,
    IonTitle,
} from "@ionic/react";
import unknownProfile from "../../assets/img/profile.png"
import "../design/settings.component.css"
import {CameraResultType, CameraSource} from "@capacitor/core";
import {useCamera} from '@ionic/react-hooks/camera'; //custom hook definit de cei de la Ionic
import {base64FromPath} from "@ionic/react-hooks/filesystem";
import {
    help,
    image, lockClosed,
    medical, pencil, person,
} from "ionicons/icons"
import {UserContext} from "../provider/GenericUserProvider";
import {PICTURE_TYPE} from "../utils/pictureType";
import {LoginContext} from "../../authentication";


export const SettingsComponent: React.FC = () => {
    const {logout} = useContext(LoginContext)
    const {getPhoto} = useCamera();
    const [settingsType, setSettingsType]=useState("picture")
    const {
        updateProfilePic,
        updateProfileDetails,
        picture,
        kindergarten,
        email,
        username,
        firstName,
        lastName,
        phone, status,
        gettingAccountDetails,
        getAccountDetailsError,
        profileDetailsUpdateError,
        updatingProfileDetails,
        updatingProfilePicture,
        profilePicUpdateError,
        passwordUpdateError,
        updatingPassword,
        updatePassword,
        passwordUpdatedSuccessfully
    } = useContext(UserContext)

    const [updatedPic, setUpdatedPic] = useState<string>(unknownProfile)
    const [updatedKindergarten, setUpdatedKindergarten] = useState<string>(kindergarten || '')
    const [updatedFirstName, setUpdatedFirstName] = useState<string>(firstName || '')
    const [updatedLastName, setUpdatedLastName] = useState<string>(lastName || '')
    const [updatedPhone, setUpdatedPhone] = useState<string>(phone || '')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [passState, setPassState] = useState(true)
    const [showPasswordAlert, setShowPasswordAlert] = useState(false)


    const takePhoto = async () => {
        const cameraPhoto = await getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 100,
            webUseInput: true //deschide direct input-ul de fisiere din pc
        });

        const base64Data = await base64FromPath(cameraPhoto.webPath!);

        setUpdatedPic(base64Data)
    };

    function updatePic() {
        updateProfilePic && updateProfilePic(updatedPic);
    }

    function updateProfDetails() {
        updateProfileDetails && updateProfileDetails({
            kindergarten: updatedKindergarten,
            firstName: updatedFirstName,
            lastName: updatedLastName,
            phone: updatedPhone,
            description: '',
            picture: '',
            email: email,
            username: username,
            status: status
        })
    }

    function updatePasswordSettings() {
        if (newPassword !== passwordConfirmation) {
            setPassState(false)
        } else {
            updatePassword && updatePassword(currentPassword, newPassword)
        }
    }

    useEffect(() => {
        if (passwordUpdatedSuccessfully)
            logout && logout();
    }, [passwordUpdatedSuccessfully])

    useEffect(() => {
        if (picture)
            if (picture.startsWith(PICTURE_TYPE)) setUpdatedPic(picture)
            else setUpdatedPic(PICTURE_TYPE + picture)
        return;
    }, [picture])

    const animation = function simpleAnimation() {
        const el = document.querySelector('#passwordConfirmation');
        if (el) {
            const animation = createAnimation()
                .addElement(el)
                .duration(100)
                .direction('alternate')
                .iterations(1)
                .keyframes([
                    {offset: 0, transform: 'translateX(0px)'},
                    {offset: 0.2, transform: 'translateX(10px)'},
                    {offset: 0.4, transform: 'translateX(0px)'},
                    {offset: 0.6, transform: 'translateX(-10px)'},
                    {offset: 1, transform: 'translateX(0px)'}
                ])
                .keyframes([
                    {offset: 0, color: 'red'},
                    {offset: 0.72, color: 'var(--background)'},
                    {offset: 1, color: 'black'}
                ])
                .onFinish(() => setPassState(true));
            animation.play();
        }
    }
    return (
        <>
            <IonItemGroup class={"settingsOptions"}>
                <IonList>
                    <IonItem class={"settingsOption"} onClick={()=>setSettingsType("picture")}>
                        <IonLabel>Fotografia de profil</IonLabel>
                        <IonIcon icon={image}/>
                    </IonItem>
                    <IonItem class={"settingsOption"}  onClick={()=>setSettingsType("personal")}>
                        <IonLabel>
                            Informații personale
                        </IonLabel>
                        <IonIcon icon={person}/>
                    </IonItem>
                    <IonItem class={"settingsOption"}  onClick={()=>setSettingsType("security")}>
                        <IonLabel>
                            Securitate
                        </IonLabel>
                        <IonIcon icon={lockClosed}/>
                    </IonItem>
                    <IonItem class={"settingsOption"}>
                        <IonLabel>
                            Ajutor
                        </IonLabel>
                        <IonIcon icon={help}/>
                    </IonItem>
                </IonList>
            </IonItemGroup>
            {settingsType==="picture" && <IonItemGroup color={"light"} class={"settingsForm"}>
                <IonItemDivider>
                    <IonTitle>FOTOGRAFIA DE PROFIL</IonTitle>
                    <IonButton slot={"end"} color={"warning"} onClick={updatePic}>Actualizează</IonButton>
                </IonItemDivider>
                <br/>
                {updatedPic &&
                <IonImg src={updatedPic} id={"profilePic"} onClick={takePhoto} title={"Editați fotografia"}/>}
            </IonItemGroup>}

            {settingsType==="personal" && <IonItemGroup color={"light"} class={"settingsForm"}>
                <IonItemDivider>
                    <IonTitle>INFORMAȚII PERSONALE</IonTitle>
                    <IonButton slot={"end"} color={"warning"} onClick={updateProfDetails}>Actualizează</IonButton>
                </IonItemDivider>
                <IonItem>
                    <IonLabel position="floating">Username</IonLabel>
                    <IonInput readonly
                              value={username}
                              className={"settingsInput"}
                    />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">
                        Nume
                        <IonIcon color={"danger"} icon={medical}/>
                    </IonLabel>
                    <IonInput
                        className={"settingsInput"}
                        value={updatedLastName}
                        onIonChange={(e) => setUpdatedLastName(e.detail.value!)}
                    />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">
                        Prenume
                        <IonIcon color={"danger"} icon={medical}/>
                    </IonLabel>
                    <IonInput
                        className={"settingsInput"}
                        value={updatedFirstName}
                        onIonChange={(e) => setUpdatedFirstName(e.detail.value || '')}
                    />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Număr de telefon</IonLabel>
                    <IonInput
                        className={"settingsInput"}
                        value={updatedPhone}
                        onIonChange={(e) => setUpdatedPhone(e.detail.value || '')}
                    />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Email</IonLabel>
                    <IonInput className={"settingsInput"} readonly value={email}/>
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Unitate de învățământ</IonLabel>
                    <IonInput
                        className={"settingsInput"}
                        value={updatedKindergarten}
                        onIonChange={(e) => setUpdatedKindergarten(e.detail.value || '')}
                    />
                </IonItem>
            </IonItemGroup>}

            {settingsType==="security" && <IonItemGroup color={"light"} class={"settingsForm"}>
                <IonItemDivider>
                    <IonTitle>SECURITATE</IonTitle>
                    <IonButton color={"warning"} onClick={()=>setShowPasswordAlert(true)}>Actualizează</IonButton>
                    <IonAlert isOpen={showPasswordAlert} header={"Atentie!!"} message={"După schimbarea parolei veți fi redirecționat la pagina de autentificare!\nContinuați?"} buttons={[
                        {
                            text: 'DA',
                            handler: () => {
                                updatePasswordSettings();
                            }
                        },
                        {
                            text: 'NU'
                        }
                    ]} onDidDismiss={()=>setShowPasswordAlert(false)}/>
                </IonItemDivider>
                <IonItem>
                    <IonLabel position="floating">Parola actuală</IonLabel>
                    <IonInput type={"password"} value={currentPassword}
                              onIonChange={(e) => setCurrentPassword(e.detail.value || '')}/>
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Parola nouă</IonLabel>
                    <IonInput type={"password"} value={newPassword}
                              onIonChange={(e) => setNewPassword(e.detail.value || '')}/>

                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Confirmare parolă nouă</IonLabel>
                    <IonInput type={"password"} id={"passwordConfirmation"} value={passwordConfirmation}
                              onIonChange={(e) => setPasswordConfirmation(e.detail.value || '')}/>
                </IonItem>
            </IonItemGroup>}
            {gettingAccountDetails && <IonLoading isOpen={true} message={"Se încarcă detaliile de cont!"}/>}
            {getAccountDetailsError &&
            <IonAlert isOpen={true} message={"S-a produs o eroare la obținerea detaliilor de cont!"}/>}
            {updatingProfileDetails && <IonLoading isOpen={true} message={"Se actualizează detaliile de cont!"}/>}
            {profileDetailsUpdateError &&
            <IonAlert isOpen={true} message={"S-a produs o eroare la actualizarea detaliilor de cont!"}/>}
            {updatingProfilePicture && <IonLoading isOpen={true} message={"Se actualizează fotografia de profil!"}/>}
            {profilePicUpdateError &&
            <IonAlert isOpen={true} message={"S-a produs o eroare la actualizarea fotografiei de profil!"}/>}
            {!passState && (<CreateAnimation
                ref={animation}
            />)
            }
            {updatingPassword && <IonLoading isOpen={true} message={"Se actualizează parola!"}/>}
            {passwordUpdateError &&
            <IonAlert isOpen={true} header={"Eroare la actualizarea parolei!"} message={passwordUpdateError.message}/>}
            {/*{passwordUpdatedSuccessfully &&*/}
            {/*<IonToast isOpen={true} duration={700} header={"Parola actualizata cu succes!"}/>}*/}
        </>
    )
}