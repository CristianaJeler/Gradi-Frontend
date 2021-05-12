import axios from "axios";
import {authorizationConfig, baseUrl, withLogs} from '../../core';
import {SearchedUserProps, UserProps} from "../provider/GenericUserProvider"

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
    return withLogs(response, 'updatePassword')
})

export const searchUsers:(searchCriteria?:string, groupID?:string, page?:number, size?:number, token?:string)=>Promise<SearchedUserProps[]>=((searchCriteria, groupID, page, size, token)=>{
    let response = axios.get(usersURL+"/"+searchCriteria+"/"+groupID+"/"+page+"&"+size,  authorizationConfig(token));
    return withLogs(response, 'searchUsers')
})

export const addMemberToGroup:(token?:string, groupID?:string, memberID?:string)=>Promise<any>=((token, groupID, memberID)=>{
    let response = axios.put(usersURL+"/"+memberID+"/"+groupID,{}, authorizationConfig(token));
    return withLogs(response, 'getGroupDetails')
})

export const deleteMemberFromGroup:(token?:string, groupID?:string, memberID?:string)=>Promise<any>=((token, groupID, memberID)=>{
    let response = axios.delete(usersURL+"/"+memberID+"/"+groupID, authorizationConfig(token));
    return withLogs(response, 'deleteMemberFromGroup')
})

export const fetchGroupMembers:(token?:string, groupId?:string)=>Promise<SearchedUserProps[]>=((token, groupId)=>{
    let response = axios.get(usersURL+"/"+groupId,  authorizationConfig(token));
    return withLogs(response, 'getGroupMembers')
})