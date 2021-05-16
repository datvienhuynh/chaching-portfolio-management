export const formatCurrency = (amount) => {
  const floatAmount = parseFloat(amount);
  const formatter = new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
  });
  return formatter.format(floatAmount);
};

const zeroPadNumber = (n, len) => {
  return String(n).padStart(len, '0');
};

export const formatDate = (date, format) => {
  const D = date.getDate();
  const M = date.getMonth() + 1;
  const Y = date.getFullYear();
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();

  if (format === 'YYYY-MM-DD') {
    return `${Y}-${String(M).padStart(2, '0')}-${String(D).padStart(2, '0')}`;
  } else if (format === 'DD-MM-YYYY hh:mm:ss') {
    return (
      `${zeroPadNumber(D, 2)}-${zeroPadNumber(M, 2)}-${Y} ` +
      `${zeroPadNumber(h, 2)}:${zeroPadNumber(m, 2)}:${zeroPadNumber(s, 2)}`
    );
  }
};
