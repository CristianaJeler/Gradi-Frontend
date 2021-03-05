import React, {useContext} from "react";
import "../design/footer.css"
import {LoginContext} from "../../authentication";
import TeacherHome from "../../teachers/pages/TeacherHome";
import {Redirect, RouteComponentProps} from "react-router-dom";
import PupilHome from "../../pupils/pages/PupilHome";

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
                <>
                    <Redirect to={"/"}/>
                </>
            )

    }
};
export default Home;