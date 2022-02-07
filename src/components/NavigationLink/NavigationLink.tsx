import React from "react";
import { Link as RouterLink } from "react-router-dom";
import Link from '@mui/material/Link';

type TNavigationLink = {
  label: string;
  to: string;
  active: string;
  onClick?: () => {type: string; payload: never} | void;
}

export const NavigationLink:React.FC<TNavigationLink> = ({ label, to, active, onClick }: TNavigationLink) => {
  if (onClick) {
    return <Link onClick={() => onClick()} data-label={label} data-path={to} underline='none' sx={active.replaceAll('/', '') === to.replaceAll('/', '') ? {
      textDecoration: 'underline'
    } : {textDecoration: 'none'}}
    color={active.replaceAll('/', '') === to.replaceAll('/', '') ? 'rgb(0, 127, 255)' : 'inherit'} component={RouterLink} to={to}>{label}</Link>
  }
  return <Link data-label={label} data-path={to} underline='none' sx={active.replaceAll('/', '') === to.replaceAll('/', '') ? {
    textDecoration: 'underline'
  } : {textDecoration: 'none'}}
  color={active.replaceAll('/', '') === to.replaceAll('/', '') ? 'rgb(0, 127, 255)' : 'inherit'} component={RouterLink} to={to}>{label}</Link>
}