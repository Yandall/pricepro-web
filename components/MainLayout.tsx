import {
  AppShell,
  Badge,
  Burger,
  Center,
  Grid,
  Group,
  Header,
  Image,
  MediaQuery,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { ReactElement, memo, useState } from "react";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import Link from "next/link";
import NavList from "./NavBar/NavList";
import NavBar from "./NavBar/NavBar";
import ColorSchemeToggle from "./ColorSchemeToggle";
import MainFooter from "./Footer";
import priceproTitle from "@/public/pricepro_title.webp";

export const MainLayout = memo(function MainLayout({
  children,
}: {
  children: ReactElement;
}) {
  const router = useRouter();
  const searchForm = useForm({
    initialValues: {
      query: "",
    },
  });

  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  function searchHandler(data: { query: string }) {
    let path = `/search`;
    if (data.query?.trim() !== "") path += `?q=${data.query}`;
    if (router.query.subcategory) {
      if (path.includes("?")) path += "&";
      else path += "?";
      path += `subcategory=${router.query.subcategory}`;
    }
    router.push(path);
  }

  return (
    <>
      <style>
        {`@media (max-width: 48em) {
            :root {
              --mantine-header-height: 9.75rem;
            }
          }`}
      </style>
      <AppShell
        padding="md"
        styles={(theme) => {
          return {
            main: {
              display: opened ? "none" : undefined,
              paddingLeft: "1rem",
              paddingTop: "1rem",
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[8]
                  : theme.colors.gray[0],
            },
          };
        }}
        header={
          <Header
            height={60}
            p="xs"
            style={{
              height: "var(--mantine-header-height)",
              maxHeight: "var(--mantine-header-height)",
              position: "sticky",
              zIndex: 101,
              backgroundColor:
                theme.colorScheme === "light"
                  ? "var(--mantine-color-lime-4)"
                  : "",
            }}
          >
            <Grid gutter="xs">
              <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <Grid.Col span={1}>
                  <Burger
                    opened={opened}
                    onClick={() => setOpened((o) => !o)}
                    size="sm"
                    color={theme.colors.gray[6]}
                    mr="xl"
                  />
                </Grid.Col>
              </MediaQuery>
              <Grid.Col span={10} sm={3} lg={2}>
                <Center>
                  <Link
                    href="/"
                    style={{
                      display: "inherit",
                      alignItems: "center",
                      textDecoration: "none",
                    }}
                  >
                    <Image
                      src={priceproTitle.src}
                      alt="Pricepro logo"
                      height="36px"
                      width="auto"
                    />
                    <Badge
                      variant="gradient"
                      gradient={{ from: "orange", to: "red", deg: 105 }}
                      style={{ verticalAlign: "middle" }}
                    >
                      Beta
                    </Badge>
                  </Link>
                </Center>
              </Grid.Col>
              <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <Grid.Col span={1}>
                  <ColorSchemeToggle />
                </Grid.Col>
              </MediaQuery>
              <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                <Grid.Col sm={6} lg={6} style={{ alignSelf: "center" }}>
                  <Center>
                    <NavList colorScheme={theme.colorScheme} />
                  </Center>
                </Grid.Col>
              </MediaQuery>
              <Grid.Col span={12} sm={3} lg={4}>
                <Group noWrap>
                  <form
                    style={{
                      flex: "1 1 auto",
                    }}
                    onSubmit={searchForm.onSubmit(searchHandler)}
                  >
                    <TextInput
                      placeholder="Buscar producto"
                      {...searchForm.getInputProps("query")}
                      type="text"
                      icon={<IconSearch />}
                      radius="lg"
                    />
                  </form>
                  <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                    <ColorSchemeToggle />
                  </MediaQuery>
                </Group>
              </Grid.Col>
              <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <Grid.Col span={12} style={{ alignSelf: "center" }}>
                  <Group position="center" pt="md" pb="md">
                    <NavList colorScheme={theme.colorScheme} />
                  </Group>
                </Grid.Col>
              </MediaQuery>
            </Grid>
          </Header>
        }
        navbar={
          <NavBar
            p="md"
            hidden={!opened}
            setHidden={setOpened}
            hiddenBreakpoint="sm"
          />
        }
        footer={<MainFooter />}
      >
        {children}
      </AppShell>
    </>
  );
});

export function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
}
