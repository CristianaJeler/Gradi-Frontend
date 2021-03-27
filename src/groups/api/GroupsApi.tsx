import {authorizationConfig, baseUrl, withLogs} from "../../core";
import axios from "axios";
import {GroupProperties} from "../provider/GroupsProvider";

const usersURL = `http://${baseUrl}/groups`;

export const getGroups: (token?:string) => Promise<GroupProperties[]> = ((token) => {
    let response = axios.get(usersURL, authorizationConfig(token));
    response.then(r=>console.log(r.data))
    return withLogs(response, 'getGroups')
})

export const addGroup:(token?:string, name?:string, img?:string)=>Promise<GroupProperties>=((token, name, img)=>{
    let response = axios.put(usersURL+"/add",{name,img}, authorizationConfig(token));
    response.then(r=>console.log(r.data))
    return withLogs(response, 'addGroup')
})