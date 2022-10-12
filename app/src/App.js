import { 
  lazy, 
  Suspense, 
} from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import { 
  AuthProvider, 
  ProtectedRoute, 
  NoAuthRoute } from "./auth"

import Home from "./pages/Home";
import Tables from "./pages/Tables";
import Profile from "./pages/Profile";
import Users from "./pages/Users";
import Mapa from "./pages/Mapa";
import Main from "./components/layout/Main";

import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import 'leaflet/dist/leaflet.css';


const Login = lazy(()=>import('./pages/SignIn'))

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <AuthProvider>
          <Switch>
          <Route path="/login" exact render={ () => <NoAuthRoute><Suspense fallback={<>...</>}><Login login={null} /></Suspense></NoAuthRoute>} />
            <Main>
              <Route path="/dashboard" render={ ()=> <ProtectedRoute><Suspense fallback={<>...</>}><Home /></Suspense></ProtectedRoute>} />
              {/* <Route exact path="/dashboard" component={Home} /> */}
              <Route exact path="/tables" component={Tables} />
              <Route exact path="/profile" component={Profile} />
              <Route exact path="/mapa" component={Mapa} />
              <Route exact path="/usuarios" component={Users} />
            </Main>
          </Switch>
        </AuthProvider>
      </Provider>
    </div>
  );
}

export default App;
