import React, {useCallback, useContext, useEffect, useReducer} from 'react';
import PropTypes from 'prop-types';
import {LoginContext} from "../../authentication";
import {
    updateProfilePic as updateProfilePicAPI,
    getProfileDetails,
    updateProfileDetails as updateProfileDetailsAPI,
    updatePassword as updatePasswordAPI,
    searchUsers as searchUsersAPI,
    addMemberToGroup as addMemberToGroupAPI,
    deleteMemberFromGroup as deleteMemberFromGroupAPI,
    fetchGroupMembers as fetchGroupMembersAPI
} from "../api/GenericUserApi"


type UpdateProfilePicFunction = (picture?: string) => Promise<any>;
type UpdateProfileDetailsFunction = (details?: UserProps) => Promise<any>;
type UpdatePasswordFunction = (oldPswd?: string, newPswd?: string) => Promise<any>;
type SearchUsersFunction = (searchCriteria?: string, groupID?: string, page?: number, size?: number) => void;
type AddMemberToGroupFunction=(id:string, groupId:string)=>Promise<any>
type DeleteMemberFromGroupFunction=(id:string, groupId:string)=>Promise<any>
type FetchGroupMembersFunction=(groupId:string)=>Promise<any>

export interface UserProps {
    username?: string,
    email?: string,
    kindergarten?: string,
    firstName?: string,
    picture?: string,
    lastName?: string,
    phone?: string
    status?: string
    description?: string
}

export interface SearchedUserProps {
    username?: string;
    firstName?: string;
    lastName?: string;
    inGroup?: boolean;
    img?: string;
    id?: string;
}

export interface UserState {
    gettingAccountDetails: boolean,
    updatingProfileDetails: boolean,
    updatingProfilePicture: boolean,
    updatingPassword: boolean,
    passwordUpdatedSuccessfully: boolean,
    passwordUpdateError: Error | null
    getAccountDetailsError: Error | null,
    profilePicUpdateError: Error | null,
    profileDetailsUpdateError: Error | null,
    username?: string,
    email?: string,
    kindergarten?: string,
    firstName?: string,
    picture?: string,
    lastName?: string,
    phone?: string,
    status?: string,
    updateProfilePic?: UpdateProfilePicFunction,
    updateProfileDetails?: UpdateProfileDetailsFunction,
    updatePassword?: UpdatePasswordFunction,
    searchedUsers: SearchedUserProps[];
    searchUsers?: SearchUsersFunction;
    searchingUsers: boolean,
    searchUsersError: Error | null;
    addMemberToGroup?:AddMemberToGroupFunction;
    deleteMemberFromGroup?:DeleteMemberFromGroupFunction;
    fetchGroupMembers?:FetchGroupMembersFunction;
}

const initialState: UserState = {
    gettingAccountDetails: false,
    getAccountDetailsError: null,
    profilePicUpdateError: null,
    profileDetailsUpdateError: null,
    updatingProfileDetails: false,
    updatingProfilePicture: false,
    updatingPassword: false,
    passwordUpdateError: null,
    passwordUpdatedSuccessfully: false,
    searchingUsers: false,
    searchUsersError: null,
    searchedUsers: [],
}

export const UserContext = React.createContext<UserState>(initialState);

interface UserProviderProps {
    children: PropTypes.ReactNodeLike,
}

interface ActionProperties {
    type: string,
    payload?: any,
}

const GET_ACCOUNT_DETAILS_STARTED = 'GET_ACCOUNT_DETAILS_STARTED'
const GET_ACCOUNT_DETAILS_FAILED = 'GET_ACCOUNT_DETAILS_FAILED'
const GET_ACCOUNT_DETAILS_SUCCEEDED = 'GET_ACCOUNT_DETAILS_SUCCEEDED'

const PROFILE_PICTURE_UPDATE_SUCCEEDED = 'PROFILE_PICTURE_UPDATE_SUCCEEDED'
const PROFILE_PICTURE_UPDATE_FAILED = 'PROFILE_PICTURE_UPDATE_FAILED'
const PROFILE_PICTURE_UPDATE_STARTED = 'PROFILE_PICTURE_UPDATE_STARTED'

