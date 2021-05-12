import {IonCardSubtitle, IonFooter, IonIcon, IonToolbar} from "@ionic/react";
import React, {useEffect} from "react";
import "../design/footer.css"
import {callOutline, logoFacebook, logoInstagram, logoWhatsapp} from "ionicons/icons";

export const Footer: React.FC = () => {
    useEffect(() => {
        return () => {
            console.log("Unmounted Footer component");
        };
    }, []);
    return (
        <>
                <IonFooter id={"footerToolbar"} class={"myFooter"}>
                    <IonCardSubtitle>©2021 Grădinița de acasă</IonCardSubtitle>
                    <a href={"https://www.facebook.com/cristiana.jeler/"}>
                        <IonIcon icon={logoFacebook} class={"footerSocialIcon"} id={"fb"}/>
                    </a>
                    <a href={"https://www.instagram.com/cristianajeler/?hl=ro"}>
                        <IonIcon icon={logoInstagram} class={"footerSocialIcon"} id={"insta"}/>
                    </a>
                    <br/>

                    <IonIcon icon={logoWhatsapp} class={"footerSocialIcon"} id={"phone"}/>
                    <IonCardSubtitle id={"phoneCardSubtitle"}>+40 7983 6428</IonCardSubtitle>
                </IonFooter>
        </>
    )
};
export default Footer;