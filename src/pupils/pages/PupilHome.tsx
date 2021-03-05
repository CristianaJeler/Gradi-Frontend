import React from "react";
import {IonContent, IonItem, IonPage} from "@ionic/react";
import {MainHeader} from "../../genericUser/components/MainHeader";
import Footer from "../../genericUser/components/Footer";
import {PupilMenuBar} from "./PupilMenuBar";
import { PupilSideMenu } from "./PupilSideMenu";

export const PupilHome: React.FC=()=>{
    return(
        <IonPage>
            {/*<MainHeader/>*/}
                <PupilMenuBar/>
            {/*<PupilSideMenu/>*/}
            <IonContent>
                <IonItem>PAGINA ACASA COPII & PARINTI</IonItem>
                <Footer/>
            </IonContent>
        </IonPage>
    )
};
export default PupilHome;