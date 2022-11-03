import { 
    lazy, 
    Suspense,
    Component
  } from "react";

import { Routes, Route } from "react-router-dom";
import { AuthProvider} from './auth'




const NewHOC = (PassedComponent) => {
    return class extends Component {
        render() {
            return (
                <div>
            <PassedComponent {...this.props} />
          </div>
        )
    }
}
}
const Home = lazy( ()=>import('./pages/Home') )
const Tables = lazy( ()=>import('./pages/Tables') )
const Vector = lazy( ()=>import('./pages/Vector') )
const Epidemia = lazy( ()=>import('./pages/Epidemia') )
const Users = lazy( ()=>import('./pages/Users') )
const Mapa = lazy( ()=>import('./pages/Mapa') )
const TipoE = lazy( ()=>import('./pages/TipoEpidemia') )
const E404 = lazy( ()=>import('./pages/404') )

const HomeC = NewHOC(Home);
const MapaC = NewHOC(Mapa);

export default () =>{
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={ <Suspense fallback={<>...</>}> <Home /> </Suspense>} />
                <Route path="/home" element={ <Suspense fallback={<>...</>}> <Home /> </Suspense>} />
                <Route path="/tables" element={  <Suspense fallback={<>...</>}><Tables /></Suspense>} />
                <Route path="/vectores" element={  <Suspense fallback={<>...</>}><Vector /></Suspense>} />
                <Route path="/epidemia" element={  <Suspense fallback={<>...</>}><Epidemia /></Suspense>} />
                <Route path="/mapa" element={  <Suspense fallback={<>...</>}><Mapa /></Suspense>} />
                <Route path="/usuarios" element={ <Suspense fallback={<>...</>}><Users /></Suspense>} />
                <Route path="/nomenclador_tipo" element={ <Suspense fallback={<>...</>}><TipoE /></Suspense>} />
                <Route path="*" element={ <Suspense fallback={<>...</>}><E404 /></Suspense>} />
            </Routes>
        </AuthProvider>
    )
}

