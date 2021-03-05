import axios from "axios";
import {baseUrl, config, withLogs} from '../../core';

const authURL = `http://${baseUrl}/authentication`;

export interface AuthProps {
    token: string;
    userType:string;
    firstName?:string;
    lastName?:string;
    picture?:string
}

export interface SignupProps {
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    username: string;
    password: string;
    message?:string;
    succeeded?:boolean;
}

export const login: (username?: string, password?: string) => Promise<AuthProps> = ((username, password) => {
    let response = axios.post(authURL + "/login", {username, password}, config);
    return withLogs(response, 'login');
})

export const signup: (firstName?: string, lastName?: string, email?: string, status?: string, username?: string, password?: string)
    => Promise<SignupProps> = ((firstName, lastName,
                                email, status, username, password) => {
    let response = axios.post(authURL + "/signup", {firstName, lastName, email, status, username, password}, config)
    return withLogs(response, 'signup')
})