import React, {useContext, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Redirect, Route} from 'react-router-dom';
import {LoginContext, LoginState} from '../provider/AuthenticationProvider';
import {getLogger} from '../../core';
import {Storage} from "@capacitor/core";

const log = getLogger('Login');

export interface PrivateRouteProps {
    component: PropTypes.ReactNodeLike;
    path: string;
    exact?: boolean;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({component: Component, ...rest}) => {
    const {isAuthenticated} = useContext<LoginState>(LoginContext);
    log('render, isAuthenticated', isAuthenticated);

    return (
        <Route {...rest} render={props => {
            if (isAuthenticated) {
                // @ts-ignore
                return <Component {...props} />;
            }
            return <Redirect to={{pathname: '/'}}/>
        }}/>
    );
}