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
const Tables = lazy( ()=>import('./pages/Febriles') )
const Vector = lazy( ()=>import('./pages/Vector') )
const Epidemia = lazy( ()=>import('./pages/Epidemia') )
const EpidemiaMedico = lazy( ()=>import('./pages/EpidemiaMedico') )
const Analisis = lazy( ()=>import('./pages/Analisis') )
const Users = lazy( ()=>import('./pages/Users') )
const Mapa = lazy( ()=>import('./pages/Mapa') )
const TipoE = lazy( ()=>import('./pages/TipoEpidemia') )
const Sintomas = lazy( ()=>import('./pages/Sintomas') )
const Febriles = lazy( ()=>import('./pages/Febriles') )
const Resumen_e = lazy( ()=>import('./pages/Resumen_e') )
const Tasa = lazy( ()=>import('./pages/Tasa') )



const E404 = lazy( ()=>import('./pages/404') )

export default () =>{
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={ <Suspense fallback={<>...</>}> <Home /> </Suspense>} />
                <Route path="/home" element={ <Suspense fallback={<>...</>}> <Home /> </Suspense>} />
                <Route path="/tables" element={  <Suspense fallback={<>...</>}><Tables /></Suspense>} />
                <Route path="/vectores" element={  <Suspense fallback={<>...</>}><Vector /></Suspense>} />
                <Route path="/epidemia" element={  <Suspense fallback={<>...</>}><Epidemia /></Suspense>} />
                <Route path="/epidemia_medico" element={  <Suspense fallback={<>...</>}><EpidemiaMedico /></Suspense>} />
                <Route path="/analisis" element={  <Suspense fallback={<>...</>}><Analisis /></Suspense>} />
                <Route path="/mapa" element={  <Suspense fallback={<>...</>}><Mapa /></Suspense>} />
                <Route path="/usuarios" element={ <Suspense fallback={<>...</>}><Users /></Suspense>} />
                <Route path="/nomenclador_tipo" element={ <Suspense fallback={<>...</>}><TipoE /></Suspense>} />
                <Route path="/nomenclador_sintoma" element={ <Suspense fallback={<>...</>}><Sintomas /></Suspense>} />
                <Route path="/medico" element={ <Suspense fallback={<>...</>}><Mapa /></Suspense>} />
                <Route path="/chem" element={ <Suspense fallback={<>...</>}><Mapa /></Suspense>} />
                <Route path="/vector" element={ <Suspense fallback={<>...</>}><Mapa /></Suspense>} />
                <Route path="/febriles" element={ <Suspense fallback={<>...</>}><Febriles /></Suspense>} />
                <Route path="/enfermedad" element={ <Suspense fallback={<>...</>}><Resumen_e /></Suspense>} />
                <Route path="/tasa" element={ <Suspense fallback={<>...</>}><Tasa /></Suspense>} />
                <Route path="*" element={ <Suspense fallback={<>...</>}><E404 /></Suspense>} />
            </Routes>
        </AuthProvider>
    )
}

