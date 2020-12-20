import React, {useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {getLogger} from '../core';
import {login as loginApi} from './AuthenticationApi'
import {sign} from "crypto";

const log=getLogger('AuthenticationProvider');

type LoginFunction = (username?:string, password?:string)=> void;
type LogoutFunction = ()=> void;
type SignupFunction = ()=> void;

export interface AuthState{
    authenticationError: Error | null;
    isAuthenticated: boolean;
    isAuthenticating: boolean;
    login?: LoginFunction;
    logout?:LogoutFunction;
    pendingAuthentication?:boolean;
    username?:string;
    password?:string;
    token:string;
}

export interface SignupState{
    isSignedup:boolean;
    pendingSignup:boolean;
    signup?:SignupFunction;
    signupError:Error | null;
    firstName?: string;
    lastName?:string;
    email?:string;
    userType?:string;
    kindergarten?:string;
    username?:string;
    password?:string;
}

const loginInitialState: AuthState={
    isAuthenticated:false,
    isAuthenticating:false,
    authenticationError:null,
    pendingAuthentication: false,
    token:'',
}
const signupInitialState: SignupState={
    isSignedup:false,
    pendingSignup:false,
    signupError:null
}

export const AuthContext=React.createContext<AuthState>(loginInitialState);
export const SignupContext=React.createContext<SignupState>(signupInitialState);

interface AuthProviderProps{
    children: PropTypes.ReactNodeLike
}

export const AuthenticationProvider: React.FC<AuthProviderProps>=
    ({children})=>{
    const [state, setState]=useState(loginInitialState);
    const {isAuthenticated, isAuthenticating, authenticationError, pendingAuthentication, token}=state;
    const login=useCallback(loginCallback, []);
    const logout=useCallback(logoutCallback, []);
    useEffect(authenticationEffect, [pendingAuthentication]);
    const value={isAuthenticated, login, isAuthenticating, authenticationError, token, logout};
    log('render');

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );

    function loginCallback(username?:string, password?:string):
    void{
        log('login');
        setState({
            ...state,
            pendingAuthentication:true,
            username,
            password
        });
    }

    function logoutCallback(username?:string, password?:string):
            void{
            log('logout');
            setState({
                ...state,
                isAuthenticated:false,
                username,
                password
            });
            (async () => {
                await sessionStorage.clear();
            })();
        }

    function authenticationEffect(){
        let canceled=false;
        authenticate();
        return()=>{
            canceled=true;
        }

        async function authenticate(){
            let token = await sessionStorage.getItem("token")
            if(token){
                setState({
                    ...state,
                    token: token,
                    pendingAuthentication: false,
                    isAuthenticated: true,
                    isAuthenticating: false,
                });
            }
            if(!pendingAuthentication){
                log('authenticate, !pendingAuthentication, return');
                return;
            }
            try{
                log('authenticate...');
                setState({
                    ...state,
                    isAuthenticating:true
                });
                const {username, password}=state;
                const {token}=await loginApi(username, password);
                if(canceled){
                    return;
                }
                log('authentication succedeed');
                await sessionStorage.setItem("token",token)
                setState({
                    ...state,
                    token,
                    pendingAuthentication:false,
                    isAuthenticated:true,
                    isAuthenticating:false
                });
            }catch(error){
                if(canceled){
                    return;
                }
                log('Authentication failed!');
                setState({
                    ...state,
                    authenticationError: error,
                    pendingAuthentication: false,
                    isAuthenticating: false,
                });
            }
        }
    }
};