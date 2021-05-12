import React, {useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {getLogger} from '../../core';
import {login as loginApi, signup as signupApi, SignupProps} from '../api/AuthenticationApi'
import {Storage} from "@capacitor/core";

const log = getLogger('AuthenticationProvider');

type LoginFunction = (username?: string, password?: string) => void;
type LogoutFunction = () => void;
type SignupFunction = (user: SignupProps) => Promise<any>;

export interface LoginState {
    authenticationError: Error | null;
    isAuthenticated: boolean;
    isAuthenticating: boolean;
    login?: LoginFunction;
    logout?: LogoutFunction;
    pendingAuthentication?: boolean;
    username?: string;
    password?: string;
    token: string;
    userType?: string;
}

const loginInitialState: LoginState = {
    isAuthenticated: true,
    isAuthenticating: false,
    authenticationError: null,
    pendingAuthentication: false,
    token: '',
}

export interface SignupState {
    isSigned: boolean;
    pendingSignup: boolean;
    signup?: SignupFunction;
    signupError: Error | null;
    firstName?: string;
    lastName?: string;
    email?: string;
    userType?: string;
    username?: string;
    password?: string;
}

const signupInitialState: SignupState = {
    isSigned: false,
    pendingSignup: false,
    signupError: null
}

export const LoginContext = React.createContext<LoginState>(loginInitialState);
export const SignupContext = React.createContext<SignupState>(signupInitialState);


interface AuthProviderProps {
    children: PropTypes.ReactNodeLike
}

export const AuthenticationProvider: React.FC<AuthProviderProps> =
    ({children}) => {
        const [loginState, setLoginState] = useState(loginInitialState);
        const [signupState, setSignedUpState] = useState(signupInitialState)
        const {
            isAuthenticated,
            isAuthenticating,
            authenticationError,
            pendingAuthentication,
            token,
            userType
        } = loginState;
        const {isSigned, pendingSignup, signupError} = signupState
        const login = useCallback(loginCallback, [loginState]);
        const signup = useCallback<SignupFunction>(signupCallback, [])
        const logout = useCallback(logoutCallback, []);
        useEffect(authenticationEffect, [pendingAuthentication]);
        const loginValue = {isAuthenticated, login, isAuthenticating, authenticationError, token, logout, userType};
        const signupValue = {isSigned, pendingSignup, signupError, signup}
        log('render');

        return (
            <SignupContext.Provider value={signupValue}>
                <LoginContext.Provider value={loginValue}>
                    {children}
                </LoginContext.Provider>
            </SignupContext.Provider>
        );

        function loginCallback(username?: string, password?: string):
            void {
            log('login');
            setLoginState({
                ...loginState,
                pendingAuthentication: true,
                authenticationError:null,
                username,
                password
            });
        }

        function logoutCallback():
            void {
            log('logout');
            setLoginState({
                ...loginState,
                isAuthenticated: false,
            });
            setSignedUpState({
                ...signupState,
                isSigned:false,
            });
            (async () => {
                await Storage.clear();
            })();
        }

        function authenticationEffect() {
            let canceled = false;
            authenticate();
            return () => {
                canceled = true;
            }

            async function authenticate() {
                let token = await Storage.get({key: "token"})
                let userType = await Storage.get({key: "userType"})
                if (token.value && userType.value) {
                    setLoginState({
                        ...loginState,
                        token: token.value,
                        userType: userType.value,
                        pendingAuthentication: false,
                        isAuthenticated: true,
                        isAuthenticating: false,
                    });
                }else{
                    setLoginState({
                        ...loginState,
                        token: '',
                        userType: '',
                        isAuthenticated: false,
                        isAuthenticating: false,
                    });
                }
                if (!pendingAuthentication) {
                    log('authenticate, !pendingAuthentication, return');
                    return;
                }
                try {
                    log('authenticate...');
                    setLoginState({
                        ...loginState,
                        isAuthenticating: true
                    });
                    const {username, password} = loginState;
                    console.log(username + " " + password)
                    const {token, userType} = await loginApi(username, password);
                    if (canceled) {
                        return;
                    }
                    log('authentication succedeed');

                    await Storage.set({key: "token", value: token})
                    await Storage.set({key: "userType", value: userType})

                    setLoginState({
                        ...loginState,
                        token,
                        userType,
                        pendingAuthentication: false,
                        isAuthenticated: true,
                        isAuthenticating: false
                    });
                } catch (error) {
                    if (canceled) {
                        return;
                    }
                    log('Authentication failed!');
                    setLoginState({
                        ...loginState,
                        authenticationError: error,
                        pendingAuthentication: false,
                        isAuthenticating: false,
                    });
                }
            }
        }

        async function signupCallback(user: SignupProps) {
            setSignedUpState({
                ...signupState,
                signupError: null,
                pendingSignup: true,
                isSigned: false,
            });
            let res = await signupApi(user.firstName, user.lastName, user.email, user.status, user.username, user.password)
            console.log(typeof(res.succeeded))
            if (res.succeeded === false) {
                setSignedUpState({
                    ...signupState,
                    signupError: new Error(res.message),
                    pendingSignup: false,
                    isSigned:false,
                });
            }else{
                setSignedUpState({
                    ...signupState,
                    signupError:null,
                    pendingSignup: false,
                    isSigned: true,
                });
            }
        }
    };