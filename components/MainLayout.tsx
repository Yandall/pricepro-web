import {
  ActionIcon,
  AppShell,
  Burger,
  Group,
  Header,
  MediaQuery,
  Navbar,
  Text,
  TextInput,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { IconMoonStars, IconSearch, IconSun } from "@tabler/icons-react";
import { ReactElement, useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import Link from "next/link";
import NavBar from "./NavBar/NavBar";

export default function MainLayout({ children }: { children: ReactElement }) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDarkTheme = colorScheme === "dark";
  const router = useRouter();
  const searchForm = useForm({
    initialValues: {
      query: "",
    },
  });
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  const { q: query } = router.query;
  const { setValues: setFormValues } = searchForm;

  useEffect(() => {
    // TODO: Warning al actualizar el input
    if (query) {
      setFormValues({ query: query as string });
    }
  }, [query, setFormValues]);

  function searchHandler(data: { query: string }) {
    if (data.query?.trim() !== "") {
      router.push(`/search?q=${data.query}`);
    }
  }

  return (
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
        <Header height={60} p="xs">
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
            <NavBar />
            <Group>
              <form
                style={{
                  display: "flex",
                  // flex: "1 0 auto",
                  justifyContent: "flex-end",
                }}
                onSubmit={searchForm.onSubmit(searchHandler)}
              >
                <TextInput
                  placeholder="Buscar producto"
                  // style={{ flex: "1 0 auto" }}
                  maw={300}
                  miw={100}
                  {...searchForm.getInputProps("query")}
                  icon={<IconSearch />}
                  radius="lg"
                />
              </form>

              <ActionIcon
                variant="outline"
                color={isDarkTheme ? "yellow" : "blue"}
                onClick={() => toggleColorScheme()}
                title="Toggle color scheme"
              >
                {isDarkTheme ? (
                  <IconSun size="1.1rem" />
                ) : (
                  <IconMoonStars size="1.1rem" />
                )}
              </ActionIcon>
            </Group>
          </Group>
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
  );
}

export function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
}
