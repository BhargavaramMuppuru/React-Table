import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import "./index.css";
import { Form, Input, InputNumber, Popconfirm, Table, Typography } from "antd";
const originData = [];
// for (let i = 0; i < 100; i++) {
//   originData.push({
//     key: i.toString(),
//     name: `Edrward ${i}`,
//     age: 32,
//     address: `London Park no. ${i}`
//   });
// }

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`
            }
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
const App = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      age: "",
      address: "",
      ...record
    });
    setEditingKey(record.key);
  };
  console.log("datanew");
  console.log(data);
  const cancel = () => {
    setEditingKey("");
  };
  console.log(data);
  const fetchData = () => {
    let originData = [];
    fetch(`https://gl2uk8-3004.sse.codesandbox.io/data/`)
      .then((res) => res.json())
      .then((results) => {
        console.log(results);
        results.map((data, index) => {
          originData.push({
            key: data?.id,
            name: data?.title,
            age: data?.url,
            address: data?.thumbnailUrl
          });
        });
        console.log(results);

        setData(originData);
        console.log(originData);
      });
  };
  useEffect(() => {
    // Update the document title using the browser API
    if (data.length === 0) {
      fetchData();
    }

    console.log(originData);
  });

  const saveDataToDb = async (key, row) => {
    var newData = [...data];
    var index = newData.findIndex((item) => key === item.key);
    var item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row
    });
    setData(newData);
    setEditingKey("");
    return await axios.put(
      `https://gl2uk8-3004.sse.codesandbox.io/data/${key}`,
      {
        id: key,
        title: row?.name,
        url: row?.age,
        thumbnailUrl: row?.address
      }
    );
  };
  const fetchDataWithKey = async (key) => {
    return await axios.get(
      `https://gl2uk8-3004.sse.codesandbox.io/data/${key}`
    );
  };

  const saveUpdateData = async (key) => {
    try {
      return await axios.post(`https://gl2uk8-3005.sse.codesandbox.io/data`, {
        id: key
      });
    } catch (err) {
      console.log(err);
      return;
    }
  };
  const fetchUpdates = async () => {
    return await axios.get(`https://gl2uk8-3005.sse.codesandbox.io/data`);
  };
  const save = async (key) => {
    // try {
    const row = await form.validateFields();
    var newData = [...data];
    var index = newData.findIndex((item) => key === item.key);
    var item = newData[index];
    // newData.splice(index, 1, {
    //   ...item,
    //   ...row
    // });
    // setData(newData);
    // setEditingKey("");
    await saveDataToDb(key, row);
    await saveUpdateData(key);
    var ids = await fetchUpdates();
    ids = ids.data;
    console.log("ids");
    console.log(ids);
    for (var obj of ids) {
      index = newData.findIndex((item) => item.key === obj.id);
      item = newData[index];
      var updatedData = await fetchDataWithKey(obj.id);
      console.log("up data");
      console.log(updatedData);
      updatedData = updatedData.data;
      var newchange = {};
      newchange["key"] = item["key"];
      newchange["id"] = updatedData["id"];
      newchange["name"] = updatedData["title"];
      newchange["age"] = updatedData["url"];
      newchange["address"] = updatedData["thumbnailUrl"];

      newData.splice(index, 1, newchange);
    }
    console.log("new data update");
    setData(newData);

    // if (index > -1) {
    //   var item = newData[index];
    //   console.log("item " + JSON.stringify(item), JSON.stringify(row));
    //   fetch(`https://gl2uk8-3004.sse.codesandbox.io/data/${key}`, {
    //     method: "PUT",
    //     body: JSON.stringify({
    //       id: key,
    //       title: row?.name,
    //       url: row?.age,
    //       thumbnailUrl: row?.address
    //     }),
    //     headers: {
    //       "Content-type": "application/json; charset=UTF-8"
    //     }
    //   })
    //     .then((response) => response.json())
    //     .then((json) => {
    //       console.log(key);
    //       fetch(`https://gl2uk8-3005.sse.codesandbox.io/data`, {
    //         method: "POST",
    //         body: JSON.stringify({
    //           id: key
    //         }),
    //         headers: {
    //           "Content-type": "application/json; charset=UTF-8"
    //         }
    //       });

    //       console.log(json);

    //       fetch(`https://gl2uk8-3005.sse.codesandbox.io/data`, {
    //         method: "GET",
    //         headers: {
    //           "Content-type": "application/json; charset=UTF-8"
    //         }
    //       })
    //         .then((response) => response.json())
    //         .then((ids) => {
    //           console.log(ids);
    //           // for (var obj of json) {
    //           ids.map((obj, index) => {
    //             console.log("obj ", obj);
    //             newData = data;
    //             fetch(
    //               `https://gl2uk8-3004.sse.codesandbox.io/data/${obj.id}`,
    //               {
    //                 method: "GET",
    //                 headers: {
    //                   "Content-type": "application/json; charset=UTF-8"
    //                 }
    //               }
    //             )
    //               .then((response) => response.json())
    //               .then((json) => {
    //                 console.log(json, obj.id);

    //                 index = newData.findIndex((item) => item.key === obj.id);
    //                 item = newData[index];
    //                 console.log(index);
    //                 newData.splice(index, 1, json);
    //                 console.log(newData[index]);
    //                 console.log("setdata");
    //                 setData(newData);
    //               })

    //           });
    //         });
    //       console.log("new");
    //       console.log(newData[0]);

    //       setEditingKey("");
    //     });

    // fetchData();
    //   } else {
    //     newData.push(row);
    //     setData(newData);
    //     setEditingKey("");
    //   }
    // } catch (errInfo) {
    //   console.log("Validate Failed:", errInfo);
    // }
  };
  const columns = [
    {
      title: "name",
      dataIndex: "name",
      width: "25%",
      editable: true
    },
    {
      title: "Url",
      dataIndex: "age",
      width: "15%",
      editable: true
    },
    {
      title: "address",
      dataIndex: "address",
      width: "40%",
      editable: true
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => {
                console.log(record);
                save(record.key);
                console.log(record);

                // fetchData();
              }}
              style={{
                marginRight: 8
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      }
    }
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    };
  });
  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell
          }
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel
        }}
      />
    </Form>
  );
};
export default App;
