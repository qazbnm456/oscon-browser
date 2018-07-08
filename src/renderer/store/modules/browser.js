import Vue from 'vue';

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
    createTab(state, payload) {
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
    loadCommit(state, payload) {
        const windowId = payload.windowId;
        const url = payload.url;
        const tab = state.windows[windowId];

        if (tab) {
            tab.url = url;
            Vue.set(state.windows, windowId, tab);
        }
    },
    didStartLoading(state, payload) {
        const windowId = payload.windowId;
        const tab = state.windows[windowId];

        if (tab) {
            tab.isLoading = true;
            Vue.set(state.windows, windowId, tab);
        }
    },
    pageTitleSet(state, payload) {
        const windowId = payload.windowId;
        const title = payload.title;
        const tab = state.windows[windowId];

        if (tab) {
            tab.title = title;
            Vue.set(state.windows, windowId, tab);
        }
    },
    domReady(state, payload) {
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
