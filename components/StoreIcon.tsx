import exitoIcon from "@/public/store-exito-icon.webp";
import jumboIcon from "@/public/store-jumbo-icon.webp";
import carullaIcon from "@/public/store-carulla-icon.webp";
import d1Icon from "@/public/store-d1-icon.webp"
import makroIcon from "@/public/store-makro-logo.webp"

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
    case "D1":
      icon = d1Icon
      break;
    case "Makro":
      icon = makroIcon
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
          height="auto"
          width={size ?? 20}
        />
      )}
    </Tooltip>
  );
}