const PROFILE_DETAILS_UPDATE_SUCCEEDED = 'PROFILE_DETAILS_UPDATE_SUCCEEDED'
const PROFILE_DETAILS_UPDATE_FAILED = 'PROFILE_DETAILS_UPDATE_FAILED'
const PROFILE_DETAILS_UPDATE_STARTED = 'PROFILE_DETAILS_UPDATE_STARTED'

const PASSWORD_UPDATE_SUCCEEDED = 'PASSWORD_UPDATE_SUCCEEDED'
const PASSWORD_UPDATE_FAILED = 'PASSWORD_UPDATE_FAILED'
const PASSWORD_UPDATE_STARTED = 'PASSWORD_UPDATE_STARTED'

const SEARCHING_USERS_SUCCEEDED = 'SEARCHING_USERS_SUCCEEDED'
const SEARCHING_USERS_FAILED = 'SEARCHING_USERS_FAILED'
const SEARCHING_USERS_STARTED = 'SEARCHING_USERS_STARTED'


const ADD_MEMBER_STARTED="ADD_MEMBER_STARTED"
const ADD_MEMBER_SUCCEEDED="ADD_MEMBER_SUCCEEDED"
const ADD_MEMBER_FAILED="ADD_MEMBER_FAILED"

const DELETE_MEMBER_STARTED="DELETE_MEMBER_STARTED"
const DELETE_MEMBER_SUCCEEDED="DELETE_MEMBER_SUCCEEDED"
const DELETE_MEMBER_FAILED="DELETE_MEMBER_FAILED"

const FETCH_GROUP_MEMBERS_STARTED="FETCH_GROUP_MEMBERS_STARTED"
const FETCH_GROUP_MEMBERS_SUCCEEDED="FETCH_GROUP_MEMBERS_SUCCEEDED"
const FETCH_GROUP_MEMBERS_FAILED="FETCH_GROUP_MEMBERS_FAILED"

const reducer: (state: UserState, action: ActionProperties) => UserState =
    (state, {type, payload}) => {
        switch (type) {
            case GET_ACCOUNT_DETAILS_STARTED:
                return {
                    ...state,
                    gettingAccountDetails: true,
                    fetchingError: null,
                    passwordUpdatedSuccessfully: false
                };
            case GET_ACCOUNT_DETAILS_SUCCEEDED:
                return {
                    ...state,
                    username: payload.details.username,
                    email: payload.details.email,
                    kindergarten: payload.details.kindergarten,
                    firstName: payload.details.firstName,
                    picture: payload.details.picture,
                    lastName: payload.details.lastName,
                    phone: payload.details.phone,
                    status: payload.details.status,
                    gettingAccountDetails: false
                };
            case GET_ACCOUNT_DETAILS_FAILED:
                return {...state, getAccountDetailsError: payload.error, gettingAccountDetails: false};
            case PROFILE_PICTURE_UPDATE_SUCCEEDED:
                return {...state, picture: payload.picture, updatingProfilePicture: false}
            case PROFILE_PICTURE_UPDATE_FAILED:
                return {...state, profilePicUpdateError: payload.error}

            case PROFILE_DETAILS_UPDATE_SUCCEEDED:
                return {
                    ...state,
                    username: payload.details.username,
                    email: payload.details.email,
                    kindergarten: payload.details.kindergarten,
                    firstName: payload.details.firstName,
                    lastName: payload.details.lastName,
                    phone: payload.details.phone,
                    status: payload.details.status,
                    updatingProfileDetails: false
                };
            case PROFILE_DETAILS_UPDATE_STARTED:
                return {...state, updatingProfileDetails: true, profileDetailsUpdateError: null}
            case PROFILE_PICTURE_UPDATE_STARTED:
                return {...state, updatingProfilePicture: true, profilePicUpdateError: null}
            case PASSWORD_UPDATE_SUCCEEDED:
                return {...state, updatingPassword: false, passwordUpdateError: null, passwordUpdatedSuccessfully: true}
            case PASSWORD_UPDATE_STARTED:
                return {...state, updatingPassword: true, passwordUpdateError: null, passwordUpdatedSuccessfully: false}
            case PASSWORD_UPDATE_FAILED:
                return {
                    ...state,
                    updatingPassword: false,
                    passwordUpdateError: payload.error,
                    passwordUpdatedSuccessfully: false
                }
            case SEARCHING_USERS_STARTED:
                return {...state, searchUsersError: null, searchingUsers: true}
            case SEARCHING_USERS_FAILED:
                return {...state, searchUsersError: payload.error, searchingUsers: false}
            case SEARCHING_USERS_SUCCEEDED:
                if (payload.page > 0 && state.searchedUsers) {
                    let users = [...state.searchedUsers]
                    for (let u of payload.searchResult)
                        users.push(u)
                    return {
                        ...state,
                        searchedUsers: users,
                        searchUsersError: null,
                        searchingUsers: false
                    }
                } else
                    return {
                        ...state,
                        searchedUsers: payload.searchResult,
                        searchUsersError: null,
                        searchingUsers: false
                    }
            case ADD_MEMBER_SUCCEEDED:
                let users = [...state.searchedUsers];
                let addedUserIndex=users.findIndex(u=>u.id===payload.id);
                let addedUserEntity=users.find(u=>u.id===payload.id);
                if(addedUserEntity) {
                    console.log(addedUserEntity)
                    addedUserEntity.inGroup=!addedUserEntity.inGroup;
                    users.splice(addedUserIndex,1,addedUserEntity)
                }
                return {
                    ...state,
                    searchedUsers: users,
                }
            case DELETE_MEMBER_SUCCEEDED:
                let allUsers = [...state.searchedUsers];
                let deletedUserIndex=allUsers.findIndex(u=>u.id===payload.id);
                let deletedUserEntity=allUsers.find(u=>u.id===payload.id);
                if(deletedUserEntity) {
                    deletedUserEntity.inGroup=!deletedUserEntity.inGroup;
                    allUsers.splice(deletedUserIndex,1,deletedUserEntity)
                }
                return {
                    ...state,
                    searchedUsers: allUsers,
                }
            case FETCH_GROUP_MEMBERS_SUCCEEDED:
                    return {
                        ...state,
                        searchedUsers: payload.groupMembers,
                        searchUsersError: null,
                        searchingUsers: false
                    }
            default:
                return state;
        }
    };


