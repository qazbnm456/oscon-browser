import Vue from 'vue';
import * as types from '../mutation-types';

const state = {
    windows: [],
}

function createTabObject(state, wid, openUrl) {
    return {
      windowId: wid,
      url: openUrl,
      title: '',
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
      canRefresh: false
    };
}

const mutations = {
    // tab handler
    [types.CREATE_TAB](state, payload) {
        const windowId = payload.windowId;
        const url = payload.url;
        const isURL = payload.isURL;

        let newUrl = '';
        if (isURL) {
            newUrl = url;
        } else if (url) {
            newUrl = encodeURIComponent(url);
        } else {
            newUrl = 'https://github.com/qazbnm456/oscon-browser'
        }
        if (state.windows[windowId] === undefined) {
            state.windows[windowId] = createTabObject(state, windowId, newUrl);
        }
    },
    [types.LOAD_COMMIT](state, payload) {
        const windowId = payload.windowId;
        const url = payload.url;
        const tab = state.windows[windowId];

        if (tab) {
            tab.url = url;
            Vue.set(state.windows, windowId, tab);
        }
    },
    [types.DID_START_LOADING](state, payload) {
        const windowId = payload.windowId;
        const tab = state.windows[windowId];

        if (tab) {
            tab.isLoading = true;
            Vue.set(state.windows, windowId, tab);
        }
    },
    [types.PAGE_TITLE_SET](state, payload) {
        const windowId = payload.windowId;
        const title = payload.title;
        const tab = state.windows[windowId];

        if (tab) {
            tab.title = title;
            Vue.set(state.windows, windowId, tab);
        }
    },
    [types.DOM_READY](state, payload) {
        const windowId = payload.windowId;
        const tab = state.windows[windowId];

        if (tab) {
            tab.canGoBack = payload.canGoBack;
            tab.canGoForward = payload.canGoForward;
            tab.canRefresh = true;
            Vue.set(state.windows, windowId, tab);
          }
    },
}

export default {
    state,
    mutations,
}
