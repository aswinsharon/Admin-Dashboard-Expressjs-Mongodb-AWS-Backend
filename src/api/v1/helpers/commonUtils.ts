import jwt from "jsonwebtoken";

export const generateAccessToken = (id: any): string => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "30m" });
};

export const generateRefreshToken = (id: any): string => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET!);
};

export const convertToAmount = (centAmount: number, fractionDigits: number): number | null => {
  let formattedAmount = null;
  if (centAmount && typeof centAmount === 'number' && fractionDigits && typeof fractionDigits === 'number') {
    const amount = centAmount / 100;
    formattedAmount = parseFloat(amount.toFixed(fractionDigits));
  }
  return formattedAmount;
}