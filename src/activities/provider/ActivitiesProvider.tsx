import React, { useCallback, useContext, useEffect, useReducer, useState } from "react";
import PropTypes from "prop-types";
import { LoginContext } from "../../authentication";
import { GameProps } from "../../games/provider/GamesProvider";
import {
    addActivity as addActivityApi, getCurrentActivities as getCurrentActivitiesApi, sendAnswer as sendAnswerApi,
    getAnswers as getAnswersApi, getActivitiesFromGroup as getActivitiesFromGroupApi,
    earnedBadges as earnedBadgesApi,
    getAllBadges as getAllBadgesApi,
    rewardBadge as rewardBadgeApi
} from "../api/ActivitiesApi";
import { PICTURE_TYPE } from "../../genericUser/utils/constants";

// import {BadgeProps} from "../../badges/provider/BadgeProvider";


type AddActivityFunction = (activity: ActivityProps, members: string[]) => Promise<any>
type GetCurrentActivitiesFunction = (memberId: string, groupId: string) => Promise<any>
type SendAnswerFunction = (answer: AnswerProps) => Promise<any>
type GetAnswersFunction = (groupId?: string) => Promise<any>
type GetActivitiesFromThisGroup = (groupId?: string) => Promise<any>
type GetAllBadgesFunction = () => Promise<any>
type AwardBadgeFunction = (userId: string, badgeId: string) => Promise<any>
type GetEarnedBadgesFunction = (token: string) => Promise<any>

export interface ActivitiesState {
    addActivity?: AddActivityFunction,
    currentActivities: ActivityProps[],
    groupActivities: ActivityProps[],
    getCurrentActivities?: GetCurrentActivitiesFunction,
    fetchingActivities: boolean,
    fetchActivitiesError: Error | null,
    sendAnswer?: SendAnswerFunction,
    getAnswers?: GetAnswersFunction,
    answers: AnswerProps[],
    getActivitiesAssignedFromThisGroup?: GetActivitiesFromThisGroup,
    getAllBadges?: GetAllBadgesFunction,
    gettingBadges: boolean,
    getBadgesError: Error | null,
    awardBadgeError: Error | null,
    awardingBadge: boolean,
    badges: BadgeProps[],
    awardBadge?: AwardBadgeFunction,
    getEarnedBadges?: GetEarnedBadgesFunction,
    earnedBadges: BadgeProps[]
}

export interface BadgeProps {
    id?: number,
    content?: string,
    name?: string
}

export interface MediaProps {
    id?: string,
    content?: string,
    contentType?: string
}

export interface LinkProps {
    link: string,
    description: string
}

export interface ActivityProps {
    id?: string,
    title?: string,
    field?: string,
    description?: string,
    dueDate?: string,
    assignedBy?: string,
    games?: GameProps[],
    media?: MediaProps[],
    links?: LinkProps[],
    groupId?: string
}

export interface GameResultProps {
    game?: string,
    result?: number
}

export interface AnswerProps {
    userId?: string;
    id?: string,
    photos?: MediaProps[],
    groupId?: string,
    activityId?: string,
    memberName?: string
    gameResults?: GameResultProps[],
    checked?: number
}

const initialState: ActivitiesState = {
    fetchingActivities: false,
    fetchActivitiesError: null,
    answers: [],
    currentActivities: [],
    groupActivities: [],
    gettingBadges: false,
    badges: [],
    getBadgesError: null,
    awardingBadge: false,
    awardBadgeError: null,
    earnedBadges: []
    // webSocket:new WebSocket(`ws://localhost:8080/gradi-ws`),
}
export const ActivitiesContext = React.createContext<ActivitiesState>(initialState);

interface ActivitiesProviderProps {
    children: PropTypes.ReactNodeLike,
    // socket:WebSocket
}

interface ActionProperties {
    type: string,
    payload?: any,
}


const GET_ALL_GAMES_STARTED = 'GET_ALL_GAMES_STARTED'
const GET_ALL_GAMES_FAILED = 'GET_ALL_GAMES_FAILED'
const GET_ALL_GAMES_SUCCEEDED = 'GET_ALL_GAMES_SUCCEEDED'

const ADD_ACTIVITY_STARTED = 'ADD_ACTIVITY_STARTED'
const ADD_ACTIVITY_FAILED = 'ADD_ACTIVITY_FAILED'
const ADD_ACTIVITY_SUCCEEDED = 'ADD_ACTIVITY_SUCCEEDED'

