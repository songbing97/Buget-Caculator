import { Form, FormInstance } from "antd";
import React from "react";

export const EditableContext = React.createContext<FormInstance<any> | null>(null);

const EditableRow:React.FC = (props) => {
  const [form] = Form.useForm();

  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props}></tr>
      </EditableContext.Provider>
    </Form>
  )
}

export default EditableRow;