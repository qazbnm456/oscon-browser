import * as types from './mutation-types';

/* tslint:disable:max-line-length */

export const actions = {
  createTab({ commit }, { windowId, url, isURL }) {
    commit(types.CREATE_TAB, {
      windowId,
      url,
      isURL,
    });
  },

  didStartLoading({ commit }, { windowId }) {
    commit(types.DID_START_LOADING, {
      windowId,
    });
  },
  loadCommit({ commit }, { windowId, url }) {
    commit(types.LOAD_COMMIT, {
      windowId,
      url,
    });
  },
  pageTitleSet({ commit }, { windowId, title }) {
    commit(types.PAGE_TITLE_SET, {
      windowId,
      title,
    });
  },
  domReady({ commit }, { windowId, canGoBack, canGoForward }) {
    commit(types.DOM_READY, {
      windowId,
      canGoBack,
      canGoForward,
    });
  },
};
