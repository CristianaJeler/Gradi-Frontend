import React from 'react';
import PropTypes from 'prop-types';

export interface PupilsState {
    fetching: boolean,
}

const initialState: PupilsState = {
    fetching: false,
}

export const PupilsContext = React.createContext<PupilsState>(initialState);

interface PupilsProviderProps {
    children: PropTypes.ReactNodeLike,
}

export const PupilsProvider: React.FC<PupilsProviderProps> = ({ children }) => {
    return (
        <PupilsContext.Provider value={{fetching:true}}>
            {children}
        </PupilsContext.Provider>
    );
};
