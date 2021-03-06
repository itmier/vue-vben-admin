<script lang="tsx">
  import {
    defineComponent,
    computed,
    unref,
    reactive,
    watch,
    ref,
    getCurrentInstance,
  } from 'compatible-vue';
  import { useDesign } from '@/hooks/core/useDesign';
  import { useTimeout } from '@/hooks/core/useTimeout';

  import BasicDragVerify from './index.vue';

  import { hackCss } from '@/utils/domUtils';

  import { rotateProps } from './props';
  import { MoveData, DragVerifyActionType } from './types';
  export default defineComponent({
    name: 'ImgRotateDargVerify',
    props: rotateProps,
    setup(props, { emit, attrs }) {
      const basicRef = ref<DragVerifyActionType | null>(null);
      const { prefixCls } = useDesign('ir-dv');
      const state = reactive({
        isPassing: false,
        imgStyle: {},
        randomRotate: 0,
        currentRotate: 0,
        toOrigin: false,
        startTime: 0,
        endTime: 0,
      });

      watch(
        () => state.isPassing,
        (isPassing) => {
          if (isPassing) {
            const { startTime, endTime } = state;
            const time = (endTime - startTime) / 1000;
            emit('success', { isPassing, time: time.toFixed(1) });
            emit('change', isPassing);
          }
        }
      );

      const getImgWrapStyleRef = computed(() => {
        const { imgWrapStyle, imgWidth } = props;
        return {
          width: `${imgWidth}px`,
          height: `${imgWidth}px`,
          ...imgWrapStyle,
        };
      });

      const getFactorRef = computed(() => {
        const { minDegree, maxDegree } = props;
        if (minDegree === maxDegree) {
          return Math.floor(1 + Math.random() * 6) / 10 + 1;
        }
        return 1;
      });
      function handleStart() {
        state.startTime = new Date().getTime();
      }

      function handleDragBarMove(data: MoveData) {
        const { imgWidth, height, maxDegree } = props;
        const { moveX } = data;
        const currentRotate = Math.ceil(
          (moveX / (imgWidth! - parseInt(height!))) * maxDegree! * unref(getFactorRef)
        );
        state.currentRotate = currentRotate;
        state.imgStyle = hackCss('transform', `rotateZ(${state.randomRotate - currentRotate}deg)`);
      }

      function handleImgOnLoad() {
        const { minDegree, maxDegree } = props;
        const ranRotate = Math.floor(minDegree! + Math.random() * (maxDegree! - minDegree!)); // 生成随机角度
        state.randomRotate = ranRotate;
        state.imgStyle = hackCss('transform', `rotateZ(${ranRotate}deg)`);
      }

      function handleDragEnd() {
        const { randomRotate, currentRotate } = state;
        const { diffDegree } = props;

        if (Math.abs(randomRotate - currentRotate) > (diffDegree || 10)) {
          state.imgStyle = hackCss('transform', `rotateZ(${randomRotate}deg)`);
          state.toOrigin = true;
          useTimeout(() => {
            state.toOrigin = false;
            //  时间与动画时间保持一致
          }, 300);
        } else {
          checkPass();
        }
      }
      function checkPass() {
        state.isPassing = true;
        state.endTime = new Date().getTime();
      }

      function resume() {
        const basicEl = unref(basicRef);
        if (!basicEl) {
          return;
        }
        state.isPassing = false;
        basicEl.resume();
        handleImgOnLoad();
      }

      const instance = getCurrentInstance() as any;
      if (instance) {
        instance.resume = resume;
      }
      handleImgOnLoad();
      return () => {
        const { src } = props;
        const { toOrigin, isPassing } = state;
        const imgCls: string[] = [];
        if (toOrigin) {
          imgCls.push('to-origin');
        }
        return (
          <div class={prefixCls}>
            <div class={`${prefixCls}-img__wrap`} style={unref(getImgWrapStyleRef)}>
              <img
                src={src}
                onLoad={handleImgOnLoad}
                width={props.width}
                class={imgCls}
                style={state.imgStyle}
              />
            </div>
            <BasicDragVerify
              value={isPassing}
              class={`${prefixCls}-drag__bar`}
              onMove={handleDragBarMove}
              onEnd={handleDragEnd}
              onStart={handleStart}
              ref={basicRef}
              {...{
                props: {
                  ...attrs,
                  ...props,
                  isSlot: true,
                },
              }}
            />
          </div>
        );
      };
    },
  });
</script>
<style scoped lang="less">
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-ir-dv';

  .@{prefix-cls} {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;

    &-img__wrap {
      position: relative;
      overflow: hidden;
      border-radius: 50%;

      img {
        width: 100%;
        border-radius: 50%;

        &.to-origin {
          transition: transform 0.3s;
        }
      }
    }

    &-drag__bar {
      margin-top: 20px;
    }
  }
</style>
