import { IonImg, IonSlide, IonSlides, IonText } from "@ionic/react";
import React from "react";

export const HomeComponent:React.FC=()=>{
    const slideOpts = {
        speed: 500,
        // autoplay:200,
        effect:"cube",
        paginationType:"fraction",
        loop:true

    };
    return (<>
            <IonSlides options={slideOpts} pager={true}>
                <IonSlide>
                    <IonImg src={"https://images.squarespace-cdn.com/content/v1/5f54014b15073673256f364c/1599341174839-566PCLCLLDH0WZKABKSF/ke17ZwdGBToddI8pDm48kLkXF2pIyv_F2eUT9F60jBl7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0iyqMbMesKd95J-X4EagrgU9L3Sa3U8cogeb0tjXbfawd0urKshkc5MgdBeJmALQKw/Hero+Image.jpg?format=2500w"}/>
                </IonSlide>
                <IonSlide>
                    <IonImg src={"https://miro.medium.com/max/15904/1*9L6543aM8rKDKrd0vi0n4g.jpeg"}/>
                </IonSlide>
                <IonSlide>
                    <IonImg src={"https://activeforlife.com/content/uploads/2019/01/children-playing-at-home.jpg"}/>
                </IonSlide>
            </IonSlides>
        <IonText>
            Descriere a aplicatiei
        </IonText>
    </>)
}