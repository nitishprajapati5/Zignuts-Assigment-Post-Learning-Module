import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthSlice/authSlice.js";
import taskReducer from "./TaskSlice/taskSlice.js"
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';

const rootReducer = combineReducers({
    auth: authReducer,
    tasks: taskReducer // This will now be excluded from persistence
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth'], // <--- ONLY auth will be saved to storage
    // Alternatively, you could use: blacklist: ['tasks']
};

const persistedReducerResult = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducerResult,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    'persist/PERSIST', 
                    'persist/REHYDRATE', 
                    'persist/PAUSE', 
                    'persist/PURGE', 
                    'persist/REGISTER', 
                    'persist/FLUSH'
                ],
            },
        }),
});

export const persistor = persistStore(store);
export default store;