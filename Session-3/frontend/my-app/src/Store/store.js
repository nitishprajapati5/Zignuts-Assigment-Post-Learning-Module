import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthSlice/authSlice.js"
import storage from 'redux-persist/lib/storage';
import {persistStore, persistReducer} from 'redux-persist';


const rootReducer = combineReducers({
    auth:authReducer
})

const persistConfig = {
    key : 'root',
    storage
}

const persistedReducer = persistedReducer(persistConfig,rootReducer)

const store = configureStore({
    reducer:persistedReducer,
    middleware:(getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck:false
    })
})

export const persistor = persistStore(store)
export default store;