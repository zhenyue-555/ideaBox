import "./styles.css";
import React from "react";
import "antd/dist/antd.css";
import { Table, Button, Popconfirm, Form, Input } from "antd";
import { useState, useRef, useContext, useEffect } from "react";

import { StarFilled } from "@ant-design/icons";
import Addcomment from "./Addcomment";
const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex]
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`
          }
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

export default function App() {
  const [count, setCount] = useState(3);
  const [dataSource, setDataSource] = useState([
    {
      key: "1",
      idea: "idea0",
      Proposer: "IT Developer",
      Description: "application1 is designed for ios user",
      score: 2
    },
    {
      key: "2",
      idea: "idea1",
      Proposer: "mentor",
      Description: "application2 is user-friendly",
      score: 3
    },
    {
      key: "3",
      idea: "idea2",
      Proposer: "manager",
      Description: "application3 is being tested",
      score: 4
    }
  ]);

  const columns = [
    {
      title: "idea",
      dataIndex: "idea",
      key: "idea",
      editable: true,
      render: (text) => <a>{text}</a>
    },
    {
      title: "Proposer",
      dataIndex: "Proposer",
      key: "Proposer",
      editable: true
    },
    {
      title: "Description",
      dataIndex: "Description",
      key: "Description",
      editable: true
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
      render: (score) => {
        return (
          <>
            <Button
              type="text"
              icon={
                <StarFilled
                  style={{ color: score >= 1 ? "yellow" : "black" }}
                />
              }
            />
            <Button
              type="text"
              icon={
                <StarFilled
                  style={{ color: score >= 2 ? "yellow" : "black" }}
                />
              }
            />
            <Button
              type="text"
              icon={
                <StarFilled
                  style={{ color: score >= 3 ? "yellow" : "black" }}
                />
              }
            />
            <Button
              type="text"
              icon={
                <StarFilled
                  style={{ color: score >= 4 ? "yellow" : "black" }}
                />
              }
            />
            <Button
              type="text"
              icon={
                <StarFilled
                  style={{ color: score >= 5 ? "yellow" : "black" }}
                />
              }
            />
          </>
        );
      },
      sorter: {
        compare: (a, b) => a.score - b.score,
        multiple: 3
      },
      editable: true
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.key)}
          >
            <a>Delete</a>
          </Popconfirm>
        ) : null
    }
  ];
  const editablecolumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave
      })
    };
  });
  const expandedRowRender = () => <Addcomment />;

  const handleDelete = (key) => {
    setDataSource(dataSource.filter((item) => item.key !== key));
  };

  const handleAdd = () => {
    const newData = {
      key: count,
      idea: "WRITE IDEA HERE",
      Proposer: "WRITE PROPOSER HERE",
      Description: "WRITE DESCRIPTION HERE",
      score: ""
    };
    setCount(count + 1);
    setDataSource([...dataSource, newData]);
  };
  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell
    }
  };
  return (
    <div className="App">
      <Button
        onClick={handleAdd}
        type="primary"
        style={{
          marginBottom: 16
        }}
      >
        Add a row
      </Button>
      <Table
        components={components}
        columns={editablecolumns}
        bordered
        dataSource={dataSource}
        expandable={{ expandedRowRender }}
      />
    </div>
  );
}
