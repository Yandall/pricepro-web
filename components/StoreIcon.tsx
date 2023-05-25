import exitoIcon from "@/public/exito_icon.webp";
import jumboIcon from "@/public/jumbo_icon.webp";
import carullaIcon from "@/public/carulla.webp";

import { StaticImageData } from "next/image";
import { Image, Tooltip } from "@mantine/core";

type Props = {
  store: "Exito" | "Jumbo" | "Carulla" | (string & {});
  size?: number;
};

export default function StoreIcon({ store, size }: Props) {
  let icon: StaticImageData | false = false;
  switch (store) {
    case "Exito":
      icon = exitoIcon;
      break;
    case "Carulla":
      icon = carullaIcon;
      break;
    case "Jumbo":
      icon = jumboIcon;
      break;
  }
  return (
    <Tooltip
      style={{ display: "flex", gap: "0.5rem" }}
      label={store}
      events={{ focus: true, hover: true, touch: true }}
    >
      {icon && (
        <Image
          src={icon.src}
          alt={store}
          width={size ?? 20}
          height={size ?? 20}
        />
      )}
    </Tooltip>
  );
}
