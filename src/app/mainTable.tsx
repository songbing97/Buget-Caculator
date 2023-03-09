"use client";

import React, { useEffect, useState } from 'react';
import { Button, InputNumber, Popconfirm as Reconfirm, Space, Table } from 'antd';
import styles from './main-table.module.css';
import EditableCell from './EditableCell';
import EditableRow from './EditableRow';
import { watch } from 'fs';

type EditableTableProps = Parameters<typeof Table>[0];

export interface Item {
  key: React.Key;
  no: number;
  cost: number;
  item: string;
  unit: number;
  multiple: number;
  remarks: string;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const App: React.FC = () => {
  const [dataSource, setDataSource] = useState<Item[]>(() => {
    const hash = window.location.hash.slice(1);
    console.log(decodeURIComponent(hash))
    if (hash) {
      return JSON.parse(decodeURIComponent(hash)) || []
    }
    return []
  });
  const [count, setCount] = useState<number>(() => {
    console.log(dataSource)
    let i = 0;
    dataSource.forEach(item => {
      i = Math.max(i, Number(item.key))
    })
    return i;
  });

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string, type?: string })[] = [
    {
      title: 'No.',
      dataIndex: 'no',
    },
    {
      title: 'item',
      dataIndex: 'item',
      width: '30%',
      editable: true,
    },
    {
      title: 'cost',
      dataIndex: 'cost',
    },
    {
      title: 'unit price',
      dataIndex: 'unit',
      editable: true,
      type: 'number'
    },
    {
      title: 'multiple',
      dataIndex: 'multiple',
      editable: true,
      type: 'number'
    },
    {
      title: 'remarks',
      dataIndex: 'remarks',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (value, record) =>
        dataSource.length >= 1 ? (
          <Reconfirm title="Sure to delete?" onConfirm={() => handleDelete((record as object & {key: React.Key}).key)}>
            <a>Delete</a>
          </Reconfirm>
        ) : null,
    },
  ];

  const handleAdd = () => {
    const newData: Item = {
      key: count + 1,
      no: dataSource.length + 1,
      item: '用于XXX',
      cost: 100,
      unit: 100,
      multiple: 1,
      remarks: '备注',
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1)
  };

  const [budget, setBudget] = useState(() => 10000);

  const [summary, setSummary] = useState(0);

  const [balance, setBalance] = useState(10000);

  const updateUrl = () => {
    window.location.hash = encodeURIComponent(JSON.stringify(dataSource));
  }

  useEffect(() => {
    setBalance(budget - summary);
    let count = 0;
    for(const element of dataSource) {
      count += element.cost;
    }
    setSummary(count);
    updateUrl()
  })
  const handleSave = (row: Item) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    row.cost = row.unit * row.multiple;
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const changeBudget = (val: number | null) => {
    if (typeof val === 'number') {
      setBudget(val)
    }
  }

  return (
    <div style={{width: '100%'}}>
      <div className={styles.header}>
        <div className={styles.budget}>
          <Space>
            <label>Budget</label>
            <InputNumber value={budget} onChange={changeBudget} />,
            <label>Summary Cost ${summary},</label>
            <label>You still have ${balance}.</label>
          </Space>
        </div>
        <Button onClick={handleAdd} type="primary">
          Add a item of cost
        </Button>
      </div>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
        pagination={false}
      />
    </div>
  );
};

export default App;