import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {IonApp, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import {AuthenticationProvider} from "./authentication"
import Login from "./authentication/Login";
// import "./theme/variables.css"

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import {logInOutline, personAddOutline} from "ionicons/icons";
import Signup from "./authentication/Signup";
import "./main.css"

const App: React.FC = () => (
    <IonApp>
      <IonReactRouter>
          <IonTabs>
                <IonRouterOutlet>
                  <AuthenticationProvider>
                    <Route path="/login" component={Login} exact={true}/>
                    <Route path={"/signup"} component={Signup} exact={true}/>
                    <Route exact path="/" render={() => <Redirect to="/login"/>}/>
                  </AuthenticationProvider>
                </IonRouterOutlet>
              <IonTabBar slot="bottom" id={"tab_bar"}>
                  <IonTabButton tab="Login" href="/login" class={"tab_btn"}>
                      <IonIcon icon={logInOutline}/>
                      <IonLabel>Login</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="Signup" href="/signup" class={"tab_btn"}>
                      <IonIcon icon={personAddOutline}/>
                      <IonLabel>Înregistrare</IonLabel>
                  </IonTabButton>
              </IonTabBar>
          </IonTabs>
      </IonReactRouter>
    </IonApp>
);

export default App;
