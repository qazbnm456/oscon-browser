<template>
<div>
  <tab :windowId="windowId"></tab>
  <navbar :windowId="windowId"></navbar>
  <page ref="page" :windowId="windowId"></page>
</div>
</template>

<script>
import Tab from './BrowserMainView/Tab';
import Navbar from './BrowserMainView/Navbar';
import Page from './BrowserMainView/Page';
import { is } from 'electron-util';

export default {
  name: 'browser-main-view',
  components: {
    Navbar,
    Page,
    Tab,
  },
  data() {
    return {
      windowId: 0,
    };
  },
  computed: {
    tab: function() {
        const tab = this.$store.state.browser.windows[this.windowId];
        if (tab === undefined) {
            return {
                windowId: -1,
                url: '',
                title: 'Loading...',
                isLoading: false,
                canGoBack: false,
                canGoForward: false,
                canRefresh: false
            };
        }
        return tab;
    },
  },
  methods: {
    onLoadCommit(event) {
      // we don't care about subframe document-level loads
      if (event.isMainFrame) {
        this.$store.dispatch('loadCommit', {
          windowId: this.windowId,
          url: event.url,
        });
      }
    },
    onDidStartLoading() {
      // https://electron.atom.io/docs/api/ipc-renderer/#ipcrenderersendchannel-arg1-arg2-
      this.$electron.ipcRenderer.send('set-title', 'Loading...');
      this.$store.dispatch('didStartLoading', {
        windowId: this.windowId,
      });
    },
    onDomReady(event) {
      // get the corresponding webview
      const webview = event.target;
      this.$store.dispatch('domReady', {
        windowId: this.windowId,
        canGoBack: webview.canGoBack(),
        canGoForward: webview.canGoForward(),
      });
    },
    onPagetitleUpdated() {
      // https://electron.atom.io/docs/api/ipc-renderer/#ipcrenderersendchannel-arg1-arg2-
      this.$electron.ipcRenderer.send('set-title', event.title);
      this.$store.dispatch('pageTitleSet', {
        windowId: this.windowId,
        title: event.title,
      });
    },
    onContextMenu(event) {
      const { Menu, MenuItem } = this.$electron.remote;
      const menu = new Menu();
      // get the corresponding webview
      const webview = event.target;
      const params = event.params;
      // add the 'Backward' menu item
      menu.append(new MenuItem({
        label: 'Backward',
        click: () => {
          this.onClickBack();
        },
        enabled: this.tab.canGoBack,
      }));
      // add the 'Forward' menu item
      menu.append(new MenuItem({
        label: 'Forward',
        click: () => {
          this.onClickForward();
        },
        enabled: this.tab.canGoForward,
      }));
      // add the 'Reload' menu item
      menu.append(new MenuItem({
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click: () => {
          this.onClickReload();
        },
      }));
      menu.append(new MenuItem({ type: 'separator' }));
      // add the 'Undo' menu item
      if (params.editFlags.canUndo) {
        menu.append(new MenuItem({
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo',
        }));
      }
      // add the 'Redo' menu item
      if (params.editFlags.canRedo) {
        menu.append(new MenuItem({
          label: 'Redo',
          accelerator: 'CmdOrCtrl+Shift+Z',
          role: 'redo',
        }));
      }
      menu.append(new MenuItem({ type: 'separator' }));
      // add the 'Cut' menu item
      if (params.editFlags.canCut) {
        menu.append(new MenuItem({
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut',
        }));
      }
      // add the 'Copy' menu item
      if (params.editFlags.canCopy) {
        menu.append(new MenuItem({
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy',
        }));
      }
      // add the 'Paste' & 'Paste and Match Style' menu item
      if (params.editFlags.canPaste) {
        menu.append(new MenuItem({
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste',
        }));
        menu.append(new MenuItem({
          label: 'Paste and Match Style',
          accelerator: 'CmdOrCtrl+Shift+V',
          role: 'pasteandmatchstyle',
        }));
      }
      // add the 'Select All' menu item
      menu.append(new MenuItem({
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall',
      }));
      menu.append(new MenuItem({ type: 'separator' }));
      // add the 'Inspect Element' menu item
      menu.append(new MenuItem({
        label: 'Inspect Element',
        click: () => {
          webview.inspectElement(params.x, params.y);
        },
      }));
      // popup the context menu
      menu.popup(this.$electron.remote.getCurrentWindow(), { async: true });
    },
    handleSelect(value) {
      // call page's navigateTo method to do the rest
      this.$refs.page.navigateTo(value);
    },
    onClickBack() {
      // get webview <- Page <- BrowserMainView
      const webview = this.$refs.page.$refs.webview;
      // https://electron.atom.io/docs/api/webview-tag/#webviewgoback
      webview.goBack();
    },
    onClickForward() {
      // get webview <- Page <- BrowserMainView
      const webview = this.$refs.page.$refs.webview;
      // https://electron.atom.io/docs/api/webview-tag/#webviewgoforward
      webview.goForward();
    },
    onClickReload() {
      // get webview <- Page <- BrowserMainView
      const webview = this.$refs.page.$refs.webview;
      // https://electron.atom.io/docs/api/webview-tag/#webviewreload
      webview.reload();
    },
  },
  beforeMount() {
    this.windowId = this.$electron.ipcRenderer.sendSync('window-id');
  },
  mounted() {
    if (is.macos) {
      document.body.classList.add('darwin');
    }
  },
};
</script>

<style>
</style>
