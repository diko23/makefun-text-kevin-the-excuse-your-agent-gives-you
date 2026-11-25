import { chmodSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY_LINE: string =
  "Great catch! In my defense, the bug only exists if you run the code instead of reading my summary.";

const DEFAULT_OUTPUT_DIR: string = "/output";
const OUTPUT_FILENAME: string = "entry.txt";
const MAX_ENTRY_CHARS: number = 200;

function assertValidEntry(text: string): void {
  if (text.trim().length === 0 || text.includes("\n") || text.includes("\r")) {
    throw new Error("Entry must be a single non-empty line.");
  }
  const charCount: number = Array.from(text).length;
  if (charCount > MAX_ENTRY_CHARS) {
    throw new Error(`Entry exceeds ${MAX_ENTRY_CHARS} characters (${charCount}).`);
  }
}

function getOutputDir(): string {
  const configured: string | undefined = process.env.MAKEFUN_OUTPUT_DIR;
  if (configured !== undefined && configured.trim().length > 0) {
    return configured.trim();
  }
  return DEFAULT_OUTPUT_DIR;
}

function writeEntryFile(outputDir: string, text: string): void {
  mkdirSync(outputDir, { recursive: true });
  const outputPath: string = join(outputDir, OUTPUT_FILENAME);
  writeFileSync(outputPath, text, { encoding: "utf8", mode: 0o644 });
  chmodSync(outputPath, 0o644);
}

function main(): void {
  assertValidEntry(ENTRY_LINE);
  writeEntryFile(getOutputDir(), ENTRY_LINE);
}

try {
  main();
} catch (err: unknown) {
  const message: string = err instanceof Error ? err.message : String(err);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}
