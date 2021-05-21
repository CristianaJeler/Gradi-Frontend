import React, {useContext, useEffect, useMemo, useRef} from 'react';
import {Redirect, Route} from 'react-router-dom';
import {IonApp, IonRouterOutlet} from '@ionic/react';
import {IonReactRouter} from '@ionic/react-router';
import {AuthenticationProvider, LoginContext, PrivateRoute} from "./authentication"
import Login from "./authentication/pages/Login";

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
import Signup from "./authentication/pages/Signup";
import "./main.css"
import TeacherHome from "./teachers/pages/TeacherHome";
import PupilHome from "./pupils/pages/PupilHome";
import {GenericUserProvider} from "./genericUser/provider/GenericUserProvider";
import AccountSettings from "./teachers/pages/TeacherSettings";
import Home from "./genericUser/components/Home";
import PupilsSettings from "./pupils/pages/PupilsSettings";
import Starfall from "./games/pages/starfallGame/Starfall";
import TeachersGroups from "./teachers/pages/TeachersGroups";
import {GroupsProvider} from "./groups/provider/GroupsProvider";
import PupilsGroups from "./pupils/pages/PupilsGroups";
import {TeacherSpecificGroup} from "./teachers/pages/TeacherSpecificGroup";
import {GamesProvider} from "./games/provider/GamesProvider";
import {ActivitiesProvider} from "./activities/provider/ActivitiesProvider";
import {PupilSpecificGroup} from "./pupils/pages/PupilSpecificGroup";
import Shapes from "./games/pages/shapesGame/Shapes";

const App: React.FC = () => {
    return (<IonApp>
            <IonReactRouter>
                <IonRouterOutlet>
                    <AuthenticationProvider>
                        <Route path="/login" component={Login} exact={true}/>
                        <Route path={"/signup"} component={Signup} exact={true}/>
                        <Route exact path="/" render={() => <Redirect to="/home"/>}/>
                        <Route component={Home} path={"/home"}/>
                        <ActivitiesProvider>
                            <GamesProvider>
                                <GenericUserProvider>
                                    <PrivateRoute component={TeacherHome} path={"/teachers"} exact={true}/>
                                    <PrivateRoute component={AccountSettings} path={"/teachers/settings"} exact={true}/>
                                        <GroupsProvider>
                                            <PrivateRoute component={TeachersGroups} path={"/teachers/groups"}
                                                          exact={true}/>
                                            <PrivateRoute component={TeacherSpecificGroup} path={"/teachers/groups/:id"}
                                                          exact={true}/>
                                            <PrivateRoute component={PupilsGroups} path={"/pupils/groups"}
                                                          exact={true}/>
                                            <PrivateRoute component={PupilSpecificGroup} path={"/pupils/groups/:id"}
                                                          exact={true}/>
                                        </GroupsProvider>
                                    <PrivateRoute component={PupilHome} path={"/pupils"} exact={true}/>
                                    <PrivateRoute component={PupilsSettings} path={"/pupils/settings"} exact={true}/>
                                    <PrivateRoute component={Starfall} path={"/games/starfall/:act"} exact={true}/>
                                    <PrivateRoute component={Starfall} path={"/games/starfall"} exact={true}/>
                                    <PrivateRoute component={Shapes} path={"/games/shapes/:act"} exact={true}/>
                                    <PrivateRoute component={Shapes} path={"/games/shapes"} exact={true}/>
                                </GenericUserProvider>
                            </GamesProvider>
                        </ActivitiesProvider>
                    </AuthenticationProvider>
                </IonRouterOutlet>
            </IonReactRouter>
        </IonApp>
    )
};

export default App;
