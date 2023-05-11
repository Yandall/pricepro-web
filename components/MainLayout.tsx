import {
  AppShell,
  Badge,
  Burger,
  Center,
  Grid,
  Group,
  Header,
  MediaQuery,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { ReactElement, useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import Link from "next/link";
import NavList from "./NavBar/NavList";
import NavBar from "./NavBar/NavBar";
import ColorSchemeToggle from "./ColorSchemeToggle";
import MainFooter from "./Footer";

export default function MainLayout({ children }: { children: ReactElement }) {
  const router = useRouter();
  const searchForm = useForm({
    initialValues: {
      query: "",
    },
  });
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  const { q: query } = router.query;
  const { route } = router;
  const { setValues: setFormValues } = searchForm;

  useEffect(() => {
    if (query) {
      setFormValues({ query: query as string });
    }
  }, [query, setFormValues]);

  useEffect(() => {
    setOpened(false);
  }, [setOpened, route]);

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
              --mantine-header-height: 10.75rem;
            }
          }`}
      </style>
      <AppShell
        padding="md"
        navbarOffsetBreakpoint="sm"
        styles={(theme) => {
          return {
            main: {
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
                  <Text
                    style={{
                      fontWeight: 700,
                      fontSize: "1.625rem",
                      lineHeight: "1.35",
                    }}
                    component={Link}
                    href="/"
                  >
                    PricePro{" "}
                    <Badge
                      variant="gradient"
                      gradient={{ from: "orange", to: "red", deg: 105 }}
                      style={{ verticalAlign: "middle" }}
                    >
                      Beta
                    </Badge>
                  </Text>
                </Center>
              </Grid.Col>
              <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <Grid.Col span={1}>
                  <ColorSchemeToggle />
                </Grid.Col>
              </MediaQuery>
              <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                <Grid.Col sm={6} lg={6}>
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
                <Grid.Col span={12}>
                  <Group position="center" pt="md" pb="md">
                    <NavList />
                  </Group>
                </Grid.Col>
              </MediaQuery>
            </Grid>
          </Header>
        }
        navbar={
          <NavBar
            width={{ sm: 200, lg: 300 }}
            p="md"
            hidden={!opened}
            hiddenBreakpoint="sm"
            style={{ overflow: "auto" }}
          />
        }
        footer={<MainFooter />}
      >
        {children}
      </AppShell>
    </>
  );
}

export function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
}
