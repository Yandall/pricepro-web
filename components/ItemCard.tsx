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

export default function ItemCard({
  data,
  position,
}: {
  data: Item;
  position: number;
}) {
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
          <Text>Precio: ${data.price}</Text>
          <Text>Precio por unidad:</Text>
        </div>
        <Badge size="lg" color="yellow">
          ${data.pricePerUnit}
        </Badge>
      </Flex>
    </Card>
  );
}
