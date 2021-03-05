import {RouteComponentProps} from "react-router-dom";

import {
    IonContent,
    IonPage
} from "@ionic/react";
import {MainHeader} from "../../genericUser/components/MainHeader";
import {TeacherSideMenu} from "./TeacherSideMenu";
import "../../genericUser/design/settings.component.css"
import Footer from "../../genericUser/components/Footer";
import { SettingsComponent } from "../../genericUser/components/SettingsComponent";
import {TeacherMenuBar} from "./TeacherMenuBar";

export const TeacherAccountSettings: React.FC<RouteComponentProps> = () => {
    return (
        <IonPage>
            {/*<MainHeader/>*/}
            {/*<TeacherSideMenu/>*/}
            <TeacherMenuBar/>
            <IonContent>
                <SettingsComponent/>
                <br/>
                <Footer/>
            </IonContent>

        </IonPage>
    )
};
export default TeacherAccountSettings;