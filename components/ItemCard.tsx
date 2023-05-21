import { Badge, Card, Flex, Image, Text, Tooltip } from "@mantine/core";
import type { Item, Product } from "@/utils/types";
import StoreIcon from "./StoreIcon";
import { IconInfoCircle } from "@tabler/icons-react";

export type Props = {
  data: Item;
  position: number;
  product: Product;
  orderBy: "pricePerUnit" | "price";
};

export default function ItemCard({
  data,
  product,
  position,
  orderBy = "pricePerUnit",
}: Props) {
  return (
    <Card h="100%" style={{ display: "flex", flexDirection: "column" }}>
      <Card.Section>
        <a href={data.url} target="_blank">
          <Image
            src={data.imageUrl}
            alt={data.name}
            fit="contain"
            height={150}
            withPlaceholder
          />
        </a>
      </Card.Section>
      <Flex
        direction="column"
        mt="md"
        justify="space-between"
        style={{ flex: "1 0 auto" }}
      >
        <div>
          <Text component="a" href={data.url} target="_blank">
            {position}. {data.name}
          </Text>
          <Text weight={200} size="sm">
            Marca: {data.brand.name}
          </Text>
          <Text weight={200} size="sm" component={Flex} gap="xs">
            Tienda: <StoreIcon store={data.store.name} />
          </Text>
          <Tooltip
            multiline
            label="El valor puede no ser exacto debido a que es calculado como PRECIO/PRECIO-POR-UNIDAD"
            events={{ focus: true, hover: true, touch: true }}
            zIndex={100}
          >
            <Text weight={200} size="sm" component={Flex} gap="xs">
              Cantidad: {data.quantity} {product.units}
              <IconInfoCircle size={16} style={{ alignSelf: "center" }} />
            </Text>
          </Tooltip>
          <Text>
            {orderBy === "pricePerUnit"
              ? `Precio: $${data.price}`
              : `Precio por ${product.units}: $${data.pricePerUnit}`}
          </Text>
          <Text>
            {orderBy === "pricePerUnit"
              ? `Precio por ${product.units}:`
              : "Precio:"}
          </Text>
        </div>
        <Badge size="lg" color="yellow">
          ${orderBy === "pricePerUnit" ? data.pricePerUnit : data.price}
        </Badge>
      </Flex>
    </Card>
  );
}
