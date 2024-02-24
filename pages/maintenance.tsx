import { Flex, Text } from "@mantine/core";
import { Poppins } from "next/font/google";
import {
  IconAlertTriangleFilled,
  IconBrandInstagram,
  IconBrandTwitter,
} from "@tabler/icons-react";
import Link from "next/link";

const poppinsTitle = Poppins({ subsets: ["latin"], weight: "600" });

export default function Page() {
  return (
    <Flex
      justify="center"
      align="center"
      style={{ height: "100vh", paddingInline: "16px" }}
      direction="column"
      gap="xl"
    >
      <IconAlertTriangleFilled
        style={{
          color: "#2f7560",
          strokeWidth: "2px",
          width: "4rem",
          height: "4rem",
        }}
      />
      <Text
        fz={35}
        fw={700}
        component="h1"
        color="#2f7560"
        className={poppinsTitle.className}
        maw={600}
        align="center"
      >
        Pricepro está en mantenimiento. Estamos mejorando
      </Text>
      <Text align="center">
        Revisa nuestras redes sociales para ver todas las noticias sobre
        Pricepro
      </Text>
      <Text
        style={{ textDecoration: "underline" }}
        color="teal"
        component={Link}
        href="/"
      >
        Volver al inicio
      </Text>

      <Flex gap="lg">
        <a href="https://twitter.com/priceproapp" aria-label="Twitter link">
          <IconBrandTwitter size="32px" />
        </a>
        <a
          href="https://www.instagram.com/priceproapp/"
          aria-label="Instagram link"
        >
          <IconBrandInstagram size="32px" />
        </a>
      </Flex>
    </Flex>
  );
}
