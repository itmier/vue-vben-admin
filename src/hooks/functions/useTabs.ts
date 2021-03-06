import { TabItem, tabStore } from '@/store/modules/tab';
import { appStore } from '@/store/modules/app';
type Fn = () => void;
type RouteFn = (tabItem: TabItem) => void;
let refreshPage: RouteFn;
let closeAll: Fn;
let closeLeft: RouteFn;
let closeRight: RouteFn;
let closeOther: RouteFn;
let closeCurrent: RouteFn;

interface TabFn {
  refreshPageFn: RouteFn;
  closeAllFn: Fn;
  closeLeftFn: RouteFn;
  closeRightFn: RouteFn;
  closeOtherFn: RouteFn;
  closeCurrentFn: RouteFn;
}

export function useTabs() {
  function initTabFn({
    refreshPageFn,
    closeAllFn,
    closeLeftFn,
    closeRightFn,
    closeOtherFn,
    closeCurrentFn,
  }: TabFn) {
    refreshPageFn && (refreshPage = refreshPageFn);
    closeAllFn && (closeAll = closeAllFn);
    closeLeftFn && (closeLeft = closeLeftFn);
    closeRightFn && (closeRight = closeRightFn);
    closeOtherFn && (closeOther = closeOtherFn);
    closeCurrentFn && (closeCurrent = closeCurrentFn);
  }

  function resetCache() {
    const def = undefined as any;
    refreshPage = def;
    closeAll = def;
    closeLeft = def;
    closeRight = def;
    closeOther = def;
    closeCurrent = def;
  }

  function canIUseFn(): boolean {
    const { getProjCfg } = appStore;
    const { multiTabsSetting: { show } = {} } = getProjCfg;
    if (!show) {
      throw new Error('当前未开启多标签页，请在设置中打开！');
    }
    return !!show;
  }
  return {
    initTabFn,
    refreshPage: () => canIUseFn() && refreshPage(tabStore.getCurrentTab),
    closeAll: () => canIUseFn() && closeAll(),
    closeLeft: () => canIUseFn() && closeLeft(tabStore.getCurrentTab),
    closeRight: () => canIUseFn() && closeRight(tabStore.getCurrentTab),
    closeOther: () => canIUseFn() && closeOther(tabStore.getCurrentTab),
    closeCurrent: () => canIUseFn() && closeCurrent(tabStore.getCurrentTab),
    resetCache: () => canIUseFn() && resetCache(),
  };
}
