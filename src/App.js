import {AuthContextProvider} from "./context/AuthContextProvider";
import AOS from "aos";
import {useEffect} from "react";
import Routes from "./Routes";

function App() {
    useEffect(() => {
        AOS.init();
    }, []);

    return (
        <AuthContextProvider>
            <Routes/>
        </AuthContextProvider>
    );
}

export default App;
