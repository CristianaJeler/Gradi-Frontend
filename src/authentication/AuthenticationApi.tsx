import axios from "axios";
import {baseUrl, config, withLogs} from '../core';

const loginUrl=`http://${baseUrl}/api/auth/login`;
const signupUrl=`http://${baseUrl}/api/auth/signup`
export interface AuthProps{
    token:string;
}

export interface SignupProps{
    firstName: string;
    lastName:string;
    email:string;
    userType:string;
    kindergarten:string;
    username:string;
    password:string;
}

export const login:(username?:string, password?:string)=> Promise<AuthProps> =((username, password) => {
    let response=axios.post(loginUrl, {username, password}, config);
    return withLogs(response,'login');
})

export const signup:(firstName?: string,lastName?:string,email?:string,userType?:string,kindergarten?:string,username?:string,password?:string)
    => Promise<SignupProps> =((firstName,lastName,email,userType,kindergarten,username,password) => {
    let response=axios.post(signupUrl, {firstName,lastName,email,userType,kindergarten,username,password}, config);
    return withLogs(response,'signup');
})