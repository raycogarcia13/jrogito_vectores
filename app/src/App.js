import { 
  lazy, 
  Suspense, 
} from "react";
import { Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import { AuthProvider, ProtectedRoute, NoAuthRoute } from "./auth"

  
import 'antd/dist/antd.min.css'
  import "./assets/styles/main.css";
  import "./assets/styles/responsive.css";
  import 'leaflet/dist/leaflet.css';
  
  const Login = lazy(()=>import('./pages/SignIn'))

  const Main = lazy( ()=>import('./components/layout/Main') )

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <AuthProvider>
          <Routes>
            <Route path="/login" exact element={ <NoAuthRoute><Suspense fallback={<>...</>}><Login login={null} /></Suspense></NoAuthRoute>} />
            <Route path="*" element={ <ProtectedRoute><Suspense fallback={<>...</>}><Main /></Suspense></ProtectedRoute>} />
          </Routes>
        </AuthProvider>
      </Provider>
    </div>
  );
}

export default App;
