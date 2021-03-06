import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';

const configureStore = (initialState =>
  createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(thunk)
    )
  ));

export default configureStore;
