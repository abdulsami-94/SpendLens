import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

export interface LeadCaptureRecord {
  auditId: string;
  submittedAt: string;
  type: "credex" | "notify";
  email: string;
  company?: string;
  monthlySavings?: number;
}

const STORAGE_ROOT = join(process.cwd(), ".data");
const LEADS_FILE = join(STORAGE_ROOT, "lead-captures.json");

export async function appendLeadCapture(record: LeadCaptureRecord): Promise<void> {
  const records = await readLeadCaptures();
  records.push(record);
  await writeJsonFile(LEADS_FILE, records);
}

async function readLeadCaptures(): Promise<LeadCaptureRecord[]> {
  try {
    const raw = await readFile(LEADS_FILE, "utf8");
    return JSON.parse(raw) as LeadCaptureRecord[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

async function writeJsonFile(filePath: string, value: unknown): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}
