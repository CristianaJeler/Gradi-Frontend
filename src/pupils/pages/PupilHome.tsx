import React from "react";
import {RouteComponentProps} from "react-router-dom";
import {IonContent,IonPage} from "@ionic/react";
import {AuthHeader} from "../../authentication/pages/design/AuthHeader";

export const PupilHome: React.FC<RouteComponentProps>=()=>{
    return(
        <IonPage>
            <AuthHeader/>
            <IonContent>
                PAGINA DE COPILAS
            </IonContent>
        </IonPage>
    )
};
export default PupilHome;