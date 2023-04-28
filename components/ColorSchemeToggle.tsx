import { useLocalStorage } from "@mantine/hooks";
import { ActionIcon, ActionIconProps, ColorScheme } from "@mantine/core";
import { IconSun, IconMoonStars } from "@tabler/icons-react";

export default function ColorSchemeToggle(props: ActionIconProps) {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "color-scheme",
    defaultValue: "light",
  });

  const toggleColorScheme = () =>
    setColorScheme((current) => (current === "dark" ? "light" : "dark"));

  return (
    <ActionIcon {...props} onClick={toggleColorScheme}>
      {colorScheme === "dark" ? <IconSun /> : <IconMoonStars />}
    </ActionIcon>
  );
}
