import {RouteComponentProps} from "react-router-dom";

import {
    IonContent,
    IonPage
} from "@ionic/react";
import "../../genericUser/design/settings.component.css"
import Footer from "../../genericUser/components/Footer";
import { SettingsComponent } from "../../genericUser/components/SettingsComponent";
import {PupilMenuBar} from "./PupilMenuBar";

export const PupilsSettings: React.FC<RouteComponentProps> = () => {
    return (
        <IonPage>
            {/*<MainHeader/>*/}
            {/*<PupilSideMenu/>*/}
            <PupilMenuBar/>
            <IonContent>
                <SettingsComponent/>
                <br/>
                <Footer/>
            </IonContent>
        </IonPage>
    )
};
export default PupilsSettings;