export const GenericUserProvider: React.FC<UserProviderProps> = ({children}) => {
    const {token} = useContext(LoginContext)
    const updateProfilePic = useCallback<UpdateProfilePicFunction>(updateProfilePicCallback, [token])
    const updateProfileDetails = useCallback<UpdateProfileDetailsFunction>(updateProfileDetailsCallback, [token])
    const updatePassword = useCallback<UpdatePasswordFunction>(updatePasswordCallback, [token])
    const [state, dispatch] = useReducer(reducer, initialState);
    const searchUsers = useCallback<SearchUsersFunction>(searchUsersCallback, [token]);
    const addMemberToGroup=useCallback<AddMemberToGroupFunction>(addMemberToGroupCallback,[token])
    const deleteMemberFromGroup=useCallback<DeleteMemberFromGroupFunction>(deleteMemberFromGroupCallback,[token])
    const fetchGroupMembers=useCallback<FetchGroupMembersFunction>(fetchGroupMembersCallback,[token])
    const {
        updatingProfileDetails,
        passwordUpdatedSuccessfully,
        updatingProfilePicture,
        profileDetailsUpdateError,
        gettingAccountDetails,
        getAccountDetailsError,
        profilePicUpdateError,
        passwordUpdateError,
        updatingPassword,
        phone,
        username,
        lastName,
        firstName,
        kindergarten,
        picture,
        email,
        searchedUsers,
        searchingUsers,
        searchUsersError,
    } = state;


    useEffect(() => {
        let canceled = false;
        getDetails();
        return () => {
            canceled = true;
        }

        async function getDetails() {
            if (!token?.trim()) {
                return;
            }
            try {
                console.log('getAccountDetails started');
                dispatch({type: GET_ACCOUNT_DETAILS_STARTED});
                const details = await getProfileDetails(token);
                console.log('getAccountDetails succeeded');
                if (!canceled) {
                    dispatch({type: GET_ACCOUNT_DETAILS_SUCCEEDED, payload: {details}});
                }
            } catch (error) {
                dispatch({type: GET_ACCOUNT_DETAILS_FAILED, payload: {error}});
            }

        }
    }, [token])

    function searchUsersCallback(searchCriteria?: string, groupID?: string, page?: number, size?: number) {
        let canceled = false;
        searchUsers();
        return () => {
            canceled = true;
        }

        async function searchUsers() {
            if (!token?.trim()) {
                return;
            }
            try {
                dispatch({type: SEARCHING_USERS_STARTED});
                if (searchCriteria && searchCriteria?.length > 0) {
                    const searchResult = await searchUsersAPI(searchCriteria, groupID, page, size, token);
                    if (!canceled)
                        if (searchResult.length > 0) {
                            dispatch({type: SEARCHING_USERS_SUCCEEDED, payload: {searchResult, page}});
                        }
                } else {
                    dispatch({type: SEARCHING_USERS_SUCCEEDED, payload: {searchResult: [], page}});
                }

            } catch (error) {
                dispatch({type: SEARCHING_USERS_FAILED, payload: {error}});
            }

        }
    }

    async function addMemberToGroupCallback(memberId:string, groupId:string){
        if(!token.trim()){
            return
        }else{
            dispatch({type:ADD_MEMBER_STARTED})
            try{
                await addMemberToGroupAPI(token,groupId, memberId)
                dispatch({type:ADD_MEMBER_SUCCEEDED, payload:{id: memberId}})
            }catch (error){
                dispatch({type:ADD_MEMBER_FAILED, payload:{error}})
            }
        }
    }

    async function deleteMemberFromGroupCallback(memberId:string, groupId:string){
        if(!token.trim()){
            return
        }else{
            dispatch({type:DELETE_MEMBER_STARTED})
            try{
                await deleteMemberFromGroupAPI(token,groupId, memberId)
                dispatch({type:DELETE_MEMBER_SUCCEEDED, payload:{id: memberId}})
            }catch (error){
                dispatch({type:DELETE_MEMBER_FAILED, payload:{error}})
            }
        }
    }

    async function fetchGroupMembersCallback(groupId:string){
        if(!token.trim()){
            return
        }else{
            dispatch({type:FETCH_GROUP_MEMBERS_STARTED})
            try{
                let groupMembers=await fetchGroupMembersAPI(token,groupId)
                dispatch({type:FETCH_GROUP_MEMBERS_SUCCEEDED, payload:{groupMembers}})
            }catch (error){
                dispatch({type:FETCH_GROUP_MEMBERS_FAILED, payload:{error}})
            }
        }
    }

    async function updateProfilePicCallback(picture?: string) {
        try {
            dispatch({type: PROFILE_PICTURE_UPDATE_STARTED})
            await updateProfilePicAPI(picture, token)
            dispatch({type: PROFILE_PICTURE_UPDATE_SUCCEEDED, payload: {picture}})
        } catch (error) {
            dispatch({type: PROFILE_PICTURE_UPDATE_FAILED, payload: {error}})
        }

    }

    async function updateProfileDetailsCallback(details?: UserProps) {
        try {
            dispatch({type: PROFILE_DETAILS_UPDATE_STARTED})
            let updated = await updateProfileDetailsAPI(details, token)
            dispatch({type: PROFILE_DETAILS_UPDATE_SUCCEEDED, payload: {details: updated}})
        } catch (error) {
            dispatch({type: PROFILE_DETAILS_UPDATE_FAILED, payload: {error}})
        }
    }

    async function updatePasswordCallback(oldPswd?: string, newPswd?: string) {
        dispatch({type: PASSWORD_UPDATE_STARTED})
        let updated = await updatePasswordAPI(oldPswd, newPswd, token)
        if (updated.succeeded === true) {
            dispatch({type: PASSWORD_UPDATE_SUCCEEDED})
        } else {
            dispatch({type: PASSWORD_UPDATE_FAILED, payload: {error: new Error(updated.message)}})
        }
    }

    return (
        <UserContext.Provider value={{
            passwordUpdatedSuccessfully,
            updatingProfileDetails,
            updatingProfilePicture,
            updateProfileDetails,
            profileDetailsUpdateError,
            gettingAccountDetails,
            updateProfilePic,
            getAccountDetailsError,
            profilePicUpdateError,
            updatingPassword,
            passwordUpdateError,
            updatePassword,
            phone,
            username,
            lastName,
            firstName,
            kindergarten,
            picture,
            email,
            searchedUsers,
            searchUsers,
            searchingUsers,
            searchUsersError,
            deleteMemberFromGroup,
            addMemberToGroup,
            fetchGroupMembers
        }}>
            {children}
        </UserContext.Provider>
    );
}
