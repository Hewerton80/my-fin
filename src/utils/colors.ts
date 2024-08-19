import { getRandomInt } from "./getRandomInt";

export const getRandomRGBColor = () => {
  const r = getRandomInt(0, 255);
  const g = getRandomInt(0, 255);
  const b = getRandomInt(0, 255);
  return `rgb(${r},${g},${b})`;
};

export const getContrastColor = (rgbColor: string) => {
  const [r, g, b] = rgbColor
    .replace("rgb(", "")
    .replace(")", "")
    .split(",")
    .map((color) => Number(color));

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 125 ? "#000000" : "#ffffff";
};
