import { Text, Group, useMantineTheme, Grid } from "@mantine/core";
import styles from "./Footer.module.css";
import { IconBrandGithub, IconCurrencyDollar } from "@tabler/icons-react";
import NavList from "./NavBar/NavList";

export default function MainFooter() {
  const theme = useMantineTheme();
  return (
    <div
      className={`${styles.footerContainer} ${
        theme.colorScheme === "light" ? styles.lightBgColor : styles.darkBgColor
      }`}
    >
      <Grid>
        <Grid.Col span={5} sm={3}>
          <Group>
            <IconCurrencyDollar />
            <Text fw={600}>
              PricePro{" "}
              <Text span fw={200}>
                2023
              </Text>
            </Text>
          </Group>
        </Grid.Col>
        <Grid.Col span={6} sm={6}>
          <NavList className={styles.footerLinkList} />
        </Grid.Col>
        <Grid.Col span={1} sm={3}>
          <Group position="right" spacing="xs">
            <a href="https://github.com/Yandall/pricepro-web">
              <IconBrandGithub />
            </a>
          </Group>
        </Grid.Col>
      </Grid>
    </div>
  );
}
