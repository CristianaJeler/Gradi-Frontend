import {RouteComponentProps} from "react-router-dom";

import {
    IonContent,
    IonPage
} from "@ionic/react";
import "../../genericUser/design/settings.component.css"
import Footer from "../../genericUser/components/Footer";
import { SettingsComponent } from "../../genericUser/components/SettingsComponent";
import {PupilMenuBar} from "./PupilMenuBar";
import React from "react";

export const PupilsSettings: React.FC<RouteComponentProps> = () => {
    return (
        <IonPage>
            {/*<MainHeader/>*/}
            {/*<PupilSideMenu/>*/}
            <PupilMenuBar/>
            <IonContent>
                <SettingsComponent/>
                <br/>

            </IonContent>
            <Footer/>
        </IonPage>
    )
};
export default PupilsSettings;