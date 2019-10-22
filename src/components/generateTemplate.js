function findCustom(config, customList) {
  config.list.forEach(item => {
    if (item.type === 'custom') {
      customList.push(item);
    } else if(item.type === 'grid') {
      item.columns.forEach(col => {
        findCustom(col, customList);
      })
    }
  })
}
export default function (code) {
  const customList = [];
  let customTemplate = '';
  findCustom(code, customList);
  customList.forEach(item => {
    customTemplate += `<template #${item.key}="scope">
      <!-- 引入自定义组件 -->
      <!-- 插槽名就是绑定的key值 -->
      <!-- 通过v-model="scope.model.${item.key}"绑定 -->
    </template>`
  });
  return `<template>
  <generate-form
    ref="generateForm"
    class="generate-from"
    :config="config"
  >
    ${customTemplate}
  </generate-form>
</template>
<script>
export default {
  data() {
    return {
      config: ${JSON.stringify(code)}
    }
  }
}
</script>`
}