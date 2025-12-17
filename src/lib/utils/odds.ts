//Functions for betting odds conversion

//Converts american odds to decimal
export function americanToDecimal(american: number): number {
  if (american >= 100) {
    //positive odds
    return american / 100 + 1;
  } else if (american <= -100) {
    //negative odds
    return 100 / Math.abs(american) + 1;
  } else {
    //default to 1.0 or handle as error
    return 1.0;
  }
}

//Converts decimal odds to american
export function decimalToAmerican(decimal: number): number {
  //edge case protection
  if (decimal < 1.01) return -1000;

  if (decimal >= 2.0) {
    //positive american
    return Math.round((decimal - 1) * 100);
  } else {
    //negative american
    return Math.round(-100 / (decimal - 1));
  }
}

//calculates potential profit
export function calculatePotentialProfit(
  stake: number,
  decimalOdds: number,
  bonus: number = 0
): number {
  return stake * decimalOdds + bonus - stake;
}
