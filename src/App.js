import React from "react";
import "./App.css";
import "antd/dist/antd.css";
import { Table } from "antd";
import ResizableTitle from "./components/ResizableTitle";
import { calculateTime, daysCount } from "./utils/utils";
import Search from "./components/Search";
import { initialColumns } from "./utils/initialColumns";

const App = () => {
  const [tableData, setTableData] = React.useState([]);
  const [columns, setColumns] = React.useState(initialColumns);
  const [searchValue, setSearchValue] = React.useState("");
  const filteredData = React.useMemo(() => {
    return tableData.filter((item) => {
      return item.Fullname.toLowerCase().includes(searchValue.toLowerCase());
    });
  }, [tableData, searchValue]);

  React.useEffect(() => {
    fetch("http://localhost:8080/api/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => setTableData(res));
  }, []);

  const data = filteredData.map((item) => {
    let monthTotal = 0;
    const obj = {
      key: item.id,
      user: item.Fullname,
    };

    item.Days.forEach((day) => {
      const dayDate = Number(day.Date.slice(-2));
      monthTotal += calculateTime(day).totalMinutes;
      obj[dayDate] = calculateTime(day).cellTime;
    });

    obj.monthly = `${Math.floor(monthTotal / 60)}:${monthTotal % 60}`;
    [...new Array(daysCount)].forEach((day, index) => {
      console.log(obj[index + 1]);
      if (obj[index + 1] === undefined) {
        obj[index + 1] = 0;
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
    <>
      <Search searchValue={searchValue} setSearchValue={setSearchValue} />
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
    </>
  );
};

export default App;
