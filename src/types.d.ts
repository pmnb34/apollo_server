type Context = {
  token: any;
  user: any;
  loggedInUser?: any;
  ua?:any
};
export type Resolver = (root: any, args: any, context: Context, info: any) => any;

export type Resolvers = {
  [key: string]: {
    [key: string]: Resolver;
  };
};
