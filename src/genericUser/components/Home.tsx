import React, {useContext} from "react";
import "../design/footer.css"
import {LoginContext} from "../../authentication";
import {Redirect, RouteComponentProps} from "react-router-dom";
import {MainHeader} from "./MainHeader";
import {IonContent, IonPage} from "@ionic/react";
import {HomeComponent} from "./HomeComponent";
import Footer from "./Footer";

export const Home: React.FC<RouteComponentProps>  = () => {
    const {userType} = useContext(LoginContext)

    switch (userType) {
        case '1':
            return (
                <>
                    <Redirect to={"/teachers"}/>
                </>
            )
        case '2':
            return (
                <>
                    <Redirect to={"/pupils"}/>
                </>
            )
        default:
            return (
                // <>
                //     <Redirect to={"/homepage"}/>
                // </>
                <IonPage>
                    <MainHeader/>
                    <IonContent>
                        <HomeComponent/>
                        <Footer/>
                    </IonContent>
                </IonPage>
            )

    }
};
export default Home;