<template>
<div>
    <webview ref="webview"></webview>
</div>
</template>

<script>
export default {
    props: [
        'windowId',
    ],
    methods: {
        normalizeUrl(value) {
            if (value === undefined || value === null) {
                return '';
            }
            const rscheme = /^(?:[a-z\u00a1-\uffff0-9-+]+)(?::(\/\/)?)(?!\d)/i;
            let output = value.trim();
            let scheme = (rscheme.exec(output) || [])[0];
            scheme = scheme === 'localhost://'
                ? null
                : scheme;
            if (!scheme) {
                output = `http://${value}`;
            }
            try {
                return new window.URL(output).href;
            } catch (e) {
                return output;
            }
        },
        navigateTo(value) {
            const webview = this.$refs.webview;
            if (webview) {
                // if we want to navigate to somewhere,
                // we just assign the value to the src attribute of the webview element
                webview.setAttribute('src', this.normalizeUrl(value));
            }
        },
    },
    mounted() {
        // get the webview by its reference id
        const webview = this.$refs.webview;
        // register load-commit event
        // https://electron.atom.io/docs/api/webview-tag/#event-load-commit
        webview.addEventListener('load-commit', (event) => {
            if (this.$parent.onLoadCommit) {
                this.$parent.onLoadCommit(event);
            }
        });
        // register did-start-loading event
        // https://electron.atom.io/docs/api/webview-tag/#event-did-start-loading
        webview.addEventListener('did-start-loading', () => {
            if (this.$parent.onDidStartLoading) {
                this.$parent.onDidStartLoading();
            }
        });
        // register dom-ready event
        // https://electron.atom.io/docs/api/webview-tag/#event-dom-ready
        webview.addEventListener('dom-ready', (event) => {
            if (this.$parent.onDomReady) {
                this.$parent.onDomReady(event);
            }
        });
        // register page-title-updated event
        // https://electron.atom.io/docs/api/webview-tag/#event-page-title-updated
        webview.addEventListener('page-title-updated', (event) => {
            if (this.$parent.onPagetitleUpdated) {
                this.$parent.onPagetitleUpdated(event);
            }
        });
        // register context-menu event
        // https://electron.atom.io/docs/api/web-contents/#event-context-menu
        webview.addEventListener('context-menu', (event) => {
            if (this.$parent.onContextMenu) {
                this.$parent.onContextMenu(event);
            }
        });
        // if we want to navigate to somewhere,
        // we just assign the value to the src attribute of the webview element
        this.navigateTo('https://github.com/qazbnm456/oscon-browser');
        this.$store.commit('createTab', {
            windowId: this.windowId,
            url: 'https://github.com/qazbnm456/oscon-browser',
            isURL: true,
        });
    },
};
</script>

<style scoped>
webview {
    height: calc(100vh - 27px);
    width: 100vw;
    outline: none;
    position: relative;
}
webview[hidden] {
    flex: 0 1;
    width: 0px;
    height: 0px !important;
}
webview.fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 99;
}
/* hack to work around display: none issues with webviews */
webview.hidden {
    flex: 0 1;
    width: 0px;
    height: 0px !important;
}
</style>
