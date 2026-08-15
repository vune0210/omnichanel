export enum CurrencyEnum {
  USD = 'USD',
  VND = 'VND',
}

export const CurrencyFormat = {
  [CurrencyEnum.VND]: {
    symbol: '₫',
    precision: 0,
    decimal: ',',
    separator: '.',
  },
  [CurrencyEnum.USD]: {
    symbol: '$',
    precision: 2,
    decimal: '.',
    separator: ',',
  },
};
