<script lang="tsx">
  import { defineComponent, ref, unref } from 'compatible-vue';
  import { Button } from 'ant-design-vue';

  // 第三方组件不符合项目规范，所以用require引入
  const Upload = require('vue-image-crop-upload').default;
  export default defineComponent({
    name: 'ImageCropDemo',

    setup() {
      const showRef = ref(false);
      const resultUrlRef = ref('');
      return () => (
        <div class="p-4">
          <Button type="primary" onClick={() => (showRef.value = !unref(showRef))}>
            设置头像
          </Button>
          <img class="m-4" src={unref(resultUrlRef)} width={300} />
          <Upload
            field="avatar1"
            ki="0"
            width={300}
            height={300}
            img-format="jpg"
            img-bgc="#fff"
            url="https://httpbin.org/post"
            value={unref(showRef)}
            headers={{ smail: '*_~' }}
            params={{
              token: '123456798',
              name: 'img',
            }}
            onInput={(v: boolean) => (showRef.value = v)}
            on={{
              'crop-success': (imgDataUrl: string) => {
                resultUrlRef.value = imgDataUrl;
              },
            }}
          />
        </div>
      );
    },
  });
</script>
