import React, { useEffect, useState, useReducer } from "react";
import "./App.css";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { Routes, Route } from "react-router-dom";
import { Users } from "components/Users/Users";
import { Services } from "components/Services/Services";
import { DeletedEmployees} from "components/DeletedEmployees/DeletedEmployees";
import { Graphics } from "components/Graphics/Graphics";
import { Requests } from "components/Requests/Requests";
import { Employees } from "components/Employees/Employees";
import { Statistics } from "components/Statistics/Statistics";
import { BreadCrumbs } from "components/BreadCrumbs/BreadCrumbs";
import { Reports } from "components/Reports/Reports";

import {
  BreadCrumbsContext,
  initialState,
  reducer,
} from "contextStore/context";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import { useTranslation } from "react-i18next";
import { Actualization } from "components/Actualization/Actualization";

import { NavigationMenu } from "components/NavigationMenu/NavigationMenu";
import { TonChangeNavigationMenu } from "types/global";
import { Auth } from "components/Auth/Auth";
import { tokenStore } from "helpers/auth";
import { postRequest } from "helpers/requests";

type TRouterMapped = {
  [key: string]: string;
};

const App: React.FC = () => {
  const [active, setActive] = useState("/users/");
  const [breadCrumbs, setBreadCrumbs] = useState("");
  const [alignment, setAlignment] = React.useState("en");
  const { t, i18n } = useTranslation();
  const [appToken, setAppToken] = useState<null|string>(null);

  const routerMap: TRouterMapped = {
    users: t("navigation.users"),
    services: t("navigation.services"),
    reports: t("navigation.reports"),
    graphics: t("navigation.graphic"),
    requests: t("navigation.requests"),
    employees: t("navigation.employees"),
    statistics: t("navigation.statistics"),
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fromStorage = localStorage.getItem('token');
      
      if(fromStorage) {
        const setterToken = async () => {
          await (await tokenStore).setToken(fromStorage);
          setAppToken(fromStorage);
          localStorage.removeItem('token')
        }
        setterToken();
      }
        
    const saveToken = async () => {
      const currentToken = await (await tokenStore).getToken();
      if (typeof currentToken === 'string') {
        localStorage.setItem('token', currentToken);
      }
    }

    window.addEventListener('beforeunload', saveToken);

    return () => {
      window.removeEventListener('beforeunload', saveToken);
    } 
  }, []);

  useEffect(() => {
    if (location.pathname !== "/") {
      setActive(location.pathname);
    } else {
      setBreadCrumbs(t("navigation.users"));
    }

    if (routerMap[location.pathname.replaceAll("/", "").replaceAll('client', '')]) {
      setBreadCrumbs(routerMap[location.pathname.replaceAll("/", "").replaceAll('client', '')]);
    }
  }, []);

  useEffect(() => {
    if (state.pathname === "/users/") {
      setActive("/users/");
      setBreadCrumbs(t("navigation.users"));
    }
  }, [state]);

  const handleSaveToken = (token: string) => {
    setAppToken(token);
  }

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language).then(() => {
      const translate = `navigation.${active.replaceAll("/", "")}`;
      setBreadCrumbs(t(translate));
    });
  };

  const handleChange = (
    event: React.SyntheticEvent<EventTarget>,
    newAlignment: string
  ) => {
    setAlignment(newAlignment);
    changeLanguage(newAlignment);
  };

  if (appToken === null) {
    return <Auth onAuth={(token: string) => handleSaveToken(token)} />
  }

  const handleChangeMenu = (e: TonChangeNavigationMenu) => {
    const { active, breadCrumbs} = e;
    setActive(active);
    setBreadCrumbs(breadCrumbs);
  }

  const handleExit = async () => {
    try {
      await postRequest('rest-auth/logout/', "string");
    } catch(e) {
      console.error(e);
    } finally {
      await (await tokenStore).removeToken();
      setAppToken(null);
    }
  }

  return (
    <Container maxWidth="xl">
      <Grid container spacing={2}>
        <Grid className="menu-navigation" item xs={2}>
          <Paper elevation={3}>
            <NavigationMenu active={active} onChange={(e) => handleChangeMenu(e)} />
          </Paper>
          <Button sx={{mt: 3}} onClick={handleExit} variant="outlined">Exit</Button>
        </Grid>
        <Grid item xs={10}>
          <BreadCrumbsContext.Provider value={{ dispatch, state }}>
            <BreadCrumbs label={breadCrumbs} />
            <ToggleButtonGroup
              className="language-group"
              size="small"
              color="primary"
              value={alignment}
              exclusive
              onChange={handleChange}
            >
              <ToggleButton value="en">En</ToggleButton>
              <ToggleButton value="ru">Ru</ToggleButton>
            </ToggleButtonGroup>
          </BreadCrumbsContext.Provider>
          <Routes>
            <Route path={`${process.env.PUBLIC_URL}/users/`} element={<Users />} />
            <Route path={`${process.env.PUBLIC_URL}/services/`} element={<Services />} />
            <Route path={`${process.env.PUBLIC_URL}/deletedEmployees/`} element={<DeletedEmployees />} />
            <Route path={`${process.env.PUBLIC_URL}/reports/`} element={<Reports />} />
            <Route path={`${process.env.PUBLIC_URL}/graphics/`} element={<Graphics />} />
            <Route path={`${process.env.PUBLIC_URL}/requests/`} element={<Requests />} />
            <Route path={`${process.env.PUBLIC_URL}/employees/`} element={<Employees />} />
            <Route path={`${process.env.PUBLIC_URL}/statistics/`} element={<Statistics />} />
            <Route path={`${process.env.PUBLIC_URL}/actualization/`} element={<Actualization />} />
            <Route path={`${process.env.PUBLIC_URL}`} element={<Users />} />
            <Route index element={<Users />} />
          </Routes>
          <span className="version">Dashboard version: 1.0.0</span>
        </Grid>
      </Grid>
    </Container>
  );
};

export { App };
