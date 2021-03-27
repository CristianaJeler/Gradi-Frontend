import React, {useContext, useEffect, useState} from 'react';
import {RouteComponentProps} from "react-router-dom";
import {
    CreateAnimation,
    IonButton,
    IonCard,
    IonContent, IonIcon,
    IonInput,
    IonPage,
    IonSelect,
    IonSelectOption,
    createAnimation,
    IonLoading,
    IonAlert
} from "@ionic/react";

import {eye, lockOpen, mail, person} from "ionicons/icons";
import {getLogger} from '../../core';
import "./design/signup.page.css"
import {AuthHeader} from "./AuthHeader";
import {SignupContext} from "../provider/AuthenticationProvider";
const log=getLogger("Login");

interface SignupState{
    firstName?: string;
    lastName?:string;
    email?:string;
    status?:string;
    username?:string;
    password?:string;
    password_check?:string;
}

export const Signup: React.FC<RouteComponentProps>=({history})=>{
    const {isSigned, pendingSignup, signupError, signup}=useContext(SignupContext);
    const [signupState, setState]=useState<SignupState>({});
    const {firstName,lastName,email,status,username, password, password_check}=signupState;
    const [passState,setPassState]=useState<boolean>(true)
    const [showSignupError, setShowSignupError]=useState(false)

    useEffect(() => {
        return () => {
            console.log("cleaned up");
            setShowSignupError(false)
        };
    }, []);
    const handleSignup=()=>{
        log('handleSignup...')
        if(password_check!==password) setPassState(false);
        else{
            setPassState(true);
            signup && signup({firstName: firstName||'',lastName:lastName || '',email:email ||'',status:status||'',username:username||'',password:password||''})
        }

    };
    const animation=function simpleAnimation() {
        const el = document.querySelector('#passwordCheck');
        if (el) {
            const animation = createAnimation()
                .addElement(el)
                .duration(100)
                .direction('alternate')
                .iterations(1)
                .keyframes([
                    { offset: 0, transform: 'translateX(0px)'},
                    {offset: 0.2, transform: 'translateX(10px)'},
                    {offset: 0.4, transform: 'translateX(0px)'},
                    {offset: 0.6, transform: 'translateX(-10px)'},
                    {offset: 1, transform: 'translateX(0px)'}
                ])
                .onFinish(()=>setPassState(true));
            animation.play();
        }
    }
    return(
        <IonPage>
            <AuthHeader/>
            <IonContent  id={"signup_page"}>
                <IonCard id={"signup_grid"}>
                    <IonSelect placeholder={"Tipul de utilizator"} class={"signup_input"} value={status} onIonChange={e=>setState({...signupState, status:e.detail.value||''})}>
                            <IonSelectOption value={"1"}>
                                Educator
                            </IonSelectOption>
                            <IonSelectOption value={"2"}>
                                Elev/Părinte
                            </IonSelectOption>
                        </IonSelect>
                    <IonInput
                            className={"signup_input"}
                            placeholder="Nume"
                            value={lastName}
                            onIonChange={e=>setState({...signupState, lastName:e.detail.value||''})}>
                        <IonIcon icon={person}/>
                    </IonInput>
                    <IonInput
                            className={"signup_input"}
                            placeholder="Prenume"
                            value={firstName}
                            onIonChange={e=>setState({...signupState, firstName:e.detail.value||''})}>
                        <IonIcon icon={person}/>
                    </IonInput>
                    <IonInput
                            className={"signup_input"}
                            placeholder="Email"
                            value={email}
                            onIonChange={e=>setState({...signupState, email:e.detail.value||''})}>
                        <IonIcon icon={mail}/>
                    </IonInput>

                    <IonInput
                        type={"text"}
                        id={"username"}
                        className={"signup_input"}
                        placeholder="Utilizator"
                        value={username}
                        onIonChange={e=>{
                            setPassState(true);
                            setState({...signupState, username:e.detail.value||''})
                        }}>
                        <IonIcon icon={person}/>
                        <IonIcon className={"icon"} icon={eye}/>
                        {!passState && (<CreateAnimation
                            ref={animation}
                        />)
                        }
                    </IonInput>

                    <IonInput
                        className={"signup_input"}
                        placeholder="Parolă"
                        value={password}
                        type={"password"}
                        onIonChange={e=>{
                            setPassState(true);
                            setState({...signupState, password:e.detail.value||''})
                        }}>
                        <IonIcon icon={lockOpen}/>
                        <IonIcon className={"icon"} icon={eye}/>
                    </IonInput>
                    <IonInput
                                type={"password"}
                                id={"passwordCheck"}
                                className={"signup_input"}
                                placeholder="Confirmare parolă"
                                value={password_check}
                                onIonChange={e=>{
                                    setPassState(true);
                                    setState({...signupState, password_check:e.detail.value||''})
                                }}>
                           <IonIcon icon={lockOpen}/>
                           <IonIcon className={"icon"} icon={eye}/>
                           {!passState && (<CreateAnimation
                                   ref={animation}
                               />)
                           }
                       </IonInput>
                    <IonButton onClick={handleSignup} id={"signupBtn"} color={"default"}>Înregistrare</IonButton>
                    <br/>
                    <a href={"/login"} id={"signinLink"}>Am cont deja!</a>
                </IonCard>

                {pendingSignup && <IonLoading cssClass="ion-loading" isOpen={true} message={"Înregistrare in curs ..."}/>}
                {signupError!==null && <IonAlert cssClass="ion-alert" isOpen={true} header="Înregistrarea a eșuat!" message={signupError.message}/>}
                {isSigned && <IonAlert isOpen={true} header={"Felicitari!"} message={"Bun venit!\nMergi la pagina de autentificare?"} buttons={[
                    {
                        text: 'DA',
                        handler: () => {
                            history.push("/login");
                        }
                    },
                    {
                        text: 'NU'
                    }
                ]}/>}
            </IonContent>
        </IonPage>
    );
};

export default Signup;