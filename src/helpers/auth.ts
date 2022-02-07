type TModuleTokenStore = {
  getToken: () => Promise<string|null>;
  setToken: (arg: string | null) => Promise<boolean> | undefined;
  removeToken: () => Promise<boolean>;
}

export const module_tokenStore = async () :Promise<TModuleTokenStore> => {
  let token: null | string = null;
  return {
    getToken() {
      return new Promise((resolve) => {
        resolve(token)
      });
    },
    setToken(argToken: string | null) {
      if(argToken?.length) {
        return new Promise((resolve) => {
          token = argToken;
          resolve(true);
        })
      }
    },
    removeToken() {
      return new Promise((resolve) => {
        token = null;
        resolve(true);
      })
      
    }
  };
};

const tokenStore  = module_tokenStore();
export { tokenStore };