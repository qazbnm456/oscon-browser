<template>
<div>
  <tab ref="tab"></tab>
  <navbar ref="navbar"></navbar>
  <page ref="page"></page>
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
  methods: {
    onLoadCommit(event) {
      // we don't care about subframe document-level loads
      if (event.isMainFrame) {
        // get Navbar by its reference id
        const navbar = this.$refs.navbar;
        // update value of 'inputValue'
        navbar.inputValue = event.url;
      }
    },
    onDidStartLoading() {
      // https://electron.atom.io/docs/api/ipc-renderer/#ipcrenderersendchannel-arg1-arg2-
      this.$electron.ipcRenderer.send('set-title', 'Loading...');
    },
    onDomReady(event) {
      // get the corresponding webview
      const webview = event.target;
      // get Navbar by its reference id
      const navbar = this.$refs.navbar;
      // update values of 'canGoBack' and 'canGoForward'
      navbar.canGoBack = webview.canGoBack();
      navbar.canGoForward = webview.canGoForward();
    },
    onPagetitleUpdated() {
      // get Tab by its reference id
      const tab = this.$refs.tab;
      tab.title = event.title;
      // https://electron.atom.io/docs/api/ipc-renderer/#ipcrenderersendchannel-arg1-arg2-
      this.$electron.ipcRenderer.send('set-title', event.title);
    },
    onContextMenu(event) {
      const { Menu, MenuItem } = this.$electron.remote;
      const menu = new Menu();
      // get the corresponding webview
      const webview = event.target;
      // get Navbar by its reference id
      const navbar = this.$refs.navbar;
      const params = event.params;
      // add the 'Backward' menu item
      menu.append(new MenuItem({
        label: 'Backward',
        click: () => {
          this.onClickBack();
        },
        enabled: navbar.canGoBack,
      }));
      // add the 'Forward' menu item
      menu.append(new MenuItem({
        label: 'Forward',
        click: () => {
          this.onClickForward();
        },
        enabled: navbar.canGoForward,
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
  mounted() {
    if (is.macos) {
      document.body.classList.add('darwin');
    }
  },
};
</script>

<style>
</style>
