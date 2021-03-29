import { AuthContextProvider } from './context/AuthContextProvider';
import Routes from './Routes';

function App() {
  return (
    <AuthContextProvider>
      <Routes />
    </AuthContextProvider>
  );
}

export default App;
