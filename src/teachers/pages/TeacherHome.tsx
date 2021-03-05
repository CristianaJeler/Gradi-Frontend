import React from "react";
import {
    IonContent,
    IonItem,
    IonPage,
    IonSlide,
    IonSlides
} from "@ionic/react";
import {MainHeader} from "../../genericUser/components/MainHeader";
import "./design/teachers.home.css"
import {TeacherSideMenu} from "./TeacherSideMenu";
import Footer from "../../genericUser/components/Footer";
import {TeacherMenuBar} from "./TeacherMenuBar";

export const TeacherHome: React.FC = () => {
    // const game = {
    //     width: "50%",
    //     height: "50%",
    //     type: Phaser.AUTO,
    //     scene: [MainScene]
    // }

    const slideOpts = {
        initialSlide: 0,
        speed: 200,
        autoplay:true,
    };
    return (
        <IonPage>
            {/*<MainHeader/>*/}
            {/*<TeacherSideMenu/>*/}
            <TeacherMenuBar/>
            <IonContent>
                <IonSlides pager={true} options={slideOpts} color={"danger"}>
                    <IonSlide>
                    </IonSlide>
                    <IonSlide>CU</IonSlide>
                    <IonSlide>IONIC</IonSlide>
                </IonSlides>
                <Footer/>
            </IonContent>
        </IonPage>
    )
};
export default TeacherHome;