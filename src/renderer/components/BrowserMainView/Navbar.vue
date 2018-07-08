<template>
<div id="browser-navbar">
    <div class="control">
        <button @click="onClickHome">{{ $t("functions.home") }}</button>
        <button @click="onClickBack" :disabled="!tab.canGoBack">{{ $t("functions.back") }}</button>
        <button @click="onClickForward" :disabled="!tab.canGoForward">{{ $t("functions.forward") }}</button>
        <button @click="onClickReload">{{ $t("functions.reload") }}</button>
    </div>
    <input @keyup.enter="onSelect" :value="tab.url">
</div>
</template>

<script>
export default {
    props: [
        'windowId',
    ],
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
        onClickHome() {
            // check if we have handleSelect method defined in BrowserMainView
            if (this.$parent.handleSelect) {
                // if so, then delegating to BrowserMainView
                this.$parent.handleSelect('https://github.com/qazbnm456/oscon-browser');
            }
        },
        onClickBack() {
            // check if we have onClickBack method defined in BrowserMainView
            if (this.$parent.onClickBack) {
                // if so, then delegating to BrowserMainView
                this.$parent.onClickBack();
            }
        },
        onClickForward() {
            // check if we have onClickForward method defined in BrowserMainView
            if (this.$parent.onClickForward) {
                // if so, then delegating to BrowserMainView
                this.$parent.onClickForward();
            }
        },
        onClickReload() {
            // check if we have onClickReload method defined in BrowserMainView
            if (this.$parent.onClickReload) {
                // if so, then delegating to BrowserMainView
                this.$parent.onClickReload();
            }
        },
        onSelect() {
            // get the value from input field
            const value = event.target.value;
            if (value) {
                // check if we have handleSelect method defined in BrowserMainView
                if (this.$parent.handleSelect) {
                    // if so, then delegating to BrowserMainView
                    this.$parent.handleSelect(value);
                }
            }
        },
    },
};
</script>

<style scoped>
#browser-navbar {
    display: flex;
    height: 27px;
}
#browser-navbar > .control {
    width: 200px;
    display: flex;
}
#browser-navbar > .control > button {
    flex: 1
}
#browser-navbar > input {
    flex: 1;
    font-size: 14px;
    font-family: Source Code Pro,Courier,monospace;
}
</style>
