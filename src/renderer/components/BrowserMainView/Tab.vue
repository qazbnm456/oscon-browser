<template>
<div id="chrome-tabs-shell" @dblclick="onDoubleClick">
    <div class="chrome-tabs">
        <div class="chrome-tab chrome-tab-current" ref="tab">
            <svg data-v-3b6d303d="" width="15" height="30" class="left-edge">
                <path data-v-3b6d303d="" d="m15,32l0,-32l-2,3l-15,32l10,0z" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="0" class="edge-bg"></path
                ><path data-v-3b6d303d="" d="m0.5,31l14,-32l3,0" stroke-linejoin="round" stroke-dasharray="null" stroke-width="null" fill="none" class="edge-border"></path>
            </svg>
            <div class="chrome-tab-bg">
                <span class="chrome-tab-title">{{ tab.title }}</span>
            </div>
            <svg data-v-3b6d303d="" width="15" height="30" class="right-edge">
                <path data-v-3b6d303d="" d="m15,32l0,-32l-2,3l-15,34l10,0z" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="0" class="edge-bg"></path>
                <path data-v-3b6d303d="" d="m0.5,30l14,-30l4,0" stroke-linejoin="round" stroke-dasharray="null" stroke-width="null" fill="none" class="edge-border"></path>
            </svg>
        </div>
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
        onDoubleClick(event) {
            if (event.target) {
                const currentWindow = this.$electron.remote.BrowserWindow.fromId(this.windowId);
                if (currentWindow) {
                    if (currentWindow.isMaximized()) {
                        currentWindow.unmaximize();
                    } else {
                        currentWindow.maximize();
                    }
                }
            }
        },
    },
};
</script>

<style scoped>
#chrome-tabs-shell {
    display: flex;
    height: 31px;
    padding-left: 10px;
    border-bottom: 1px solid #999;
    user-select: none;
    -webkit-user-select: none;
    -webkit-app-region: drag;
}

#chrome-tabs-shell .chrome-tabs {
    flex: 1;
    display: flex;
}

#chrome-tabs-shell .chrome-tabs * {
    user-select: none;
    -webkit-user-select: none;
    cursor: default;
    font-size: 12px;
    line-height: 16px;
}

#chrome-tabs-shell .chrome-tabs .chrome-tab {
    flex: 1;
    border: 0!important;
    position: relative;
    margin: 0 -5px;
    height: 30px;
    z-index: 1;
    transition: transform .1s;
    border-bottom: 1px solid #999;
    text-align: start;
    -webkit-app-region: no-drag;
}

#chrome-tabs-shell .chrome-tabs .chrome-tab .chrome-tab-bg {
    position: absolute;
    display: flex;
    align-items: center;
    top: 0;
    left: 14px;
    right: 14px;
    height: 29px;
    padding-right: 20px;
    background: #eee;
    border-top: 1px solid gray;
    transition: background .2s;
}

#chrome-tabs-shell .chrome-tabs .chrome-tab svg {
    position: absolute;
}

#chrome-tabs-shell .chrome-tabs .chrome-tab svg.right-edge {
    transform: scaleX(-1);
    right: 0;
}

#chrome-tabs-shell .chrome-tabs .chrome-tab svg .edge-bg {
    fill: #eee;
    transition: fill .2s;
}

#chrome-tabs-shell .chrome-tabs .chrome-tab svg .edge-border {
    stroke: gray;
    stroke-width: 1px;
}

#chrome-tabs-shell .chrome-tabs .chrome-tab .chrome-tab-title {
    color: #222;
    padding: 15px 0 0 10px;
    height: 28px;
    overflow: hidden;
    white-space: nowrap;
}
</style>
