export function computeCompoundInterest(
    principal: number,
    ratePercent: number,
    years: number
): number[] {
    const rate = ratePercent / 100;
    const values: number[] = [];

    for (let year = 0; year <= years; year += 1) {
        const amount = principal * Math.pow(1 + rate, year);
        values.push(Math.round(amount));
    }

    return values;
}
