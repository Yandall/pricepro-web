import { useLocalStorage } from "@mantine/hooks";
import { ActionIcon, ColorScheme } from "@mantine/core";
import { IconSun, IconMoonStars } from "@tabler/icons-react";

export default function ColorSchemeToggle() {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "color-scheme",
    defaultValue: "light",
  });

  const toggleColorScheme = () =>
    setColorScheme((current) => (current === "dark" ? "light" : "dark"));

  return (
    <ActionIcon onClick={toggleColorScheme}>
      {colorScheme === "dark" ? <IconSun /> : <IconMoonStars />}
    </ActionIcon>
  );
}
