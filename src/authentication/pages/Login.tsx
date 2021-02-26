import React, {useContext, useEffect, useState} from 'react';
import {Redirect} from 'react-router-dom';
import {RouteComponentProps} from "react-router-dom";
import {
    IonAlert,
    IonButton, IonCard,
    IonContent,
    IonIcon,
    IonInput,
    IonLoading,
    IonPage
} from "@ionic/react";

import {LoginContext} from "../provider/AuthenticationProvider";
import {getLogger} from '../../core';
import "./design/login.page.css"
import {AuthHeader} from "./design/AuthHeader";
import {eye, lockOpen, person} from "ionicons/icons";

const log = getLogger("Login");

interface LoginState {
    username?: string;
    password?: string;
}

export const Login: React.FC<RouteComponentProps> = ({history}) => {
    const {isAuthenticated, isAuthenticating, login, authenticationError, userType} = useContext(LoginContext);
    const [loginState, setState] = useState<LoginState>({});
    const {username, password} = loginState;
    useEffect(() => {
        return () => {
            console.log("cleaned up");
        };
    }, []);

    const handleLogin = () => {
        log('handleLogin...');
        login?.(username, password);
    };

    log('render');
    if (isAuthenticated) {
        console.log(userType)
        switch (userType) {
            case "1":
                return <Redirect to={{pathname: '/teachers/home'}}/>
            case '2':
                return <Redirect to={{pathname: '/pupils/home'}}/>
        }
    }

    return (
        <IonPage>
            <AuthHeader/>
            <IonContent id={"login_page"}>
                <IonCard id={"login_grid"}>
                    <IonInput
                        className={"input"}
                        placeholder="Utilizator"
                        value={username}
                        onIonChange={e => setState({...loginState, username: e.detail.value || ''})}>
                        <IonIcon icon={person}/>
                    </IonInput>
                    <IonInput
                        type={"password"}
                        id={"password"}
                        className={"input"}
                        placeholder="Parolă"
                        value={password}
                        onIonChange={e => setState({...loginState, password: e.detail.value || ''})}>
                        <IonIcon icon={lockOpen}/>
                        <IonIcon icon={eye}/>
                    </IonInput>
                    <IonLoading isOpen={isAuthenticating}/>
                    {authenticationError && (
                        // <div>{authenticationError.message || 'Failed to authenticate'}</div>
                        <IonAlert isOpen={true}
                                  cssClass={"ion-alert"}
                                  header={'Eroare de autentificare!'}
                                  message={'Autentificare eșuată! Reîncercați!'}
                        />
                    )}

                    <IonButton onClick={handleLogin} id={"loginBtn"} color={"default"}>Autentificare</IonButton>
                    <br/>
                    <a href={"/signup"} id={"signupLink"}>Creează cont!</a>
                </IonCard>
            </IonContent>
        </IonPage>
    )
};
export default Login;