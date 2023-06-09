import { Badge, Card, Container, Flex, Image, Text } from "@mantine/core";
import Link from "next/link";
import PlaceholderImg from "./PlaceHolderImg";
import type { Item, Product } from "@/utils/types";
import StoreIcon from "./StoreIcon";

export default function ProductCard({
  data,
  cheapest,
}: {
  data: Product;
  cheapest?: Item;
}) {
  return (
    <Card
      radius="lg"
      h="100%"
      shadow="md"
      withBorder
      mah={380}
      mih="20rem"
      style={{ display: "flex", flexDirection: "column" }}
      component="article"
    >
      <Card.Section style={{ flex: "1 1 60%" }} pos="relative">
        <Link
          href={`/product/${data.id}-${data.name
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replaceAll(" ", "-")}`}
        >
          <Image
            src={data.imgUrl !== "" ? data.imgUrl : undefined}
            alt={data.name}
            withPlaceholder
            fit="cover"
            placeholder={<PlaceholderImg />}
            height="100%"
            styles={{
              image: { position: "absolute" },
              imageWrapper: { position: "inherit" },
              placeholder: {
                position: "absolute",
                width: "100%",
                height: "100%",
              },
            }}
          />
        </Link>
      </Card.Section>
      <Container m={0} mt="xs" px={0} style={{ flex: "1 1 40%" }}>
        <Link
          href={`/product/${data.id}-${data.name
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replaceAll(" ", "-")}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Text weight={700} component="h3">
            {data.name}
          </Text>
          <Text weight={200}>
            Unidades:{" "}
            <Text weight={400} span>
              {data.units}
            </Text>
          </Text>

          {cheapest && (
            <Text weight={200} component={Flex} gap="xs">
              Mejor precio:
              <StoreIcon store={cheapest.store.name} />
            </Text>
          )}
        </Link>
      </Container>
      <Badge
        color="teal"
        component={Link}
        fullWidth
        href={`/search?subcategory=${data.subcategory.id}`}
        style={{ cursor: "pointer" }}
      >
        {data.subcategory.name}
      </Badge>
    </Card>
  );
}
