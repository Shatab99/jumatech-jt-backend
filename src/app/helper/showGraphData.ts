import { startOfMonth, endOfMonth } from "date-fns";

export const buildGraphData = (transactions: any[]) => {
  // Step 1: detect if earningType exists in any transaction
  const hasEarningType = transactions.some((tx) => tx.earningType);

  // Step 2: collect earning types dynamically if they exist
  const earningTypes = hasEarningType
    ? Array.from(
        new Set(transactions.map((tx) => tx.earningType).filter(Boolean))
      )
    : [];

  // Step 3: initialize graph for 12 months
  const graph = Array.from({ length: 12 }, (_, i) => {
    const base: Record<string, number | string> = {
      month: new Date(0, i).toLocaleString("default", { month: "short" }),
    };

    if (hasEarningType) {
      earningTypes.forEach((type) => (base[type] = 0));
    } else {
      base.amount = 0; // default single amount
    }

    return base;
  });

  // Step 4: populate monthly totals
  transactions.forEach((tx) => {
    const monthIndex = tx.createdAt.getMonth();

    if (hasEarningType && tx.earningType) {
      //@ts-ignore
      graph[monthIndex][tx.earningType] += tx.amount * 0.1; // adjust logic as needed
    } else {
      (graph[monthIndex] as any).amount += tx.amount * 0.1;
    }
  });

  // Step 5: calculate current month revenue
  const currentMonthStart = startOfMonth(new Date());
  const currentMonthEnd = endOfMonth(new Date());

  const currentMonthRevenue = transactions
    .filter(
      (tx) =>
        tx.createdAt >= currentMonthStart && tx.createdAt <= currentMonthEnd
    )
    .reduce((sum, tx) => sum + tx.amount, 0);

  return { graph, currentMonthRevenue };
};
