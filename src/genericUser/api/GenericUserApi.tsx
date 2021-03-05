import axios from "axios";
import {authorizationConfig, baseUrl, withLogs} from '../../core';
import {UserProps} from "../provider/GenericUserProvider"

const usersURL = `http://${baseUrl}/users`;

export interface ApiResponse{
    message?:string,
    succeeded?:boolean
}

export const updateProfilePic: (picture?:string, token?:string) => Promise<string> = ((picture, token) => {
    let response = axios.put(usersURL + "/profilePic", {picture}, authorizationConfig(token));
    return withLogs(response, 'updateProfilePic')
})

export const getProfileDetails:(token?:string)=>Promise<UserProps>=((token)=>{
    let response = axios.get(usersURL+"/details", authorizationConfig(token));
    return withLogs(response, 'getProfileDetails')
})

export const updateProfileDetails:(details?:UserProps, token?:string)=>Promise<UserProps>=((details, token)=>{
    let response = axios.put(usersURL+"/details",details, authorizationConfig(token));
    return withLogs(response, 'updateProfileDetails')
})

export const updatePassword:(oldPassword?:string, newPassword?:string, token?:string)=>Promise<ApiResponse>=((oldPassword,newPassword, token)=>{
    let response = axios.put(usersURL+"/pass", {oldPassword, newPassword}, authorizationConfig(token));
    response.then(r=>console.log(r.data))
    return withLogs(response, 'updatePassword')
})