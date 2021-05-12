import React, {useCallback, useContext, useReducer} from "react";
import PropTypes from "prop-types";
import {LoginContext} from "../../authentication";
import {getAllBadges as getAllBadgesApi} from "../api/BadgeApi"

type GetAllBadgesFunction = () => Promise<any>

export interface BadgesState {
    getAllBadges?:GetAllBadgesFunction,
    gettingBadges:boolean,
    getBadgesError:Error | null
    badges:BadgeProps[]
}

export interface BadgeProps {
    id?: string,
    content?: string,
    name?:string
}

const initialState: BadgesState = {
    gettingBadges:false,
    badges:[],
    getBadgesError:null
}
export const BadgesContext = React.createContext<BadgesState>(initialState);

interface BadgesProviderProps {
    children: PropTypes.ReactNodeLike,
}

interface ActionProperties {
    type: string,
    payload?: any,
}



const GET_ALL_BADGES_STARTED = 'GET_ALL_BADGES_STARTED'
const GET_ALL_BADGES_FAILED = 'GET_ALL_BADGES_FAILED'
const GET_ALL_BADGES_SUCCEEDED = 'GET_ALL_BADGES_SUCCEEDED'


const reducer: (state: BadgesState, action: ActionProperties) => BadgesState =
    (state, {type, payload}) => {
        switch (type) {
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
                return {...state, getBadgesError: payload.error, gettingBadges: false};
            default:
                return state;
        }
    };


export const BadgesProvider: React.FC<BadgesProviderProps> = ({children}) => {
    const {token} = useContext(LoginContext)
    const [state, dispatch] = useReducer(reducer, initialState);
    const {
        gettingBadges,
        getBadgesError,
        badges
    } = state;
    const getAllBadges = useCallback<GetAllBadgesFunction>(getAllBadgesCallback,[token])

    async function getAllBadgesCallback() {
        console.log('getAllBadgesCallback')
        if (!token.trim()) {
            return
        } else {
            dispatch({type: GET_ALL_BADGES_STARTED})
            try {
                let badges=await getAllBadgesApi(token)
                dispatch({type: GET_ALL_BADGES_SUCCEEDED, payload:{badges}})
            } catch (error) {
                dispatch({type:GET_ALL_BADGES_FAILED, payload: {error}})
            }
        }
    }

    return (
        <BadgesContext.Provider value={{
            getBadgesError,
            gettingBadges,
            getAllBadges,
            badges
        }}>
            {children}
        </BadgesContext.Provider>
    );
}
