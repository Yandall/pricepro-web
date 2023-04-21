import { Group } from "@mantine/core";
import { useRouter } from "next/router";
import styles from "./NavList.module.css";
import NavLink, { NavLinkProps } from "./NavLink";

type Props = {
  className?: string;
};

export default function NavList(props: Props) {
  const router = useRouter();
  const linkList: NavLinkProps[] = [
    {
      label: "Productos",
      href: "/search",
      active: isActive("/search"),
    },
    {
      label: "Sugerir producto",
      href: "/suggest",
      active: isActive("/suggest"),
    },
    {
      label: "Acerda de",
      href: "/",
      active: isActive("/product/[id]"),
    },
  ];

  function isActive(path: string) {
    return path === router.pathname;
  }
  return (
    <>
      <Group className={`${styles.navGroup} ${props.className}`}>
        {linkList.map((link, index) => (
          <NavLink
            label={link.label}
            href={link.href}
            active={link.active}
            key={index}
          />
        ))}
      </Group>
    </>
  );
}
