import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthSlice/authSlice.js";
import taskReducer from "./TaskSlice/taskSlice.js"
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist'; // Correct function name

const rootReducer = combineReducers({
    auth: authReducer,
    tasks:taskReducer
});

const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducerResult = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducerResult,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
});

export const persistor = persistStore(store);
export default store;