import { Badge, Card, Flex, Image, Text } from "@mantine/core";
import { Product } from "./ProductCard";

export type Item = {
  id: number;
  name: string;
  url: string;
  imageUrl: string;
  price: number;
  pricePerUnit: number;
  quantity: number;
  product: Product;
  brand: { name: string };
  store: { name: string };
};

export type Props = {
  data: Item;
  position: number;
  orderBy: "pricePerUnit" | "price";
};

export default function ItemCard({
  data,
  position,
  orderBy = "pricePerUnit",
}: Props) {
  return (
    <Card h="100%" style={{ display: "flex", flexDirection: "column" }}>
      <Card.Section>
        <a href={data.url}>
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
          <Text component="a" href={data.url}>
            {position}. {data.name}
          </Text>
          <Text weight={200} size="sm">
            Marca: {data.brand.name}
          </Text>
          <Text weight={200} size="sm">
            Tienda: {data.store.name}
          </Text>
          <Text weight={200} size="sm">
            Cantidad: {data.quantity} {data.product.units}
          </Text>
          <Text>
            {orderBy === "pricePerUnit"
              ? `Precio: $${data.price}`
              : `Precio por ${data.product.units}: $${data.pricePerUnit}`}
          </Text>
          <Text>
            {orderBy === "pricePerUnit"
              ? `Precio por ${data.product.units}:`
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
