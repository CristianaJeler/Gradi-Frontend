import React, {useCallback, useContext, useEffect, useReducer} from "react";
import PropTypes from "prop-types";
import {LoginContext} from "../../authentication";

import {getAllGames as getAllGamesApi} from "../api/GamesApi"
export interface GamesState {
    fetchingGames:boolean,
    games?:GameProps[],
    fetchGamesError:Error|null,
    getAllGames?:GetAllGamesFunction
}

export interface GameProps{
    id?:string,
    fullDescription?:string,
    shortDescription?:string,
    field?:string,
    picture?:string,
    name?:string
}
const initialState: GamesState = {
    fetchGamesError: null,
    fetchingGames: false

}
export const GamesContext = React.createContext<GamesState>(initialState);

interface GamesProviderProps {
    children: PropTypes.ReactNodeLike,
}

interface ActionProperties {
    type: string,
    payload?: any,
}

type GetAllGamesFunction=()=>Promise<any>

const GET_ALL_GAMES_STARTED = 'GET_ALL_GAMES_STARTED'
const GET_ALL_GAMES_FAILED = 'GET_ALL_GAMES_FAILED'
const GET_ALL_GAMES_SUCCEEDED = 'GET_ALL_GAMES_SUCCEEDED'

const reducer: (state: GamesState, action: ActionProperties) => GamesState =
    (state, {type, payload}) => {
        switch (type) {
            case GET_ALL_GAMES_SUCCEEDED:
                return {
                    ...state,
                    fetchingGames:false,
                    fetchGamesError:null,
                    games:payload.games
                };
            case GET_ALL_GAMES_STARTED:
                return {
                    ...state,
                    fetchingGames: true,
                    fetchGamesError: null
                };
            case GET_ALL_GAMES_FAILED:
                return {...state, fetchGamesError: payload.error, fetchGames: false};
            default:
                return state;
        }
    };


export const GamesProvider: React.FC<GamesProviderProps> = ({children}) => {
    const {token} = useContext(LoginContext)
    const getAllGames = useCallback<GetAllGamesFunction>(getAllGamesCallback, [token])
    const [state, dispatch] = useReducer(reducer, initialState);
    const {
        fetchingGames,
        fetchGamesError,
        games
    } = state;

    async function getAllGamesCallback(){
        if(!token.trim()){
            return
        }else{
            dispatch({type:GET_ALL_GAMES_STARTED})
            try{
                let games=await getAllGamesApi(token)
                dispatch({type:GET_ALL_GAMES_SUCCEEDED, payload:{games}})
            }catch (error){
                dispatch({type:GET_ALL_GAMES_FAILED, payload:{error}})
            }
        }
    }

    return (
        <GamesContext.Provider value={{
            fetchGamesError,
            fetchingGames,
            games,
            getAllGames
        }}>
            {children}
        </GamesContext.Provider>
    );
}
