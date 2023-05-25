import { useIsClient } from "../IsClient";
import { Props, _PriceChart } from "./_PriceChart";

export function PriceChart(props: Props) {
  const isClient = useIsClient();
  if (isClient) {
    const _PriceChart = require("./_PriceChart")._PriceChart;
    return <_PriceChart {...props} />;
  }
  return <></>;
}
