/* eslint-disable no-case-declarations */

export const formatVND = value => {
  // Format the value as VND
  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const parseVND = value => {
  // Remove non-numeric characters and parse the value
  const parsedValue = value.replace(/\D/g, '');
  return isNaN(parsedValue) ? 0 : parseInt(parsedValue, 10);
};

export const parseFloatVND = value => {
  // Remove non-numeric characters and parse the value
  const parsedValue = value.replace(/₫\s?|(,*)/g, '');

  return parsedValue;
};

export const formatMoneyThousand = (value: number, fixedNumber: number) => {
  // Format the value as UnitPriceType
  // Format the value as UnitPriceType
  const thousand = value / 1000;
  if (Number.isInteger(thousand)) return `${thousand}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (parseFloat(thousand.toFixed(fixedNumber)) > 0) return `${thousand.toFixed(fixedNumber)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return 0;
};

export const formatMoneyMillion = (value: number, fixedNumber: number) => {
  // Format the value as UnitPriceType
  const million = value / 1000000;

  if (parseFloat(million.toFixed(fixedNumber)) > 0 || parseFloat(million.toFixed(fixedNumber)) < 0)
    return `${million.toFixed(fixedNumber)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return 0;
};

export const formatMoneyBillion = (value: number, fixedNumber: number) => {
  const billion = value / 1000000000;
  return `${billion.toFixed(fixedNumber)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
