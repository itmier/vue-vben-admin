<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { BasicModal } from '@/components/modal/index';
  import { useMessage } from '@/hooks/core/useMessage';

  import { RotateDragVerify, PassingData } from '@/components/verify/index';
  export default defineComponent({
    name: 'VerifyModal',

    setup(_, { listeners, attrs, emit }) {
      const { createMessage } = useMessage();

      function handleSuccess({ time }: PassingData) {
        createMessage.success(`校验成功,耗时${time}秒！`);
        emit('success');
      }
      return () => (
        <BasicModal
          title="安全校验"
          keyboard={false}
          maskClosable={false}
          on={listeners}
          canFullscreen={false}
          footer={null}
        >
          <RotateDragVerify
            width={240}
            text="请拖动滑块将图片摆正"
            {...{ props: attrs }}
            onSuccess={handleSuccess}
          />
        </BasicModal>
      );
    },
  });
</script>
