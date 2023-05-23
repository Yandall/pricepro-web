import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";

import { Line } from "react-chartjs-2";

import type { History } from "@/utils/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ActionIcon, useMantineTheme } from "@mantine/core";
import zoomPlugin from "chartjs-plugin-zoom";
import { IconReload } from "@tabler/icons-react";
import { CSSProperties, useRef } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

export type Props = {
  history: History[];
  className?: string;
  show?: { price: boolean; pricePerUnit: boolean };
  style?: CSSProperties;
};

export function _PriceChart({
  history,
  className,
  show = { price: true, pricePerUnit: true },
  style,
}: Props) {
  const theme = useMantineTheme();
  const chartRef = useRef<ChartJS<"line">>(null);

  const orderedHistory = history
    .map((h) => ({ ...h, date: new Date(h.date) }))
    .sort((h1, h2) => h1.date.valueOf() - h2.date.valueOf());
  const data: ChartData<"line", number[]> = {
    labels: orderedHistory.map((h) => format(h.date, "P", { locale: es })),
    datasets: [],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    maintainAspectRatio: false,
    borderColor: "#FF0000",
    plugins: {
      title: {
        display: true,
        text: "Precio en el tiempo",
      },
      tooltip: {
        enabled: true,
        position: "nearest",
      },
      zoom: {
        zoom: {
          drag: { enabled: true },
          mode: "x",
        },
      },
    },
    scales: {},
  };

  if (show.price) {
    data.datasets.push({
      data: orderedHistory.map((h) => h.price),
      label: "Precio",
      borderColor: theme.colors.lime[6],
      backgroundColor: theme.colors.lime[2],
      yAxisID: "y",
      cubicInterpolationMode: "monotone",
    });
    options.scales!["y"] = {
      type: "linear" as const,
      display: true,
      position: "left" as const,
      grid: {
        drawOnChartArea: false,
      },
    };
  }

  if (show.pricePerUnit) {
    data.datasets.push({
      data: orderedHistory.map((h) => h.pricePerUnit),
      label: "Precio por unidad",
      borderColor: theme.colors.teal[4],
      backgroundColor: theme.colors.teal,

      yAxisID: "y1",
      cubicInterpolationMode: "monotone",
    });
    options.scales!["y1"] = {
      type: "linear" as const,
      display: true,
      position: "right" as const,
      grid: {
        drawOnChartArea: false,
      },
    };
  }

  function resetZoom() {
    chartRef.current?.resetZoom();
  }

  return (
    <>
      <ActionIcon onClick={resetZoom}>
        <IconReload />
      </ActionIcon>
      <div>
        <Line
          style={style}
          ref={chartRef}
          data={data}
          options={options}
          className={className}
        />
      </div>
    </>
  );
}
