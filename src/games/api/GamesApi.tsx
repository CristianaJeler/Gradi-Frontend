import {authorizationConfig, baseUrl, withLogs} from "../../core";
import {GameProps} from "../provider/GamesProvider";
import axios from "axios";

const gamesURL=`http://${baseUrl}/games`

export const getAllGames:(token?:string)=>Promise<GameProps[]>=((token)=>{
    let response = axios.get(gamesURL,  authorizationConfig(token));
    return withLogs(response, 'getAllGames')
})