const GET_CURRENT_ACTIVITIES_STARTED = 'GET_CURRENT_ACTIVITIES_STARTED'
const GET_CURRENT_ACTIVITIES_SUCCEEDED = 'GET_CURRENT_ACTIVITIES_SUCCEEDED'
const GET_CURRENT_ACTIVITIES_FAILED = 'GET_CURRENT_ACTIVITIES_FAILED'

const GET_GROUP_ACTIVITIES_STARTED = 'GET_GROUP_ACTIVITIES_STARTED'
const GET_GROUP_ACTIVITIES_SUCCEEDED = 'GET_GROUP_ACTIVITIES_SUCCEEDED'
const GET_GROUP_ACTIVITIES_FAILED = 'GET_GROUP_ACTIVITIES_FAILED'

const SEND_ANSWER_STARTED = 'SEND_ANSWER_STARTED'
const SEND_ANSWER_SUCCEEDED = 'SEND_ANSWER_SUCCEEDED'
const SEND_ANSWER_FAILED = 'SEND_ANSWER_FAILED'

const GET_ANSWERS_STARTED = 'GET_ANSWERS_STARTED'
const GET_ANSWERS_SUCCEEDED = 'GET_ANSWERS_SUCCEEDED'
const GET_ANSWERS_FAILED = 'GET_ANSWERS_FAILED'

const GET_ALL_BADGES_STARTED = 'GET_ALL_BADGES_STARTED'
const GET_ALL_BADGES_FAILED = 'GET_ALL_BADGES_FAILED'
const GET_ALL_BADGES_SUCCEEDED = 'GET_ALL_BADGES_SUCCEEDED'

const AWARD_BADGE_STARTED = 'AWARD_BADGE_STARTED'
const AWARD_BADGE_FAILED = 'AWARD_BADGE_FAILED'
const AWARD_BADGE_SUCCEEDED = 'AWARD_BADGE_SUCCEEDED'

const GET_EARNED_BADGES_STARTED = 'GET_EARNED_BADGES_STARTED'
const GET_EARNED_BADGES_FAILED = 'GET_EARNED_BADGES_FAILED'
const GET_EARNED_BADGES_SUCCEEDED = 'GET_EARNED_BADGES_SUCCEEDED'

const RECEIVED_NEW_BADGE = 'RECEIVED_NEW_BADGE'

const TEACHER_ADDED_ACTIVITY = 'TEACHER_ADDED_ACTIVITY'

const RECEIVED_NEW_ANSWER = 'RECEIVED_NEW_ANSWER'

const reducer: (state: ActivitiesState, action: ActionProperties) => ActivitiesState =
    (state, { type, payload }) => {
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
                return { ...state, fetchGamesError: payload.error, fetchGames: false };
            case GET_CURRENT_ACTIVITIES_SUCCEEDED:
                return {
                    ...state,
                    currentActivities: payload.activities,
                    fetchingActivities: false,
                    fetchActivitiesError: null
                };
            case GET_CURRENT_ACTIVITIES_STARTED:
                return { ...state, fetchingActivities: true }
            case GET_CURRENT_ACTIVITIES_FAILED:
                return { ...state, fetchActivitiesError: payload.error }
            case GET_ANSWERS_SUCCEEDED:
                return { ...state, answers: payload.answers }
            case GET_GROUP_ACTIVITIES_SUCCEEDED:
                return {
                    ...state,
                    groupActivities: payload.activities,
                    fetchingActivities: false,
                    fetchActivitiesError: null
                };
            case GET_GROUP_ACTIVITIES_STARTED:
                return { ...state, fetchingActivities: true }
            case GET_GROUP_ACTIVITIES_FAILED:
                return { ...state, fetchActivitiesError: payload.error }
            case TEACHER_ADDED_ACTIVITY:
                let activities = [...(state.currentActivities || [])]
                activities.push(payload.activity)
                return { ...state, currentActivities: activities }
            case GET_ALL_BADGES_SUCCEEDED:
                return {
                    ...state,
                    gettingBadges: false,
                    getBadgesError: null,
                    badges: payload.badges
                };
            case GET_ALL_BADGES_STARTED:
                return {
                    ...state,
                    gettingBadges: true,
                    getBadgesError: null
                };
            case GET_ALL_BADGES_FAILED:
                return { ...state, getBadgesError: payload.error, gettingBadges: false };
            case AWARD_BADGE_FAILED:
                return { ...state, awardBadgeError: payload.error, awardingBadge: false };
            case AWARD_BADGE_STARTED:
                return {
                    ...state,
                    awardingBadge: true,
                    awardBadgeError: null
                };
            case AWARD_BADGE_SUCCEEDED:
                return {
                    ...state,
                    awardingBadge: false,
                    awardBadgeError: null,
                };
            case GET_EARNED_BADGES_STARTED:
                return {
                    ...state,
                    gettingBadges: true,
                    getBadgesError: null
                };
            case GET_EARNED_BADGES_FAILED:
                return { ...state, getBadgesError: payload.error, gettingBadges: false };
            case GET_EARNED_BADGES_SUCCEEDED:
                return {
                    ...state,
                    awardingBadge: false,
                    awardBadgeError: null,
                    earnedBadges: payload.badges
                }
            case RECEIVED_NEW_BADGE:
                console.log(payload.badge.content)
                let badges = [...(state.earnedBadges || [])]
                let content = payload.badge.content + ''
                content = content.split(PICTURE_TYPE)[0]
                if (content) payload.badge.content = content
                if (badges.filter(b => b.id === payload.badge.id).length === 0) {
                    badges.push(payload.badge)
                    console.log(badges)
                }
                return { ...state, earnedBadges: badges }
            case RECEIVED_NEW_ANSWER:
                let answers = [...(state.answers || [])]
                answers.push(payload.answer)
                return { ...state, answers: answers }
            default:
                return state;
        }
    };


