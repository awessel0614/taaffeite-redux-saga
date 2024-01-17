import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App/App.jsx';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
//Step 1: Saga imports... the next three imports are what we need!
import createSagaMiddleware from 'redux-saga';
// put is dispatch!
import { takeEvery, put } from 'redux-saga/effects';
import axios from 'axios';
//END SAGA IMPORTS
import logger from 'redux-logger';

const elementList = (state = [], action) => {
    switch (action.type) {
        case 'SET_ELEMENTS':
            return action.payload;
        default:
            return state;
    }
};    

// Sagas are generator functions
function* fetchElements() {
    try {
        // Try everything, if no errors then we're good!
        const response = yield axios.get('/api/element');
        // No need to use .then with a saga!
        // Dispatch an action (make sure the type is different than the saga action type)
        const action = { type: 'SET_ELEMENTS', payload: response.data }
        // put is dispatch!!
        yield put(action);
    } catch (error) {
        // Any errors that occur will trigger the catch!
        console.log('Error fetching elements', error)
        alert('Something went wrong!');
    }
}


function* postElement(action) {
    try {
        // Sends our data to the server
        yield axios.post('/api/element', action.payload);
        // Go get the updated list of elements
        yield put({ type: 'FETCH_ELEMENTS' });
    } catch (error) {
        console.log('Error posting element', error);
        alert('Something went wrong!');
    }
}

const planets = ( state = [], action ) => {
    if (action.type === 'SET_PLANETS') {
        return action.payload;
    }
    return state;
}

function* getPlanets() {
    try {
        const response = yield axios.get('https://swapi.dev/api/planets/');
        console.log(response.data.results);
        yield put({ type: 'SET_PLANETS', payload:response.data.results});
    } catch (error) {
        console.log('Error in getPlanets', error);
        alert('Something went wrong!');
    }
}


// this is the saga that will watch for actions
function* rootSaga() {
    // Add all sagas here! this is similar to combine reducers :)
    yield takeEvery('FETCH_ELEMENTS', fetchElements);
    yield takeEvery('ADD_ELEMENT', postElement);
    yield takeEvery('FETCH_PLANETS', getPlanets);
    // ^^ this line above basically goes through all the yields for you,
    // if basically does the .next() thing that we did in the test.js file
}


const sagaMiddleware = createSagaMiddleware();

// This is creating the store
// the store is the big JavaScript Object that holds all of the information for our application
const storeInstance = createStore(
    // This function is our first reducer
    // reducer is a function that runs every time an action is dispatched
    combineReducers({
        elementList,
        planets,
    }),
    applyMiddleware(sagaMiddleware, logger),
);

sagaMiddleware.run(rootSaga);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Provider store={storeInstance}>
            <App />
        </Provider>
    </React.StrictMode>
);
