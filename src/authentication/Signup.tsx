import React, {useContext, useEffect, useState} from 'react';
import {Redirect} from 'react-router-dom';
import {RouteComponentProps} from "react-router-dom";
import {
    CreateAnimation,
    IonButton,
    IonCard,
    IonContent, IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonPage,
    IonSelect,
    IonSelectOption,
    createAnimation
} from "@ionic/react";

import {closeCircle, eye, lockOpen, mail, peopleCircle, person} from "ionicons/icons";
import {SignupContext} from "./AuthenticationProvider";
import {getLogger} from '../core';
import "./signup.page.css"
import {LoginHeader} from "../design/login/LoginHeader";
import {signup} from "./AuthenticationApi";
const log=getLogger("Login");

interface SignupState{
    firstName?: string;
    lastName?:string;
    email?:string;
    userType?:string;
    kindergarten?:string;
    username?:string;
    password?:string;
    password_check?:string;
}

export const Signup: React.FC<RouteComponentProps>=()=>{
    const {isSignedup, pendingSignup, signupError, }=useContext(SignupContext);
    const [signupState, setState]=useState<SignupState>({});
    const {firstName,lastName,email,userType,kindergarten,username, password, password_check}=signupState;
    const [passState,setPassState]=useState<boolean>(true)
    const handleSignup=()=>{
        log('handleSignup...');
        if(password_check!==password) setPassState(false);
        else{
            setPassState(true);
            signup?.(firstName,lastName,email,userType,kindergarten,username,password);
        }

    };
    log('render');
    if(isSignedup){
            return <Redirect to={{pathname:'/login'}}/>
    }

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
            <LoginHeader/>
            <IonContent  id={"signup_page"}>
                <IonCard id={"signup_grid"}>
                    <IonSelect placeholder={"Tipul de utilizator"} class={"signup_input"}>
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
                    <IonButton onClick={handleSignup} id={"signupBtn"} color={"default"}>Signup</IonButton>
                </IonCard>
            </IonContent>
        </IonPage>
    );
};

export default Signup;