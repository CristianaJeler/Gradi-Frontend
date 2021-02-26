import React, {useCallback, useContext, useEffect, useReducer} from 'react';
import PropTypes from 'prop-types';

export interface TeachersState {
    fetching: boolean,
}

const initialState: TeachersState = {
    fetching: false,
}

export const TeachersContext = React.createContext<TeachersState>(initialState);

interface TeachersProviderProps {
    children: PropTypes.ReactNodeLike,
}

export const TeachersProvider: React.FC<TeachersProviderProps> = ({ children }) => {
    return (
        <TeachersContext.Provider value={{fetching:true}}>
            {children}
        </TeachersContext.Provider>
    );
};
