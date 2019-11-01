export default {
  'base': [
    {
      label: '文本',
      icon: 'label',
      type: 'label',
      default: '默认文本',
      labelWidth: '100px'
    },
    {
      label: '单行文本', 
      icon: 'input', 
      type: 'input', 
      default: '',
      rules: [], 
      labelWidth: '100px',
      width: '100%',
      required: false,
      clearable: false,
      disabled: false,
      placeholder: '',
    },
    {
      label: '选择器',
      icon: 'selector',
      type: 'select',
      default: [],
      rules: [],
      labelWidth: '100px',
      remote: false,
      required: false,
      clearable: false,
      disabled: false,
      placeholder: '',
      options: [
        // {label: 'option1', value: 'option1'},
      ]
    },
    {
      label: '日期选择器',
      icon: 'date-time',
      type: 'datePicker',
      default: '',
      rules: [],
      labelWidth: '100px',
      widgetType: 'datetime',
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      required: false,
      clearable: false,
      disabled: false,
      placeholder: '',
    },
    {
      label: '时间选择器',
      icon: 'time',
      type: 'timePicker',
      default: '',
      rules: [],
      labelWidth: '100px',
      valueFormat: 'HH:mm:ss',
      required: false,
      clearable: false,
      disabled: false,
      placeholder: '',
    },
    {
      label: '拾色器',
      icon: 'color-picker',
      type: 'colorPicker',
      default: '',
      rules: [],
      labelWidth: '100px',
      required: false,
      disabled: false,
      colorFormat: 'hex',
      showAlpha: false,
    }
  ],
  'advance': [
    {
      label: '自定义组件',
      icon: 'custom',
      type: 'custom',
      labelWidth: '100px',
    }
  ],
  'layout': [
    {
      label: '栅格', 
      icon: 'grid', 
      type: 'grid', 
      columns: [
        {colSpan: 12, list: []},
        {colSpan: 12, list: []},
      ]
    }
  ]
}