import { 
  createContext, 
  useContext, 
  useState 
} from "react";
import { useNavigate, Navigate } from 'react-router-dom';
import localStorageUtil from "./utils/storage";

const AuthContext = createContext(null);

const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorageUtil.getToken());
  const [user, setUser] = useState(localStorageUtil.get('user')?localStorageUtil.get('user').user:null);

  const handleLogin = (data) => {
      setToken(data.token);
      setUser(data.user);
      navigate('/home',{replace:true});
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    navigate('/login',{replace:true});
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
  const navigate = useNavigate();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const NoAuthRoute = ({ children }) => {
  const { token,user } = useAuth();

  if (token && user) {
    return <Navigate to="/home" replace />;
  }

  return children;
};


export {
  useAuth,
  AuthProvider,
  ProtectedRoute,
  NoAuthRoute
}

