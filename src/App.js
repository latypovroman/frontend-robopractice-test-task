import React from "react";
import "./App.css";
import "antd/dist/antd.css";
import { Table } from "antd";
import { Resizable } from "react-resizable";

const ResizableTitle = (props) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{
        enableUserSelectHack: false,
      }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

const initialColumns = [...new Array(32)].map((item, index, array) => {
  if (index === 0) {
    return {
      title: "User",
      dataIndex: "user",
      width: 200,
    };
  }

  if (index === array.length - 1) {
    return {
      title: "Monthly",
      dataIndex: "monthly",
      width: 200,
    };
  }
  return {
    title: index.toString(),
    dataIndex: index,
    width: 100,
    sorter: (a, b) => a.amount - b.amount,
  };
});

const calculateTime = ({ Start, End }) => {
  let hours = Number(End.slice(0, 2)) - Number(Start.slice(0, 2));
  let minutes = Number(End.slice(-2)) - Number(Start.slice(-2));
  if (minutes < 0) {
    minutes = minutes > -51 ? minutes + 60 : `0${minutes + 60}`;
    hours -= 1;
  } else if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
};

const App = () => {
  const [state, setState] = React.useState([]);
  const [columns, setColumns] = React.useState(initialColumns);
  React.useEffect(() => {
    fetch("http://localhost:8080/api/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setState(res);
      });
  }, []);

  const data = state.map((item) => {
    console.log(item);
    const obj = {
      key: item.id,
      user: item.Fullname,
    };
    let cellNumber = 1;
    item.Days.forEach((day, index) => {
      const isActiveDay = Number(day.Date.slice(-2)) === cellNumber;
      console.log(Number(day.Date.slice(-2)), cellNumber);

      if (isActiveDay) {
        obj[cellNumber] = calculateTime(day);
        cellNumber += 1;
      } else {
        obj[cellNumber] = 0;
        obj[cellNumber + 1] = calculateTime(day);
        cellNumber += 2;
      }
    });

    return obj;
  });

  const handleResize =
    (index) =>
    (_, { size }) => {
      const newColumns = [...columns];
      newColumns[index] = { ...newColumns[index], width: size.width };
      setColumns(newColumns);
    };

  const mergeColumns = columns.map((col, index) => ({
    ...col,
    onHeaderCell: (column) => ({
      width: column.width,
      onResize: handleResize(index),
    }),
  }));
  return (
    <Table
      bordered
      components={{
        header: {
          cell: ResizableTitle,
        },
      }}
      columns={mergeColumns}
      dataSource={data}
    />
  );
};

export default App;
