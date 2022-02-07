import React, { useContext } from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { NavigationLink } from "components/NavigationLink/NavigationLink";
import { Divider } from "@mui/material";
import { BreadCrumbsContext } from 'contextStore/context';

import { useTranslation } from "react-i18next";

import "./BreadCrumbs.css";

type TBreadCrumbs = {
  label: string;
}

export const BreadCrumbs: React.FC<TBreadCrumbs> = ({ label }: TBreadCrumbs) => {
  const { t } = useTranslation();
  const { dispatch } = useContext(BreadCrumbsContext);

  return (
    <div className="breadCrumbs-container">
      <div className="breadCrumbs">
        <Breadcrumbs aria-label="breadcrumb">
        <NavigationLink onClick={() => dispatch({ type: 'reset' })} active={''} label={t("navigation.menu")} to="/users" />
          <Typography color="text.primary">{label}</Typography>
        </Breadcrumbs>
      </div>
      <Divider />
    </div>
  );
};
