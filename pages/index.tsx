import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { Poppins } from "next/font/google";
import heroImgSvg from "@/public/heroImg.svg";
import heroImgPng from "@/public/heroImg.png";
import priceproLaptopLight from "@/public/pricepro_laptop_light.png";
import priceproLaptopDark from "@/public/pricepro_laptop_dark.png";
import Link from "next/link";
import {
  Accordion,
  Button,
  Center,
  ColorScheme,
  Flex,
  Grid,
  Group,
  List,
  MediaQuery,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import ColorSchemeToggle from "@/components/ColorSchemeToggle";
import Image from "next/image";
import NavList from "@/components/NavBar/NavList";
import {
  IconAlertCircle,
  IconChartLine,
  IconPigMoney,
  IconSearch,
  IconTextPlus,
} from "@tabler/icons-react";
import MainFooter from "@/components/Footer";
import { useLocalStorage, useScrollIntoView } from "@mantine/hooks";
import { useRouter } from "next/router";
import { useEffect } from "react";
import priceproTitle from "@/public/pricepro_title.webp";

const poppins = Poppins({ subsets: ["latin"], weight: "300" });
const poppinsTitle = Poppins({ subsets: ["latin"], weight: "600" });

export default function Home() {
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLElement>();
  const { asPath } = useRouter();
  const [colorScheme] = useLocalStorage<ColorScheme>({
    key: "color-scheme",
    defaultValue: "light",
  });
  const promotionImgSrc =
    colorScheme === "light" ? priceproLaptopLight : priceproLaptopDark;
  useEffect(() => {
    if (asPath.includes("#about")) scrollIntoView();
  }, [asPath, scrollIntoView]);
  return (
    <>
      <Head>
        <title>PricePro | Encuentra el precio más bajo</title>
        <link rel="canonical" href="https://pricepro.com.co/" />

        <meta
          property="og:image"
          content={`https://pricepro.com.co${heroImgPng.src}`}
        />
      </Head>
      <main className={styles.main}>
        <Flex justify="flex-end" p="1rem">
          <NavList style={{ color: "black" }} />
          <ColorSchemeToggle variant="outline" color="dark" />
        </Flex>
        <Grid justify="center" align="center">
          <Grid.Col span={12} md={6} className={styles.heroInfo}>
            <div style={{ minWidth: 300, maxWidth: 500, margin: "auto" }}>
              <Image src={priceproTitle} alt="PricePro" />
              <Text
                fz={35}
                fw={700}
                component="h1"
                color="#2f7560"
                className={poppinsTitle.className}
              >
                El mejor comparador de precios de Colombia
              </Text>
              <Button
                uppercase
                variant="filled"
                color="teal"
                radius="xl"
                component={Link}
                href="/search"
              >
                Ver Productos
              </Button>
            </div>
          </Grid.Col>
          <MediaQuery smallerThan="md" styles={{ display: "none" }}>
            <Grid.Col span={12} md={6} className={styles.heroImg}>
              <Image src={heroImgSvg} alt="PricePro Savings"></Image>
            </Grid.Col>
          </MediaQuery>
        </Grid>
      </main>
      <section ref={targetRef} style={{ overflow: "hidden" }}>
        <Stack className={styles.aboutSectionContainer}>
          <Grid className={styles.promotionSectionContainer}>
            <MediaQuery largerThan="md" styles={{ display: "none" }}>
              <Grid.Col span={12} md={5}>
                <Center>
                  <Image
                    src={promotionImgSrc}
                    alt="PricePro laptop light"
                    className={styles.promotionImg}
                    width={640}
                    height={640}
                  ></Image>
                </Center>
              </Grid.Col>
            </MediaQuery>
            <Grid.Col span={12} md={7}>
              <Group align="baseline" noWrap>
                <IconSearch className={styles.promotionSectionIcons} />
                <Text
                  component="h2"
                  className={`${styles.promotionSectionHeadings} ${poppins.className}`}
                >
                  No te esfuerces de más
                </Text>
              </Group>
              <Text
                className={`${styles.promotionSectionDescription} ${poppins.className}`}
              >
                PricePro se encarga del trabajo pesado al momento de buscar un
                producto en múltiples tiendas.
              </Text>
              <Group align="baseline" noWrap>
                <IconPigMoney className={styles.promotionSectionIcons} />
                <Text
                  component="h2"
                  className={`${styles.promotionSectionHeadings} ${poppins.className}`}
                >
                  Ahorra
                </Text>
              </Group>
              <Text
                className={`${styles.promotionSectionDescription} ${poppins.className}`}
              >
                Es fácil ahorrar cuando tienes toda la información bien
                presentada
              </Text>
              <Group align="baseline" noWrap>
                <IconChartLine className={styles.promotionSectionIcons} />
                <Text
                  component="h2"
                  className={`${styles.promotionSectionHeadings} ${poppins.className}`}
                >
                  Analiza
                </Text>
              </Group>
              <Text
                className={`${styles.promotionSectionDescription} ${poppins.className}`}
              >
                PricePro te presenta un historial de los precios más bajos y
                también uno para cada producto. Asi podrás verificar con tus
                propios ojos los verdaderos descuentos.
              </Text>
              <Group align="baseline" noWrap>
                <IconTextPlus className={styles.promotionSectionIcons} />
                <Text
                  component="h2"
                  className={`${styles.promotionSectionHeadings} ${poppins.className}`}
                >
                  ¿No encontraste lo que buscabas?
                </Text>
              </Group>
              <Text
                className={`${styles.promotionSectionDescription} ${poppins.className}`}
              >
                ¡No te preocupes! Añadir un producto a PricePro es muy sencillo.
                Solo sigue los pasos al llenar el{" "}
                <Text
                  span
                  color="teal"
                  style={{ textDecoration: "underline" }}
                  component={Link}
                  href="/suggest"
                >
                  formulario
                </Text>{" "}
                y tu sugerencia hará parte de nuestra base de datos
              </Text>
              <Group align="baseline" noWrap>
                <IconAlertCircle className={styles.promotionSectionIcons} />
                <Text
                  component="h2"
                  className={`${styles.promotionSectionHeadings} ${poppins.className}`}
                >
                  En desarrollo
                </Text>
              </Group>
              <Text
                className={`${styles.promotionSectionDescription} ${poppins.className}`}
              >
                PricePro es un proyecto en desarollo, lo que significa que se
                piensa añadir más funcionalidades en el futuro y corregir
                posibles errores que puedas encontrar. Puedes reportar cualquier
                inconveniente en{" "}
                <Text
                  span
                  color="teal"
                  style={{ textDecoration: "underline" }}
                  component="a"
                  href="https://twitter.com/priceproapp"
                >
                  Twitter
                </Text>
              </Text>
            </Grid.Col>
            <MediaQuery smallerThan="md" styles={{ display: "none" }}>
              <Grid.Col span={12} md={5} style={{ alignSelf: "center" }}>
                <Image
                  src={promotionImgSrc}
                  alt="PricePro laptop light"
                  className={styles.promotionImg}
                  width={640}
                  height={640}
                ></Image>
              </Grid.Col>
            </MediaQuery>
          </Grid>
          <Accordion
            variant="filled"
            radius="md"
            className={styles.infoSectionContainer}
            chevronPosition="left"
          >
            <Accordion.Item value="howItWorks">
              <Accordion.Control>
                <Title order={3}>¿Cómo funciona?</Title>
              </Accordion.Control>
              <Accordion.Panel>
                PricePro a partir del nombre de un producto realiza búsquedas en
                las diferentes tiendas, procesamos esta información y la
                almacenamos para luego presentarla
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="limitations">
              <Accordion.Control>
                <Title order={3}>Limitaciones</Title>
              </Accordion.Control>
              <Accordion.Panel>
                <List>
                  <List.Item>
                    Por temas de economía y rendimiento la información de los
                    productos se actualiza cada 3 días. Este valor no es fijo y
                    podría cambiar en el futuro
                  </List.Item>
                  <List.Item>
                    La información puede estar mal. PricePro confía en que la
                    información entregada por las tiendas es correcta, pero esto
                    no siempre es cierto, por lo que te puedes encontrar con
                    productos donde no deberían estar o incluso con valores
                    irreales. Hay medidas para mitigar esto, sin embargo no es
                    perfecto
                  </List.Item>
                </List>
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="developer">
              <Accordion.Control>
                <Title order={3}>¿Quién desarrolla PricePro?</Title>
              </Accordion.Control>
              <Accordion.Panel>
                PricePro lo desarrolla una sola persona en sus tiempos libres.
                El proyecto empezó como hobbie pero fue cogiendo suficiente
                potencial como para querer compartirlo. Puedes encontrar el
                código de la interfaz en{" "}
                <Text
                  span
                  color="teal"
                  style={{ textDecoration: "underline" }}
                  component="a"
                  href="https://github.com/Yandall/pricepro-web"
                >
                  github
                </Text>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Stack>
      </section>
      <MainFooter>
        Imágenes por Freepik
        <Text
          color="blue"
          fz={12}
          pl={4}
          style={{ verticalAlign: "super", textDecoration: "underline" }}
          component="a"
          href="https://www.freepik.com/free-vector/cashback-concept-illustration-style_7362463.htm#query=money%20phone&position=12&from_view=search&track=robertav1_2_sidr"
        >
          1
        </Text>
        <Text
          color="blue"
          fz={12}
          pl={4}
          style={{ verticalAlign: "super", textDecoration: "underline" }}
          component="a"
          href="https://www.freepik.com/free-vector/laptop_3232492.htm#query=laptop&position=9&from_view=search&track=robertav1_2_sidr"
        >
          2
        </Text>
      </MainFooter>
    </>
  );
}
