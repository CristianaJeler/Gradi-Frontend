import React, {useCallback, useContext, useReducer} from "react";
import PropTypes from "prop-types";
import {LoginContext} from "../../authentication";
import {GameProps} from "../../games/provider/GamesProvider";
import {addActivity as addActivityApi, getCurrentActivities as getCurrentActivitiesApi, sendAnswer as sendAnswerApi,
getAnswers as getAnswersApi, getActivitiesFromGroup as getActivitiesFromGroupApi} from "../api/ActivitiesApi";

type AddActivityFunction = (activity:ActivityProps, members:string[]) => Promise<any>
type GetCurrentActivitiesFunction = (memberId:string, groupId:string) => Promise<any>
type SendAnswerFunction = (answer:AnswerProps) => Promise<any>
type GetAnswersFunction=(groupId?:string)=>Promise<any>
type GetActivitiesFromThisGroup=(groupId?:string)=>Promise<any>

export interface ActivitiesState {
    addActivity?: AddActivityFunction,
    currentActivities:ActivityProps[],
    groupActivities:ActivityProps[],
    getCurrentActivities?:GetCurrentActivitiesFunction,
    fetchingActivities:boolean,
    fetchActivitiesError:Error|null,
    sendAnswer?:SendAnswerFunction,
    getAnswers?:GetAnswersFunction,
    answers:AnswerProps[],
    getActivitiesAssignedFromThisGroup?:GetActivitiesFromThisGroup
}

export interface MediaProps {
    id?: string,
    content?: string,
    contentType?:string
}

export interface LinkProps {
    link: string,
    description: string
}

export interface ActivityProps {
    id?: string,
    title?:string,
    field?:string,
    description?: string,
    dueDate?: string,
    assignedBy?: string,
    games?: GameProps[],
    media?: MediaProps[],
    links?: LinkProps[],
    groupId?:string
}

export interface GameResultProps{
    game?:string,
    result?:number
}
export interface AnswerProps{
    id?:string,
    photos?:MediaProps[],
    groupId?:string,
    activityId?:string,
    memberName?:string
    gameResults?:GameResultProps[],
    checked?:number
}

const initialState: ActivitiesState = {
    fetchingActivities:false,
    fetchActivitiesError:null,
    answers:[],
    currentActivities:[],
    groupActivities:[]
}
export const ActivitiesContext = React.createContext<ActivitiesState>(initialState);

interface ActivitiesProviderProps {
    children: PropTypes.ReactNodeLike,
}

interface ActionProperties {
    type: string,
    payload?: any,
}



const GET_ALL_GAMES_STARTED = 'GET_ALL_GAMES_STARTED'
const GET_ALL_GAMES_FAILED = 'GET_ALL_GAMES_FAILED'
const GET_ALL_GAMES_SUCCEEDED = 'GET_ALL_GAMES_SUCCEEDED'

const ADD_ACTIVITY_STARTED='ADD_ACTIVITY_STARTED'
const ADD_ACTIVITY_FAILED='ADD_ACTIVITY_FAILED'
const ADD_ACTIVITY_SUCCEEDED='ADD_ACTIVITY_SUCCEEDED'

const GET_CURRENT_ACTIVITIES_STARTED='GET_CURRENT_ACTIVITIES_STARTED'
const GET_CURRENT_ACTIVITIES_SUCCEEDED='GET_CURRENT_ACTIVITIES_SUCCEEDED'
const GET_CURRENT_ACTIVITIES_FAILED='GET_CURRENT_ACTIVITIES_FAILED'

const GET_GROUP_ACTIVITIES_STARTED='GET_GROUP_ACTIVITIES_STARTED'
const GET_GROUP_ACTIVITIES_SUCCEEDED='GET_GROUP_ACTIVITIES_SUCCEEDED'
const GET_GROUP_ACTIVITIES_FAILED='GET_GROUP_ACTIVITIES_FAILED'

const SEND_ANSWER_STARTED='SEND_ANSWER_STARTED'
const SEND_ANSWER_SUCCEEDED='SEND_ANSWER_SUCCEEDED'
const SEND_ANSWER_FAILED='SEND_ANSWER_FAILED'

const GET_ANSWERS_STARTED='GET_ANSWERS_STARTED'
const GET_ANSWERS_SUCCEEDED='GET_ANSWERS_SUCCEEDED'
const GET_ANSWERS_FAILED='GET_ANSWERS_FAILED'


