import React from "react";
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
} from "victory";

const VictoryBarChart = ({ barLabels, barValues }) => {
  const chartData = barLabels.map((label, index) => ({
    x: label,
    y: barValues[index],
  }));

  return (
    <VictoryChart
      theme={VictoryTheme.material}
      domainPadding={20}
      width={600}
      height={220}
    >
      <VictoryAxis style={{ tickLabels: { fontSize: 10, angle: -45 } }} />
      <VictoryAxis dependentAxis />
      <VictoryBar
        data={chartData}
        style={{
          data: { fill: "#3498db" },
        }}
      />
    </VictoryChart>
  );
};

export default VictoryBarChart;