import React, { useCallback } from "react";
import { Collapse } from "antd";
import { IBaseTheme, IBaseComponentProps } from "ide-lib-base-component";

import { TComponentCurrying } from "ide-lib-engine";

import { StyledContainer } from "./styles";
import { ISubProps } from "./subs";
import { Form } from "./form";
import {formDataType, onChangeType, schemaType, groupType, editorExtraParamType,themeStylesType} from "./baseType";
import { theme,styles } from "./theme/default";


const Panel = Collapse.Panel;


export {schemaType};

export interface IPropsEditorProps
  extends
    ISubProps,
    formDataType,onChangeType,themeStylesType {
  /**
   * schema 输入源
   */
  schema: schemaType;
  /**
   * 是否展现
   */
  visible?: boolean;
  editorExtraParam?: editorExtraParamType;
  /**
   * 指定使用特定的属性编辑器
   */
  useEditor?(fieldProps:any,editors:any): React.FunctionComponent<any>|React.Component<any>|null;
}

export const DEFAULT_PROPS: IPropsEditorProps = {
  schema: {
    group: [],
    properties: {}
  },
  formData: {},
  visible: true,
  theme: theme,
  styles: styles
};

export const PropsEditorCurrying: TComponentCurrying<
  IPropsEditorProps,
  ISubProps
> = subComponents => props => {
  const { visible,schema,useEditor, styles,formData,onChange,theme,editorExtraParam} = props;

  let {group,properties} = schema;

  let FormSchema: Array<Object> = [];
  
  if(group && group.length > 0){
    group.map((item:any)=>{
      const groupProperties: [] = item.properties;
      if(groupProperties && groupProperties.length){
        let newProperties:any = {};
        groupProperties.map((propName:string)=>{
          newProperties[propName] = properties[propName];
        });

        item.properties = newProperties;
        FormSchema.push(item);
      }
    })
  }else{
    FormSchema = [
      {
        "name": "base",
        "defaultOpen": true,
        "title": "属性",
        "properties": properties
      }
    ];
  }

  //设置默认开启的 panel
  let defaultActiveKey:string[] = [];
  FormSchema.map((item:groupType)=>{
    if(item.defaultOpen){
      defaultActiveKey.push(item.name);
    }
  });


  return (
    <StyledContainer
      style={styles.container}
      visible={visible}
      theme={theme}
      className="ide-props-editor-container"
    >
      <Collapse defaultActiveKey={defaultActiveKey}>
        {FormSchema.map((item:groupType)=>{
            return <Panel header={item.title} key={item.name}>
              <Form key={item.name} theme={theme} styles={styles} editorExtraParam={editorExtraParam} schema={item.properties} formData={formData}  useEditor={useEditor} onChange={onChange}  />
            </Panel>;
        })}
        
      </Collapse>
    </StyledContainer>
  );
};
