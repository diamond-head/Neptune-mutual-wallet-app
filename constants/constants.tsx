export enum CoinsEnum {
  NEP = 'NEP',
  BUSD = 'BUSD',
};

export const SWAP_COIN: { [key: string]: string } = {
  NEP: "BUSD",
  BUSD: 'NEP',
};

export const CONVERSION_RATES: { [key: string]: any } = {
  [CoinsEnum.NEP]: {
    BUSD: 1.1963
  },
  [CoinsEnum.BUSD]: {
    NEP: 0.835942
  }
}