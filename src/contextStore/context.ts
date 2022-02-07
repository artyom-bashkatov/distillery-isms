import React, { Dispatch } from "react";

export const BreadCrumbsContext = React.createContext({} as TdefaultContext);

type TdefaultContext = {
  state: TState;
  dispatch: Dispatch<TAction>
}

type TState = {
  pathname: string;
};

type TAction = {
  type: 'reset';
  payload?: never;
}

export const initialState: TState = {
  pathname: 'default'
}

export const reducer = (state: TState, action: TAction): TState => {
  switch(action.type) {
    case 'reset':
      return { pathname: '/users/' }
    default:
      return state;
  }
}