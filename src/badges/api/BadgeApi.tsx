import {authorizationConfig, baseUrl, withLogs} from "../../core";
import axios from "axios";
import {BadgeProps} from "../provider/BadgeProvider";

const activitiesURL=`http://${baseUrl}/badges`

export const getAllBadges:(token?:string)=>Promise<BadgeProps[]>=(token)=>{
    console.log("AICI IN API")
    const res=axios.get(activitiesURL,authorizationConfig(token))
    // console.log(res)
    return withLogs(res,"getAllBadges")
}