import {authorizationConfig, baseUrl, withLogs} from "../../core";
import {ActivityProps, AnswerProps} from "../provider/ActivitiesProvider";
import axios from "axios";

const activitiesURL=`http://${baseUrl}/activities`

export const addActivity:(token?:string, activity?:ActivityProps, members?:string[])=>Promise<any>=(token, activity, members)=>{
    const res=axios.put(activitiesURL+"/assign",{activity, members},authorizationConfig(token))
    return withLogs(res,"addActivity")
}

export const getCurrentActivities:(token?:string, memberId?:string, groupId?:string)=>Promise<ActivityProps[]>=(token, memberId, groupId)=>{
    const res=axios.get(activitiesURL+`/currentAct/${memberId}/${groupId}`,authorizationConfig(token))
    console.log(res)
    return withLogs(res,"getCurrentActivities")
}

export const sendAnswer:(token?:string,answer?:AnswerProps)=>Promise<any>=(token, answer)=>{
    const res=axios.put(activitiesURL+"/answer",answer,authorizationConfig(token))
    return withLogs(res, "sendAnswer")
}

export const getAnswers:(token?:string, activityId?:string)=>Promise<any>=(token, activityId)=>{
    const res=axios.get(activitiesURL+"/answers/"+activityId, authorizationConfig(token))
    return withLogs(res, 'getAnswers')
}

export const getActivitiesFromGroup:(token?:string, groupId?:string)=>Promise<ActivityProps[]>=(token, groupId)=>{
    const res=axios.get(activitiesURL+`/currentAct/${groupId}`,authorizationConfig(token))
    console.log(res)
    return withLogs(res,"getActivitiesFromGroup")
}