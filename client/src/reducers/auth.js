import {
    REGISTER_SUCCESS,
    REGISTER_FAIL
} from '../actions/types';

const initialState = {
    token: localStorage.getItem('token'),
    isauthenticated: null,
    loading: true,
    user: null
}

export default function (state = initialState, action) {
    const {type, payload} = action;
    
    switch(type){
        case REGISTER_SUCCESS:
            localStorage.setItem('token', payload.token);
            return {
                ...state, //whatever is currently in state
                ...payload,
                isauthenticated: true,
                loading: false
            }
        case REGISTER_FAIL:
            localStorage.removeItem('token');
            return {
                ...state, 
                token: null,
                isauthenticated: false,
                loading: false
            }
        default:
            return state;
    }
}