export const ActivitiesProvider: React.FC<ActivitiesProviderProps> = ({ children }) => {
    const { token } = useContext(LoginContext)
    const [state, dispatch] = useReducer(reducer, initialState);
    const {
        currentActivities,
        fetchingActivities,
        fetchActivitiesError,
        answers,
        groupActivities,
        gettingBadges,
        getBadgesError,
        earnedBadges,
        awardBadgeError,
        awardingBadge,
        badges

    } = state;
    const addActivity = useCallback<AddActivityFunction>(addActivityCallback, [token])
    const getCurrentActivities = useCallback<GetCurrentActivitiesFunction>(getCurrentActivitiesCallback, [token])
    const sendAnswer = useCallback<SendAnswerFunction>(sendAnswerCallback, [token])
    const getAnswers = useCallback<GetAnswersFunction>(getAnswersCallback, [token])
    const getActivitiesAssignedFromThisGroup = useCallback<GetActivitiesFromThisGroup>(getActivitiesFromThisGroupCallback, [token])
    const { socket } = useContext(LoginContext)
    const getAllBadges = useCallback<GetAllBadgesFunction>(getAllBadgesCallback, [token])
    const awardBadge = useCallback<AwardBadgeFunction>(awardBadgeCallback, [token])
    const getEarnedBadges = useCallback<GetEarnedBadgesFunction>(getEarnedBadgesCallback, [token])
    async function getAllBadgesCallback() {
        console.log('getAllBadgesCallback')
        if (!token.trim()) {
            return
        } else {
            dispatch({ type: GET_ALL_BADGES_STARTED })
            try {
                let badges = await getAllBadgesApi(token)
                dispatch({ type: GET_ALL_BADGES_SUCCEEDED, payload: { badges: badges } })
            } catch (error) {
                dispatch({ type: GET_ALL_BADGES_FAILED, payload: { error } })
            }
        }
    }

    async function awardBadgeCallback(userId: string, badgeId: string) {
        console.log('awardBadgeCallback')
        if (!token.trim()) {
            return
        } else {
            dispatch({ type: AWARD_BADGE_STARTED })
            try {
                if (badgeId.trim() !== '' && userId.trim() !== '') {
                    let badge = Number.parseInt(badgeId || '')
                    await rewardBadgeApi(token, badge, userId)
                    dispatch({ type: AWARD_BADGE_SUCCEEDED })
                } else {
                    dispatch({ type: AWARD_BADGE_FAILED, payload: { error: new Error("Selectați o insignă!") } })
                }
            } catch (error) {
                dispatch({ type: AWARD_BADGE_FAILED, payload: { error } })
            }
        }
    }

    async function getEarnedBadgesCallback(token: string) {
        console.log('getEarnedBadgesCallback')
        if (!token.trim()) {
            return
        } else {
            dispatch({ type: GET_EARNED_BADGES_STARTED })
            try {
                let badges = await earnedBadgesApi(token, token)
                dispatch({ type: GET_EARNED_BADGES_SUCCEEDED, payload: { badges: badges } })
            } catch (error) {
                dispatch({ type: GET_EARNED_BADGES_FAILED, payload: { error } })
            }
        }
    }
    useEffect(() => {
        let canceled = false;
        if (token?.trim()) {
            if (canceled) {
                return;
            }
            if (socket !== null) {
                socket.onmessage = messageEvent => {
                    console.log('web socket onmessage ' + messageEvent.data);
                    let res = JSON.parse(messageEvent.data);
                    switch (res.type) {
                        case "addedActivity":
                            dispatch({ type: TEACHER_ADDED_ACTIVITY, payload: { activity: res.result } })
                            break;
                        case "newBadge":
                            dispatch({ type: RECEIVED_NEW_BADGE, payload: { badge: res.result } })
                            break;
                        case "addedAnswer":
                            dispatch({ type: RECEIVED_NEW_ANSWER, payload: { answer: res.result } })
                            break;
                    }
                    console.log(`ws message, item ${res.type}`);
                }
                // }
                return () => {

                }
            }
        }

    })

    async function addActivityCallback(activity: ActivityProps, members: string[]) {
        console.log('addActivityCallback')
        if (!token.trim()) {
            return
        } else {
            dispatch({ type: ADD_ACTIVITY_STARTED })
            try {
                await addActivityApi(token, activity, members)
                dispatch({ type: ADD_ACTIVITY_SUCCEEDED })
            } catch (error) {
                dispatch({ type: ADD_ACTIVITY_FAILED, payload: { error } })
            }
        }
    }

    async function getCurrentActivitiesCallback(memberId: string, groupId: string) {
        console.log('getCurrentActivitiesCallback')
        if (!token.trim()) {
            return
        } else {
            dispatch({ type: GET_CURRENT_ACTIVITIES_STARTED })
            try {
                let activities = await getCurrentActivitiesApi(token, memberId, groupId)
                dispatch({ type: GET_CURRENT_ACTIVITIES_SUCCEEDED, payload: { activities } })
            } catch (error) {
                dispatch({ type: GET_CURRENT_ACTIVITIES_FAILED, payload: { error } })
            }
        }
    }

    async function sendAnswerCallback(answer?: AnswerProps) {
        console.log('sendAnswerCallback')
        if (!token.trim()) {
            return
        } else {
            dispatch({ type: SEND_ANSWER_STARTED })
            try {
                await sendAnswerApi(token, answer)
                dispatch({ type: SEND_ANSWER_SUCCEEDED })
            } catch (error) {
                dispatch({ type: SEND_ANSWER_FAILED, payload: { error } })
            }
        }
    }

    async function getAnswersCallback(activityId?: string) {
        console.log('getAnswersCallback')
        if (!token.trim()) {
            return
        } else {
            dispatch({ type: GET_ANSWERS_STARTED })
            try {
                let answers = await getAnswersApi(token, activityId)
                dispatch({ type: GET_ANSWERS_SUCCEEDED, payload: { answers: answers } })
            } catch (error) {
                dispatch({ type: GET_ANSWERS_FAILED, payload: { error } })
            }
        }
    }

    async function getActivitiesFromThisGroupCallback(groupId?: string) {
        console.log('getActivitiesFromThisGroupCallback')
        if (!token.trim()) {
            return
        } else {
            dispatch({ type: GET_GROUP_ACTIVITIES_STARTED })
            try {
                let activities = await getActivitiesFromGroupApi(token, groupId)
                dispatch({ type: GET_GROUP_ACTIVITIES_SUCCEEDED, payload: { activities: activities } })
            } catch (error) {
                dispatch({ type: GET_GROUP_ACTIVITIES_FAILED, payload: { error } })
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
            groupActivities,
            getAllBadges,
            getEarnedBadges,
            getBadgesError,
            gettingBadges,
            earnedBadges,
            awardBadge,
            awardBadgeError,
            awardingBadge,
            badges
        }}>
            {children}
        </ActivitiesContext.Provider>
    );

}
