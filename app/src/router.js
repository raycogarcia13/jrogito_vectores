import { 
    lazy, 
    Suspense
  } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider} from './auth'


// import Tables from "./pages/Tables";
// import Billing from "./pages/Billing";
// import Rtl from "./pages/Rtl";
// import Profile from "./pages/Profile";
const Home = lazy(()=>import('./pages/Home'))
// const Erro404 = lazy(()=>import('./pages/Error404'))
// solicitudes
// const Solicitudes = lazy(()=>import('./pages/solicitudes/Solicitudes'))
// const SolicitudesADD = lazy(()=>import('./pages/solicitudes/Nueva'))

export default () =>{
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={ <Suspense fallback={<>...</>}><Home /></Suspense>} />
                {/* <Route path="*" element={ <Suspense fallback={<>...</>}><Erro404 /></Suspense>} /> */}
            </Routes>
        </AuthProvider>
    )
}

