import React, { useState, useCallback,useReducer } from 'react';
import { render } from 'react-dom';
import {Row,Col,Button,Input} from 'antd';
const { TextArea } = Input;
import { PropsEditor, PropsEditorFactory, IPropsEditorProps,schemaType } from '../src/';
import {onChangeParamType} from "../src/PropsEditor/baseType";
const { ComponentWithStore: PropsEditorWithStore, client } = PropsEditorFactory();

//函数编辑面板
import { FunctionSets, FunctionSetsFactory, IFunctionSetsProps } from 'ide-function-sets';

const {
  ComponentWithStore: FunctionSetsWithStore,
  client: clientFnSets
} = FunctionSetsFactory();


const schema:schemaType = {
  "group": [
    {
      "name": "base",
      "defaultOpen": true,
      "title": "基础属性",
      "properties": ["key","children","size","loading","shap","width"]
    },
    {
      "name": "event",
      "defaultOpen": true,
      "title": "事件",
      "properties": ["onChange"]
    }
  ],
  "properties": {
      "key":{
        "type": "id",
        "title": "唯一 id",
        "prefix": "$Button_"
      },
      "children":{
        "type": "string",
        "title": "文案"
      },
      "size": {
        "type": "enum",
        "title": "大小",
        "enum": ["small","medium","large"]
      },
      "shap": {
        "type": "enum",
        "title": "形状",
        "enum": ["small","large"]
      },
      "loading": {
        "type": "boolean",
        "title": "载入状态"
      },
      "width": {
        "type": "number",
        "title": "宽度"
      },
      "onChange":{
        "type": "function",
        "title": "值改变后"
      }
  }
};

const formData = {
  "children": "按钮测试",
  "loading": true,
  "size": "$store.$Button_999.children",
  "key": "$Button_999",
  //用于 id 是否唯一的判断
  "keys": ["$Button_123"],
};

//mbox 的 store ，用于变量输入框的自动提示
const $store = {
  $Button_999: {
    "children": "按钮测试",
    "loading": true,
    "size": "medium",
    "key": "$Button_999"
  },
  "a": {
    "loading": false
  }
};

/**
 * 根据属性自定义使用的编辑器
 * @param propSchema
 * @param editors
 * @returns {any}
 */
function useEditor(propSchema:any,editors:any):any{
  const {type} = propSchema;
  let Editor;
  return null;
}

const props: IPropsEditorProps = {
  visible: true,
  schema: schema,
  formData : formData,
  $store: $store,
  useEditor: useEditor,
  editorExtraParam: {
    key: 'key',
    $store: $store,
    clientFnSets: clientFnSets,
    fnNameRule : '__$comId_$fnName'
  }
};

// 当函数有更改的时候
function onFnListChange(type, fnItem, fnLists, actionContext) {
  console.log(`list change, type: ${type}, fnItem: %o`, fnItem);

  const { context } = actionContext;

  // 没有报错，才会自动关闭弹层
  return !context.hasError;
}

function reducer(state,action) {
  return Object.assign({},action.formData);
}

const Demo:React.FunctionComponent<IPropsEditorProps> = (props)=>{
  const [state, dispatch] = useReducer(reducer, formData);
  const handleChange = useCallback((ev:onChangeParamType)=>{
    dispatch({type:'change',formData: ev.formData});
  }, []);
  return (<div><Row>
    <Col span={12}>
      <div style={{marginRight: 10}}>
        <p>属性值</p>
        <TextArea row={6} value={JSON.stringify(state)} />
        <p style={{marginTop: 10}}>
          <Button size="small">渲染属性编辑器</Button>
        </p>
      </div>
    </Col>
    <Col span={12}>
      <PropsEditor {...props} onChange={handleChange} />
    </Col>
  </Row>
  <FunctionSetsWithStore onFnListChange={onFnListChange}/>
  </div>);
};

render(
  <Demo {...props} />,
  document.getElementById('example') as HTMLElement
);
