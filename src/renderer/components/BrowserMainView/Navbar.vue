<template>
<div id="browser-navbar">
    <div class="control">
        <button @click="onClickHome">{{ $t("functions.home") }}</button>
        <button @click="onClickBack" :disabled="!tab.canGoBack">{{ $t("functions.back") }}</button>
        <button @click="onClickForward" :disabled="!tab.canGoForward">{{ $t("functions.forward") }}</button>
        <button @click="onClickReload">{{ $t("functions.reload") }}</button>
    </div>
    <div class="input-group">
        <custom-autocomplete id="url-input" @keyup.enter.native="onSelect" @select="onSelect" :value="tab.url"></custom-autocomplete>
    </div>
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
        onSelect(event) {
            // get the value from the CustomAutocomplete component
            const value = event.value;
            if (value === 'OSCON') {
                // check if we have handleSelect method defined in BrowserMainView
                if (this.$parent.handleSelect) {
                    // if so, then delegating to BrowserMainView
                    this.$parent.handleSelect('https://conferences.oreilly.com/oscon/oscon-or');
                }
            } else {
                // check if we have handleSelect method defined in BrowserMainView
                if (this.$parent.handleSelect) {
                    // if so, then delegating to BrowserMainView
                    this.$parent.handleSelect(event.target.value);
                }
            }
        },
    },
};
</script>

<style>
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

.input-group {
    flex: 9;
    display: flex;
    margin: 0 5px;
}

#url-input {
    flex: 1;
    display: flex;
}

.el-input {
    flex: 1;
    display: flex;
    -webkit-app-region: no-drag;
    -webkit-user-select: none;
}
.el-input .el-input__inner {
    position: relative;
    margin: -1px -5px;
    padding-left: 5px;
    font-size: 14px;
    color: #808080;
    outline: 0;
    height: auto;
    width: calc(100vw - 205px);
    line-height: 27px;
    overflow: hidden;
    background: #fff;
    border: 1px solid #bbb;
    border-left: none;
    font-family: 'Source Code Pro', Courier, monospace;
}

.el-autocomplete-suggestion li {
    list-style: none;
    line-height: 36px;
    padding: 0 10px;
    margin: 0;
    cursor: pointer;
    color: white;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.el-autocomplete-suggestion__wrap {
    background: #324057;
    opacity: 0.9;
}
.el-autocomplete-suggestion__wrap li {
    line-height: normal;
    padding: 7px;
    text-align: left;
}
.el-autocomplete-suggestion__wrap li:hover {
    color: black;
    background: #F9FAFC;
}
</style>
