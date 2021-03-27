import React from "react";
import {IonContent,  IonPage} from "@ionic/react";
import Footer from "../../genericUser/components/Footer";
import {PupilMenuBar} from "./PupilMenuBar";
import {HomeComponent} from "../../genericUser/components/HomeComponent";

export const PupilHome: React.FC=()=>{
    return(
        <IonPage>
            {/*<MainHeader/>*/}
                <PupilMenuBar/>
            {/*<PupilSideMenu/>*/}
            <IonContent>
                <HomeComponent/>
                <Footer/>
            </IonContent>
        </IonPage>
    )
};
export default PupilHome;