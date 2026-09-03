import log from "./log";

type AnyFunction<TArgs extends readonly unknown[], R> = (
  ...args: TArgs
) => R;

type Complexity = {
  time: string;
  space: string;
};

interface Data<TArgs extends readonly unknown[], R> {
  ques: number;
  name: string;
  args: readonly TArgs[];
  fn: string;
  results: Array<{
    input: TArgs;
    result: R;
  }>;
  totalTime: number;
  averageTime: number;
  operationsPerSecond: number;
  heapChange: number;
  complexity: Complexity;
}

const gc = (globalThis as { gc?: () => void }).gc;

export default function benchmark<
  TArgs extends readonly unknown[],
  R
>(
  ques: number,
  name: string,
  fn: AnyFunction<TArgs, R>,
  args: readonly TArgs[],
  complexity?: Complexity,
): Data<TArgs, R> {
  if (args.length === 0) {
    throw new Error("Benchmark requires at least one argument");
  }

  gc?.();

  const memoryBefore = process.memoryUsage().heapUsed;
  const start = performance.now();

  const results: Array<{
    input: TArgs;
    result: R;
  }> = [];

  for (const input of args) {
    const result = fn(...input);

    results.push({
      input,
      result,
    });
  }

  const elapsedMs = performance.now() - start;
  const memoryAfter = process.memoryUsage().heapUsed;

  const data: Data<TArgs, R> = {
    ques,
    name,
    args,
    fn: fn.toString().replaceAll(/\n+/g, " ").trim(),
    results,
    totalTime: elapsedMs,
    averageTime: elapsedMs / args.length,
    operationsPerSecond: (args.length / elapsedMs) * 1000,
    heapChange: (memoryAfter - memoryBefore) / 1024 / 1024,
    complexity: {
      time: complexity?.time ?? "Unknown",
      space: complexity?.space ?? "Unknown",
    },
  };

  log(ques, data);

  return data;
}