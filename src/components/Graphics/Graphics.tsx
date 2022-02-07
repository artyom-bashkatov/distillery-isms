import React from "react";
import Chart from "react-google-charts";

const Graphics: React.FC = () => {
  return (
    <div>
      <Chart
        width={"1300px"}
        height={"600px"}
        chartType="LineChart"
        loader={<div>Loading Chart</div>}
        data={[
          ["x", "ConnectWise", "EMS", "KnowBe4", "Microsoft Secure Score", "Information Security Policy", "Telecommuting Security Policy", "Data encryption"],
          ["1 Июля", 98.34, 95.57, 92.84, 37.68, 0.00, 0.00, 0.00],
          ["1 Августа", 94.21, 89.33, 91.99, 74.36, 68.03, 50.54, 0.00],
          ["1 Сентября", 89.18, 87.55, 88.53, 76.33, 81.75, 81.18, 24.33],
          ["1 Октября", 92.73, 90.94, 72.00, 73.93, 85.17, 84.63, 54.97],
          ["1 Ноября", 97.77, 97.16, 87.62, 73.93, 91.23, 90.86, 72.95],
        ]}
        options={{
          hAxis: {
            title: "Даты",
          },
          vAxis: {
            title: "Проценты",
          },
          series: {
            1: { curveType: "function" },
          },
        }}
        rootProps={{ "data-testid": "2" }}
      />
    </div>
  );
};

export { Graphics };
