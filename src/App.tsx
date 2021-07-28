import { Form, Input } from 'antd';
import { DragEvent, useState } from 'react';
import draggable from './draggable';
type InputConfig = {
  type: string,
  label: string,
  name: string,
};
const formConfig = {
  class: 'dynamic-form',
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
  list: [
    {
      type: 'input',
      label: 'name',
      name: 'name',
    },
    {
      type: 'input',
      label: 'age',
      name: 'age',
    }
  ]
}

function text() {
  return (
    <div>test</div>
  )
}

function generateFormItem(config: InputConfig): Function{
  const formItem = {
    input: () => <Input />
  }[config.type];
  return formItem!;
}

function formArea(formConfig: any) {
  return (
    <Form
      className={formConfig.class}
      labelCol={formConfig.labelCol}
      wrapperCol={formConfig.wrapperCol}
    >
      {formConfig.list.map((item: any) => {
        return draggable(() => (
          <Form.Item label={item.label} name={item.name}>
            {generateFormItem(item)()}
          </Form.Item>
        ), { key: item.name, draggable: true })
      })}
    </Form>
  )
}

function onDragOver(event: DragEvent): void {
  event.preventDefault();
  event.dataTransfer!.dropEffect = 'move';
}

function App () {
  const [config, setConfig] = useState(formConfig);

  function onDrop(event: DragEvent) {
    event.preventDefault();
    const data = event.dataTransfer.getData('text/plain')
    if (!data) {
      return;
    }
    const configItem = JSON.parse(data);
    const formConfig = { ...config };
    formConfig.list = [...config.list, { ...configItem, name: '1', label: '1' }];
    setConfig(formConfig);
  }
  return (
    <section className="app-wrapper">
      <aside className="app-aside app-area">
        {draggable(text, {draggable: true, config: { type: 'input' } })}
      </aside>
      <main className="app-main app-area">
        {draggable(() => formArea(config), {
          onDragOver,
          onDrop, 
        })}
      </main>
      <div className="app-operate app-area"></div>
    </section>
  )
}

export default App;
