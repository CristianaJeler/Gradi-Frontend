import React from 'react';
import PropTypes from 'prop-types';

export interface TeachersState {

}

const initialState: TeachersState = {

}

export const TeachersContext = React.createContext<TeachersState>(initialState);

interface TeachersProviderProps {
    children: PropTypes.ReactNodeLike,
}

export const TeachersProvider: React.FC<TeachersProviderProps> = ({ children }) => {
    return (
        <TeachersContext.Provider value={{}}>
            {children}
        </TeachersContext.Provider>
    );
};
