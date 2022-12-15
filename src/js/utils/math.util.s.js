export function getRandomFloat(min, max) {
  return (Math.random() * (max - min) + min);
}

export function getRandomFixedFloat(min, max, decimals) {
  const str = getRandomFloat(min, max).toFixed(decimals);

  return parseFloat(str);
}