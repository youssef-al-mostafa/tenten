interface Props {
    amount: number,
    currency?: string,
    locale?: string,
}
export const CurrencyFormatter = ({amount,currency='USD',locale}:Props) => {
  return Intl.NumberFormat(locale,{
    style: 'currency',
    currency: currency,
  }).format(amount);
}
