import {authorizationConfig, baseUrl, getLogger, withLogs} from "../../core";
import axios from "axios";
import {GroupProperties} from "../provider/GroupsProvider";

const groupsURL = `http://${baseUrl}/groups`;

export const getGroups: (token?:string) => Promise<GroupProperties[]> = ((token) => {
    let response = axios.get(groupsURL, authorizationConfig(token));
    return withLogs(response, 'getGroups')
})

export const addGroup:(token?:string, name?:string, img?:string)=>Promise<GroupProperties>=((token, name, img)=>{
    let response = axios.put(groupsURL,{name,img}, authorizationConfig(token));
    return withLogs(response, 'addGroup')
})

export const getGroupDetails:(token?:string, groupID?:string)=>Promise<GroupProperties>=((token, groupID)=>{
    let response = axios.get(groupsURL+"/"+groupID, authorizationConfig(token));
    return withLogs(response, 'getGroupDetails')
})
