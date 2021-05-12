import {IonContent, IonItem, IonTextarea} from "@ionic/react";
import React, {useReducer, useState} from "react";
import {ActivitiesState} from "../../../activities/provider/ActivitiesProvider";
interface ActivityDescriptionState{
    activityDescription:string;
}

const initialState:ActivityDescriptionState={
    activityDescription:''
}

export const ActivityDescriptionContext = React.createContext<ActivityDescriptionState>(initialState);


interface ActionProperties {
    type: string,
    content?: any,
}

const SET_DESCRIPTION='SET_DESCRIPTION'
const reducer: (state: ActivityDescriptionState, action: ActionProperties) => ActivityDescriptionState =
    (state, {type, content}) => {
        switch (type) {
            case SET_DESCRIPTION:
                return {
                    ...state,
                    activityDescription:content.description
                };
            default:
                return state;
        }
    };
export const ActivityDescription:React.FC=()=>{
    const [state, dispatch] = useReducer(reducer, initialState);
    const {activityDescription}=state;
    return <>
        <IonItem class={"newActivityItems"}>
            <IonTextarea placeholder={"Descrierea activității"} id={"descriptionText"}
                         rows={8}
                         value={activityDescription}
                         onIonChange={(e)=>dispatch({type:SET_DESCRIPTION,content:{description:e.detail.value!}})}/>
        </IonItem>
    </>
}