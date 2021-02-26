import React, {useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {getLogger} from '../../core';
import {login as loginApi, signup as signupApi, SignupProps} from '../api/AuthenticationApi'

const log = getLogger('AuthenticationProvider');

type LoginFunction = (username?: string, password?: string) => void;
type LogoutFunction = (username?:string, password?:string) => void;
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
    userType?:string
}

const loginInitialState: LoginState = {
    isAuthenticated: false,
    isAuthenticating: false,
    authenticationError: null,
    pendingAuthentication: false,
    token: '',
}

export interface SignupState {
    isSignedup: boolean;
    pendingSignup: boolean;
    signup?: SignupFunction;
    signupError: Error | null;
    firstName?: string;
    lastName?: string;
    email?: string;
    userType?: string;
    kindergarten?: string;
    username?: string;
    password?: string;
}

const signupInitialState: SignupState = {
    isSignedup: false,
    pendingSignup: false,
    signupError: null
}

export const LoginContext = React.createContext<LoginState>(loginInitialState);
export const SignupContext = React.createContext<SignupState>(signupInitialState);

// export const SignupContext = React.createContext<SignupState>(signupInitialState);

interface AuthProviderProps {
    children: PropTypes.ReactNodeLike
}

export const AuthenticationProvider: React.FC<AuthProviderProps> =
    ({children}) => {
        const [loginState, setLoginState] = useState(loginInitialState);
        const [signupState, setSignedUpState] = useState(signupInitialState)
        const {isAuthenticated, isAuthenticating, authenticationError, pendingAuthentication, token, userType} = loginState;
        const {isSignedup, pendingSignup, signupError} = signupState
        const login = useCallback(loginCallback, []);
        const signup = useCallback<SignupFunction>(signupCallback, [])
        const logout = useCallback(logoutCallback, []);
        useEffect(authenticationEffect, [pendingAuthentication]);
        const loginValue = {isAuthenticated, login, isAuthenticating, authenticationError, token, logout, userType};
        const signupValue={isSignedup, pendingSignup, signupError, signup}
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
                username,
                password
            });
        }

        function logoutCallback(username?: string, password?: string):
            void {
            log('logout');
            setLoginState({
                ...loginState,
                isAuthenticated: false,
                username:'',
                password:''
            });
            (async () => {
                await sessionStorage.clear();
            })();
        }

        function authenticationEffect() {
            let canceled = false;
            authenticate();
            return () => {
                canceled = true;
            }

            async function authenticate() {
                let token = await sessionStorage.getItem("token")
                if (token) {
                    setLoginState({
                        ...loginState,
                        token: token,
                        pendingAuthentication: false,
                        isAuthenticated: true,
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
                    await sessionStorage.setItem("token", token)
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
            try {
                let usr = await signupApi(user.firstName, user.lastName, user.email, user.status, user.username, user.password)
                console.log(usr)
            } catch (error) {
                setSignedUpState({
                    ...signupState,
                    signupError: error,
                    pendingSignup: false,
                    isSignedup: false,
                });
            }
        }
    };