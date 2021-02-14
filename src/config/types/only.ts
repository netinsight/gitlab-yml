type OnlyExpression =
    | {
          refs?: RefList;
          variables?: string[];
          changes?: string[];
          kubernetes?: "active";
      }
    | RefList;

type ExpectExpression = OnlyExpression;

type RefList = Ref[];

type Ref = string | RegExp;

export { OnlyExpression, ExpectExpression };
