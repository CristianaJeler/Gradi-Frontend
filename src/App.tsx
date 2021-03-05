import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import {IonApp, IonRouterOutlet} from '@ionic/react';
import {IonReactRouter} from '@ionic/react-router';
import {AuthenticationProvider, PrivateRoute} from "./authentication"
import Login from "./authentication/pages/Login";
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
import Signup from "./authentication/pages/Signup";
import "./main.css"
import TeacherHome from "./teachers/pages/TeacherHome";
import PupilHome from "./pupils/pages/PupilHome";
import {PupilsProvider} from "./pupils/provider/PupilsProvider";
import {GenericUserProvider} from "./genericUser/provider/GenericUserProvider";
import AccountSettings from "./teachers/pages/TeacherSettings";
import Home from "./genericUser/components/Home";
import PupilsSettings from "./pupils/pages/PupilsSettings";

const App: React.FC = () => (
    <IonApp>
        <IonReactRouter>
            <IonRouterOutlet>
                <AuthenticationProvider>
                    <Route path="/login" component={Login} exact={true}/>
                    <Route path={"/signup"} component={Signup} exact={true}/>
                    <Route exact path="/" render={() => <Redirect to="/login"/>}/>
                    <GenericUserProvider>
                        <PrivateRoute component={Home} path={"/home"}/>
                        <PrivateRoute component={TeacherHome} path={"/teachers"} exact={true}/>
                        <PrivateRoute component={AccountSettings} path={"/teachers/settings"} exact={true}/>
                        <PupilsProvider>
                            <PrivateRoute component={PupilHome} path={"/pupils"}/>
                            <PrivateRoute component={PupilsSettings} path={"/pupils/settings"}/>
                        </PupilsProvider>
                    </GenericUserProvider>
                </AuthenticationProvider>
            </IonRouterOutlet>
        </IonReactRouter>
    </IonApp>
);

export default App;
