import React, {useEffect} from "react";
import {
    IonContent,
    IonPage,

} from "@ionic/react";
import "./design/teachers.home.css"
import Footer from "../../genericUser/components/Footer";
import {TeacherMenuBar} from "./TeacherMenuBar";
import {HomeComponent} from "../../genericUser/components/HomeComponent";

export const TeacherHome: React.FC = () => {
    useEffect(() => {
        return () => {
            console.log("Unmounted TeacherHome component");
        };
    }, []);
    return (
        <IonPage>
            <TeacherMenuBar/>
            <IonContent>
                <HomeComponent/>
                <Footer/>
            </IonContent>
        </IonPage>
    )
};
export default TeacherHome;