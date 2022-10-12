import {
    AUTH_FAILED,
    AUTH_SUCCESS,
    AUTH_REQUEST,
    AUTH_CLEAR_ERROR
} from '../constants'

export const authReducer = (state = {user:{}},action)=>{
    switch(action.type){
        case AUTH_CLEAR_ERROR:
            return {
                ...state,
                logged:false,
                loading:false,
                error:null,
                user:{}
            }
        case AUTH_REQUEST:
            return {
                ...state,
                logged:false,
                error:null,
                loading:true,
                user:{}
            }
        case AUTH_FAILED:
            return {
                ...state,
                loading:false,
                logged:false,
                status:action.payload.status,
                error:(action.payload.error==="auth.error")?"Credenciales inválidas":"Error interno"
            }
        case AUTH_SUCCESS:
            return {
                ...state,
                loading:false,
                logged:true,
                error:null,
                status:action.payload.status,
                user:action.payload.user,
                token:action.payload.token
            }
        default:
            return state;
    }
}