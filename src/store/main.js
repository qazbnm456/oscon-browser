import Vue from 'vue'
import Vuex from 'vuex'
import { BrowserWindow, ipcMain } from 'electron'

import { actions } from './actions';
import modules from './modules'

Vue.use(Vuex)

const windows = [];

const broadcastMutations = (store) => {
  store.subscribe((mutation) => {
    Object.keys(windows).forEach((key) => {
      const id = parseInt(key, 10);
      if (typeof windows[id] !== 'number') {
        windows[id].webContents.send('vuex-apply-mutation', mutation);
      } else {
        delete windows[id];
      }
    });
  });
};

const store = new Vuex.Store({
  actions,
  modules,
  plugins: [broadcastMutations],
  strict: process.env.NODE_ENV !== 'production',
});

ipcMain.on('vuex-connect', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  window.setMaxListeners(0);

  windows[window.id] = window;
  event.returnValue = store.state;
});

ipcMain.on('vuex-action', (event, action) => {
  const type = action.type;
  store.dispatch(type, ...action.payload);
});

export default {
  getStore: () => store,
  getWindows: () => windows,
};