const reducer: (state: ActivitiesState, action: ActionProperties) => ActivitiesState =
    (state, {type, payload}) => {
        switch (type) {
            case GET_ALL_GAMES_SUCCEEDED:
                return {
                    ...state,
                    fetchingGames: false,
                    fetchGamesError: null,
                    games: payload.games
                };
            case GET_ALL_GAMES_STARTED:
                return {
                    ...state,
                    fetchingGames: true,
                    fetchGamesError: null
                };
            case GET_ALL_GAMES_FAILED:
                return {...state, fetchGamesError: payload.error, fetchGames: false};
            case GET_CURRENT_ACTIVITIES_SUCCEEDED:
                return {...state, currentActivities:payload.activities, fetchingActivities:false, fetchActivitiesError:null};
            case GET_CURRENT_ACTIVITIES_STARTED:
                return {...state, fetchingActivities:true}
            case GET_CURRENT_ACTIVITIES_FAILED:
                return {...state, fetchActivitiesError:payload.error}
            case GET_ANSWERS_SUCCEEDED:
                return {...state, answers:payload.answers}
            case GET_GROUP_ACTIVITIES_SUCCEEDED:
                return {...state, groupActivities:payload.activities, fetchingActivities:false, fetchActivitiesError:null};
            case GET_GROUP_ACTIVITIES_STARTED:
                return {...state, fetchingActivities:true}
            case GET_GROUP_ACTIVITIES_FAILED:
                return {...state, fetchActivitiesError:payload.error}
            default:
                return state;
        }
    };


export const ActivitiesProvider: React.FC<ActivitiesProviderProps> = ({children}) => {
    const {token} = useContext(LoginContext)
    const [state, dispatch] = useReducer(reducer, initialState);
    const {
        currentActivities,
        fetchingActivities,
        fetchActivitiesError,
        answers,
        groupActivities
    } = state;
    const addActivity = useCallback<AddActivityFunction>(addActivityCallback,[token])
    const getCurrentActivities = useCallback<GetCurrentActivitiesFunction>(getCurrentActivitiesCallback,[token])
    const sendAnswer=useCallback<SendAnswerFunction>(sendAnswerCallback,[token])
    const getAnswers=useCallback<GetAnswersFunction>(getAnswersCallback,[token])
    const getActivitiesAssignedFromThisGroup=useCallback<GetActivitiesFromThisGroup>(getActivitiesFromThisGroupCallback,[token])
    async function addActivityCallback(activity:ActivityProps, members:string[]) {
        console.log('addActivityCallback')
        if (!token.trim()) {
            return
        } else {
            dispatch({type: ADD_ACTIVITY_STARTED})
            try {
                await addActivityApi(token, activity, members)
                dispatch({type: ADD_ACTIVITY_SUCCEEDED})
            } catch (error) {
                dispatch({type:ADD_ACTIVITY_FAILED, payload: {error}})
            }
        }
    }

    async function getCurrentActivitiesCallback(memberId:string, groupId:string) {
        console.log('getCurrentActivitiesCallback')
        if (!token.trim()) {
            return
        } else {
            dispatch({type: GET_CURRENT_ACTIVITIES_STARTED})
            try {
                let activities=await getCurrentActivitiesApi(token, memberId, groupId)
                dispatch({type: GET_CURRENT_ACTIVITIES_SUCCEEDED, payload:{activities}})
            } catch (error) {
                dispatch({type:GET_CURRENT_ACTIVITIES_FAILED, payload: {error}})
            }
        }
    }

    async function sendAnswerCallback(answer?:AnswerProps){
        console.log('sendAnswerCallback')
        if (!token.trim()) {
            return
        } else {
            dispatch({type: SEND_ANSWER_STARTED})
            try {
                await sendAnswerApi(token, answer)
                dispatch({type: SEND_ANSWER_SUCCEEDED})
            } catch (error) {
                dispatch({type:SEND_ANSWER_FAILED, payload: {error}})
            }
        }
    }

    async function getAnswersCallback(activityId?:string){
        console.log('getAnswersCallback')
        if (!token.trim()) {
            return
        } else {
            dispatch({type: GET_ANSWERS_STARTED})
            try {
                let answers=await getAnswersApi(token, activityId)
                dispatch({type: GET_ANSWERS_SUCCEEDED, payload:{answers:answers}})
            } catch (error) {
                dispatch({type:GET_ANSWERS_FAILED, payload: {error}})
            }
        }
    }

    async function getActivitiesFromThisGroupCallback(groupId?:string){
        console.log('getActivitiesFromThisGroupCallback')
        if (!token.trim()) {
            return
        } else {
            dispatch({type: GET_GROUP_ACTIVITIES_STARTED})
            try {
                let activities=await getActivitiesFromGroupApi(token, groupId)
                dispatch({type: GET_GROUP_ACTIVITIES_SUCCEEDED, payload:{activities:activities}})
            } catch (error) {
                dispatch({type:GET_GROUP_ACTIVITIES_FAILED, payload: {error}})
            }
        }
    }

    return (
        <ActivitiesContext.Provider value={{
            currentActivities,
            addActivity,
            getCurrentActivities,
            fetchingActivities,
            fetchActivitiesError,
            sendAnswer,
            getAnswers,
            answers,
            getActivitiesAssignedFromThisGroup,
            groupActivities
        }}>
            {children}
        </ActivitiesContext.Provider>
    );
}
