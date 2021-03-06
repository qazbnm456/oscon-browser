import Vue from 'vue'
import Vuex from 'vuex'
import { ipcRenderer } from 'electron'

import { actions } from './actions';
import modules from './modules'

Vue.use(Vuex)

const state = ipcRenderer.sendSync('vuex-connect');

Object.keys(modules).forEach((module) => {
  modules[module].state = {
    ...modules[module].state,
    ...state[module],
  };
});

const store = new Vuex.Store({
  actions,
  modules,
  strict: process.env.NODE_ENV !== 'production',
});

store.dispatch = function (type, ...payload) {
  let newType = type;
  let newPayload = payload;
  if (typeof type === 'object' && type.type && arguments.length === 1) {
    newPayload = [type.payload];
    newType = type.type;
  }

  ipcRenderer.send('vuex-action', {
    type: newType,
    payload: newPayload,
  });
}

ipcRenderer.on('vuex-apply-mutation', (event, mutation) => {
  store.commit(mutation.type, mutation.payload);
});

export default store;
