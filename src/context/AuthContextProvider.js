import React, {useState, createContext, useEffect, useContext} from "react";
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
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) {
                setLoading(false)
                return
            }
            const currentUserData = await getUserData(user.uid);
            setUser({
                email: user.email,
                uid: user.uid,
                displayName: currentUserData.data.displayName,
                group: currentUserData.data.groups && currentUserData.data.groups.length ? currentUserData.data.groups[0] : '',
                dueTime: currentUserData.dueTime.toDate() || new Date(),
            });
            setLoading(false);
            console.log(user)
        });

        return unsubscribe;
    }, []);

    const value = {
        login,
        user,
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
