import React, {useState, createContext, useEffect, useContext, useRef} from "react";
import {getUserData} from "../api";
import {auth} from "../firebase";

const AuthContext = createContext();

const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = (email, password) => {
        return auth.signInWithEmailAndPassword(email, password);
    };

    const logout = () => {
        return auth.signOut();
    };

    const reset = (email) => {
        return auth.sendPasswordResetEmail(email);
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (!user) {
                setLoading(false)
                return
            }
            setUser({
                email: user.email,
                uid: user.uid
            })
            setLoading(false)
        });

        return unsubscribe;
    }, []);

    const value = {
        login,
        user,
        setUser,
        reset,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default useAuth;
