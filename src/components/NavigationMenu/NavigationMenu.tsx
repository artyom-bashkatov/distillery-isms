import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import { NavigationLink } from "components/NavigationLink/NavigationLink";
import { TonChangeNavigationMenu } from "types/global";
import { useTranslation } from "react-i18next";

type TNavigationMenuProps = {
  active: string;
  onChange: (argChange: TonChangeNavigationMenu) => void;
}

export const NavigationMenu:React.FC<TNavigationMenuProps> = ({ active, onChange }: TNavigationMenuProps) => {
  const { t } = useTranslation();

  const handleClick = (event: React.SyntheticEvent<EventTarget>):void => {
    if (!(event.target instanceof HTMLAnchorElement)) {
      return;
    }
    const path = event.target.dataset.path;
    if (path && event.target.dataset.path && event.target.dataset.label) {
        onChange({ active: event.target.dataset.path, breadCrumbs: event.target.dataset.label })
    }
  };

  return <List onClick={(e) => handleClick(e)} aria-label="main route">
  <Typography
    align="center"
    variant="h5"
    gutterBottom
    component="div"
  >
    {t("navigation.menu")}
  </Typography>
  <ListItem>
    <NavigationLink
      active={active}
      label={t("navigation.users")}
      to={`${process.env.PUBLIC_URL}/users/`}
    />
  </ListItem>
  <ListItem>
    <NavigationLink
      active={active}
      label={t("navigation.deletedEmployees")}
      to={`${process.env.PUBLIC_URL}/deletedEmployees/`}
    />
  </ListItem>
  <ListItem>
    <NavigationLink
      active={active}
      label={t("navigation.services")}
      to={`${process.env.PUBLIC_URL}/services/`}
    />
  </ListItem>
  <ListItem>
    <NavigationLink
      active={active}
      label={t("navigation.graphic")}
      to={`${process.env.PUBLIC_URL}/graphics/`}
    />
  </ListItem>
  <ListItem>
    <NavigationLink
      active={active}
      label={t("navigation.employees")}
      to={`${process.env.PUBLIC_URL}/employees/`}
    />
  </ListItem>
  <ListItem>
    <NavigationLink
      active={active}
      label={t("navigation.statistics")}
      to={`${process.env.PUBLIC_URL}/statistics/`}
    />
  </ListItem>
  <ListItem>
    <NavigationLink
      active={active}
      label={t("navigation.actualization")}
      to={`${process.env.PUBLIC_URL}/actualization/`}
    />
  </ListItem>
</List>
}