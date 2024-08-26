// AuthContext.js
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loggedInUser, setLoggedInUser] = useState(null);

    const sessionStart = (user) => {
        global.isFirstLaunch = false
        setLoggedInUser(user);
    };

    const sessionClose = () => {
        setLoggedInUser(null);
    };

    const sessionUpdate = (user) => {
        setLoggedInUser(user)
    }

    return (
        <AuthContext.Provider value={{ loggedInUser, sessionStart, sessionClose, sessionUpdate }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);