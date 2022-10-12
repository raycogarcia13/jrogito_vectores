import { 
  createContext, 
  useContext, 
  useState 
} from "react";
import { useHistory, Redirect } from 'react-router-dom';
import localStorageUtil from "./utils/storage";

const AuthContext = createContext(null);

const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const navigate = useHistory();

  const [token, setToken] = useState(localStorageUtil.getToken());
  const [user, setUser] = useState(localStorageUtil.get('user')?localStorageUtil.get('user').user:null);

  const handleLogin = (data) => {
      setToken(data.token);
      setUser(data.user);
      navigate.push('/');
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    navigate.push('/login');
  };

  const value = {
    token,
    user,
    onLogin: handleLogin,
    onLogout: handleLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

const ProtectedRoute = ({ children }) => {
  const { token,user } = useAuth();
  const navigate = useHistory();

  console.log(children)
  if (!token || !user) {
    navigate.push('/login')
    // return <Redirect to="/login" />;
  }

  return children;
};

const NoAuthRoute = ({ children }) => {
  const { token,user } = useAuth();

  if (token && user) {
    return <Redirect to="/" replace />;
  }

  return children;
};


export {
  useAuth,
  AuthProvider,
  ProtectedRoute,
  NoAuthRoute
}

