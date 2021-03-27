import React, {useCallback, useContext, useEffect, useReducer, useState} from 'react';
import PropTypes from 'prop-types';
import {LoginContext} from "../../authentication";
import {getGroups as getGroupsApi, addGroup as addGroupApi} from "../api/GroupsApi";

export interface GroupProperties{
    id?:string;
    name:string;
    membersNo:number;
    img?:string;
}

export interface GroupsState {
    groups?:GroupProperties[];
    fetchingGroupsList:boolean;
    fetchingGroupsListError:Error|null;
    addingGroup:boolean;
    addingGroupError:Error|null;
    addNewGroup?:AddNewGroupFunction
}

const initialState: GroupsState = {
    fetchingGroupsList:false,
    fetchingGroupsListError:null,
    addingGroup:false,
    addingGroupError:null,
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


const GETTING_USERS_GROUPS_STARTED = 'GETTING_USERS_GROUPS_STARTED'
const GETTING_USERS_GROUPS_FAILED = 'GETTING_USERS_GROUPS_FAILED'
const GETTING_USERS_GROUPS_SUCCEEDED = 'GETTING_USERS_GROUPS_SUCCEEDED'

const ADD_GROUP_STARTED = 'ADD_GROUP_STARTED'
const ADD_GROUP_FAILED = 'ADD_GROUP_FAILED'
const ADD_GROUP_SUCCEEDED = 'ADD_GROUP_SUCCEEDED'

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
            default:
                return state;
        }
    };

export const GroupsProvider: React.FC<GroupsProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const{fetchingGroupsList, fetchingGroupsListError, addingGroup, addingGroupError, groups}=state;
    const {token}=useContext(LoginContext)
    const addNewGroup=useCallback<AddNewGroupFunction>(addNewGroupCallback,[token])

    useEffect(fetchGroupsEffect,[token]);

    function fetchGroupsEffect(){
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
        <GroupContext.Provider value={{fetchingGroupsListError,fetchingGroupsList, addNewGroup, addingGroupError, addingGroup, groups}}>
            {children}
        </GroupContext.Provider>
    );
};
