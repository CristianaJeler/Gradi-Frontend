import React, {useContext, useEffect, useState} from 'react';
import {Redirect} from 'react-router-dom';
import {RouteComponentProps} from "react-router-dom";
import {
    IonAlert,
    IonBadge,
    IonButton, IonCard,
    IonContent, IonGrid,
    IonHeader, IonIcon,
    IonInput, IonLabel,
    IonLoading,
    IonPage, IonTabBar, IonTabs, IonText, IonTitle,
    IonToolbar,IonToast
} from "@ionic/react";

import {AuthContext} from "./AuthenticationProvider";
import {getLogger} from '../core';
import "./login.page.css"
import {LoginHeader} from "../design/login/LoginHeader";
import {eye, lockOpen, mail, person} from "ionicons/icons";
const log=getLogger("Login");

interface LoginState{
    username?:string;
    password?:string;
}

export const Login: React.FC<RouteComponentProps>=()=>{
    const {isAuthenticated, isAuthenticating, login, authenticationError}=useContext(AuthContext);
    const [loginState, setState]=useState<LoginState>({});
    const {username, password}=loginState;
    const handleLogin=()=>{
        log('handleLogin...');
        login?.(username, password);
    };

    log('render');
    if(isAuthenticated){
        return <Redirect to={{pathname:'/'}}/>
    }


    return(
        <IonPage>
            <LoginHeader/>
            <IonContent  id={"login_page"}>
                <IonCard id={"login_grid"}>
                    <IonInput
                        className={"input"}
                        placeholder="Utilizator"
                        value={username}
                        onIonChange={e=>setState({...loginState, username:e.detail.value||''})}>
                        <IonIcon icon={person}/>
                    </IonInput>
                        <IonInput
                            type={"password"}
                            className={"input"}
                            placeholder="Parolă"
                            value={password}
                            onIonChange={e=>setState({...loginState, password: e.detail.value||''})}>
                            <IonIcon icon={lockOpen}/>
                            <IonIcon icon={eye}/>

                        </IonInput>
                    <IonLoading isOpen={isAuthenticating}/>
                    {authenticationError &&(
                        // <div>{authenticationError.message || 'Failed to authenticate'}</div>
                        <IonAlert isOpen={true}
                                  header={'Alert'}
                                  message={'This is an alert message.'}
                                  buttons={['OK']}
                        />
                    )}
                    <IonButton onClick={handleLogin} id={"loginBtn"} color={"default"}>Login</IonButton>
                </IonCard>
            </IonContent>
        </IonPage>
    )
};
export default Login;