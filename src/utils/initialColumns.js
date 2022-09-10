import { daysCount } from "./utils";

export const initialColumns = [...new Array(daysCount + 2)].map(
  (item, index, array) => {
    if (index === 0) {
      return {
        title: "User",
        dataIndex: "user",
        width: 600,
        fixed: "left",
      };
    }

    if (index === array.length - 1) {
      return {
        title: "Monthly",
        dataIndex: "monthly",
        width: 200,
        fixed: "right",
      };
    }
    return {
      title: index.toString(),
      dataIndex: index,
      width: 100,
      sorter: (a, b) => {
        const arr1 = a[index] === 0 ? [0, 0] : a[index].split(":");
        const arr2 = b[index] === 0 ? [0, 0] : b[index].split(":");

        return arr1[0] * 60 + arr1[1] - (arr2[0] * 60 + arr2[1]);
      },
    };
  }
);
