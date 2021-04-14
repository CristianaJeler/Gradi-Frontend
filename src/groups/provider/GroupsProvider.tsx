import React, {useCallback, useContext, useEffect, useReducer, useState} from 'react';
import PropTypes from 'prop-types';
import {LoginContext} from "../../authentication";
import {getGroups as getGroupsApi, addGroup as addGroupApi, getGroupDetails as getGroupDetailsApi} from "../api/GroupsApi";
import {getLogger} from "../../core";
import {newWebSocket} from "../../core/websockets";

export interface GroupProperties{
    id?:string;
    name:string;
    img?:string;
}

export interface GroupsState {
    groups?:GroupProperties[];
    fetchingGroupsListError:Error|null;
    getGroupDetailsError:Error|null;
    fetchingGroupsList:boolean;
    addingGroup:boolean;
    gettingGroupDetails:boolean;
    addingGroupError:Error|null;
    addNewGroup?:AddNewGroupFunction;
    getGroupDetails?:GetGroupDetailsFunction;
    fetchGroups?:FetchGroupsFunction;
    currentGroup:GroupProperties | null;
}

const initialState: GroupsState = {
    fetchingGroupsList:false,
    fetchingGroupsListError:null,
    addingGroup:false,
    addingGroupError:null,
    gettingGroupDetails:false,
    getGroupDetailsError:null,
    currentGroup:null
}

export const GroupContext = React.createContext<GroupsState>(initialState);

interface GroupsProviderProps {
    children: PropTypes.ReactNodeLike,
}


interface ActionProperties {
    type: string,
    payload?: any,
}

type AddNewGroupFunction = (name?:string, img?:string) => Promise<any>;
type GetGroupDetailsFunction = (groupId?:string) => void;
type FetchGroupsFunction = () => void;



const GETTING_USERS_GROUPS_STARTED = 'GETTING_USERS_GROUPS_STARTED'
const GETTING_USERS_GROUPS_FAILED = 'GETTING_USERS_GROUPS_FAILED'
const GETTING_USERS_GROUPS_SUCCEEDED = 'GETTING_USERS_GROUPS_SUCCEEDED'

const ADD_GROUP_STARTED = 'ADD_GROUP_STARTED'
const ADD_GROUP_FAILED = 'ADD_GROUP_FAILED'
const ADD_GROUP_SUCCEEDED = 'ADD_GROUP_SUCCEEDED'

const GETTING_GROUP_DETAILS_STARTED = 'GETTING_GROUP_DETAILS_STARTED'
const GETTING_GROUP_DETAILS_FAILED = 'GETTING_GROUP_DETAILS_FAILED'
const GETTING_GROUP_DETAILS_SUCCEEDED = 'GETTING_GROUP_DETAILS_SUCCEEDED'


const reducer: (state: GroupsState, action: ActionProperties) => GroupsState =
    (state, {type, payload}) => {
        switch (type) {
            case GETTING_USERS_GROUPS_STARTED:
                return {...state,fetchingGroupsList:true, fetchingGroupsListError:null}
            case GETTING_USERS_GROUPS_FAILED:
                return {...state, fetchingGroupsList: false, fetchingGroupsListError: payload.error}
            case GETTING_USERS_GROUPS_SUCCEEDED:
                return {...state, fetchingGroupsList: false, fetchingGroupsListError: null, groups:payload.groups}
            case ADD_GROUP_STARTED:
                return {...state, addingGroup:true, addingGroupError:null}
            case ADD_GROUP_FAILED:
                return {...state, addingGroup:false, addingGroupError:payload.error}
            case ADD_GROUP_SUCCEEDED:
                let groupsList=[...(state.groups || [])]
                groupsList.push(payload.group)
                return {...state, addingGroup:false, addingGroupError:null, groups:groupsList}
            case GETTING_GROUP_DETAILS_STARTED:
                return {...state, getGroupDetailsError:null, gettingGroupDetails:false, currentGroup:null}
            case GETTING_GROUP_DETAILS_SUCCEEDED:
                return {...state, getGroupDetailsError:null,gettingGroupDetails:false, currentGroup:payload.group}
            case GETTING_GROUP_DETAILS_FAILED:
                return {...state, getGroupDetailsError:payload.error, gettingGroupDetails:false, currentGroup:null}
            default:
                return state;
        }
    };


const log=getLogger("GroupProvider")

export const GroupsProvider: React.FC<GroupsProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const{fetchingGroupsList, fetchingGroupsListError, addingGroup, addingGroupError, groups, getGroupDetailsError, currentGroup, gettingGroupDetails}=state;
    const {token}=useContext(LoginContext)

    const addNewGroup=useCallback<AddNewGroupFunction>(addNewGroupCallback,[token])
    const fetchGroups=useCallback<FetchGroupsFunction>(fetchGroupsCallback,[token]);
    const getGroupDetails=useCallback<GetGroupDetailsFunction>(getGroupDetailsCallback, [token])

    useEffect(wsEffect,[token])

    function getGroupDetailsCallback(groupID?:string){
        fetchGroupDetails();
        return ()=>{}

        async function fetchGroupDetails(){
            if(!token.trim()){
                return
            }else{
                dispatch({type:GETTING_GROUP_DETAILS_STARTED})
                try{
                    let group=await getGroupDetailsApi(token, groupID)
                    dispatch({type:GETTING_GROUP_DETAILS_SUCCEEDED, payload:{group}})
                }catch (error){
                    dispatch({type:GETTING_GROUP_DETAILS_FAILED, payload:{error}})
                }
            }
        }
    }

    function fetchGroupsCallback(){
        console.log("Fantastic")
            fetchGroups();
            return ()=>{}

            async function fetchGroups(){
                if(!token.trim()){
                    return
                }else{
                    dispatch({type:GETTING_USERS_GROUPS_STARTED})
                    try{
                        let groups=await getGroupsApi(token)
                        dispatch({type:GETTING_USERS_GROUPS_SUCCEEDED, payload:{groups}})
                    }catch (error){
                        dispatch({type:GETTING_USERS_GROUPS_FAILED, payload:{error}})
                    }
                }
            }
    }

    async function addNewGroupCallback(name?:string, img?:string){
        if(!token.trim()){
            return
        }else{
            dispatch({type:ADD_GROUP_STARTED})
            try{
                let group=await addGroupApi(token, name, img)
                dispatch({type:ADD_GROUP_SUCCEEDED, payload:{group}})
            }catch (error){
                dispatch({type:ADD_GROUP_FAILED, payload:{error}})
            }
        }
    }

    return (
        <GroupContext.Provider value={{gettingGroupDetails,currentGroup,getGroupDetailsError,fetchGroups,fetchingGroupsListError,fetchingGroupsList, addNewGroup, addingGroupError, addingGroup, groups, getGroupDetails}}>
            {children}
        </GroupContext.Provider>
    );

    function wsEffect() {
        let canceled = false;
        console.log('wsEffect - connecting');
        let closeWebSocket: () => void;
        if (token?.trim()) {
            closeWebSocket = newWebSocket(token, onMessage => {
                if (canceled) {
                    return;
                }
                const { type, payload } = onMessage;
                log(`ws message, item ${type}`);
                if (type === 'created' || type === 'updated') {

                }else if (type === 'resolvedConflict') {

                }
            });
        }
        return () => {
            log('wsEffect - disconnecting');
            canceled = true;
            closeWebSocket?.();
        }
    }
};
