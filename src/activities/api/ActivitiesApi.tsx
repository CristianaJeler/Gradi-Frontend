import {authorizationConfig, baseUrl, withLogs} from "../../core";
import {ActivityProps, AnswerProps} from "../provider/ActivitiesProvider";
import axios from "axios";
import {BadgeProps} from "../provider/ActivitiesProvider";

const activitiesURL=`http://${baseUrl}/activities`
const badgesURL=`http://${baseUrl}/badges`

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



export const getAllBadges:(token?:string)=>Promise<BadgeProps[]>=(token)=>{
    const res=axios.get(badgesURL,authorizationConfig(token))
    return withLogs(res,"getAllBadges")
}

export const rewardBadge:(token?:string, badgeId?:number, userId?:string)=>Promise<BadgeProps[]>=(token, badgeId, userId)=>{
    const res=axios.put(badgesURL+"/award",{badgeId:badgeId,userId:userId},authorizationConfig(token))
    return withLogs(res,"rewardBadge")
}

export const earnedBadges:(token?:string, userToken?:string)=>Promise<BadgeProps[]>=(token, userToken)=>{
    const res=axios.get(badgesURL+"/earned/"+userToken,authorizationConfig(token))
    return withLogs(res,"earnedBadges")
}