import {IonCardSubtitle, IonFooter, IonIcon, IonToolbar} from "@ionic/react";
import React, {useEffect} from "react";
import "../design/footer.css"
import {callOutline, logoFacebook, logoInstagram} from "ionicons/icons";

export const Footer: React.FC = () => {
    useEffect(() => {
        return () => {
            console.log("Unmounted Footer component");
        };
    }, []);
    return (
        <>
            {/*<IonFooter translucent={true} className="ion-no-border" id={"myFooter"}>*/}
                <IonToolbar id={"footerToolbar"} class={"myFooter"}>
                    <IonCardSubtitle>©2021 Cristiana-Ioana Jeler</IonCardSubtitle>
                    <a href={"https://www.facebook.com/cristiana.jeler/"}>
                        <IonIcon icon={logoFacebook} class={"footerSocialIcon"} id={"fb"}/>
                    </a>
                    <a href={"https://www.instagram.com/cristianajeler/?hl=ro"}>
                        <IonIcon icon={logoInstagram} class={"footerSocialIcon"} id={"insta"}/>
                    </a>
                    <br/>

                    <IonIcon icon={callOutline} class={"footerSocialIcon"} id={"phone"}/>
                    <IonCardSubtitle id={"phoneCardSubtitle"}>+4079836428</IonCardSubtitle>
                </IonToolbar>
            {/*</IonFooter>*/}
        </>
    )
};
export default Footer;