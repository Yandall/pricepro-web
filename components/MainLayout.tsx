import {
  AppShell,
  Burger,
  Group,
  Header,
  MediaQuery,
  Navbar,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { ReactElement, useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import Link from "next/link";
import NavList from "./NavBar/NavList";
import ColorSchemeToggle from "./ColorSchemeToggle";

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
    if (data.query?.trim() !== "") {
      router.push(`/search?q=${data.query}`);
    } else router.push(`/search`);
  }

  return (
    <>
      <style>
        {`@media (max-width: 48em) {
            :root {
              --mantine-header-height: 6.75rem;
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
            }}
          >
            <Group position="apart">
              <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <Burger
                  opened={opened}
                  onClick={() => setOpened((o) => !o)}
                  size="sm"
                  color={theme.colors.gray[6]}
                  mr="xl"
                />
              </MediaQuery>
              <Text
                style={{
                  fontWeight: 700,
                  fontSize: "1.625rem",
                  lineHeight: "1.35",
                }}
                component={Link}
                href="/"
              >
                PricePro
              </Text>
              <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                <NavList />
              </MediaQuery>
              <Group
                noWrap
                position="right"
                style={{ flex: "0 1 30%", maxWidth: "15.5rem" }}
              >
                <form
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                  onSubmit={searchForm.onSubmit(searchHandler)}
                >
                  <TextInput
                    placeholder="Buscar producto"
                    maw={300}
                    miw={100}
                    {...searchForm.getInputProps("query")}
                    icon={<IconSearch />}
                    radius="lg"
                  />
                </form>
                <ColorSchemeToggle />
              </Group>
            </Group>
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Group position="center" pt="md" pb="md">
                <NavList />
              </Group>
            </MediaQuery>
          </Header>
        }
        navbar={
          <Navbar
            width={{ sm: 200, lg: 300 }}
            p="md"
            hidden={!opened}
            hiddenBreakpoint="sm"
          >
            <Title order={3}>Categorías</Title>
          </Navbar>
        }
      >
        {children}
      </AppShell>
    </>
  );
}

export function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
}
