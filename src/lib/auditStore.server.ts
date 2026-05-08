import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import type { AuditResult } from "@/lib/auditEngine";

const STORAGE_ROOT = join(process.cwd(), ".data");
const AUDITS_FILE = join(STORAGE_ROOT, "audits.json");

type StoredAudits = Record<string, AuditResult>;

export async function saveAuditResult(result: AuditResult): Promise<void> {
  const audits = await readAudits();
  audits[result.id] = result;
  await writeJsonFile(AUDITS_FILE, audits);
}

export async function getAuditResult(id: string): Promise<AuditResult | null> {
  const audits = await readAudits();
  return audits[id] ?? null;
}

async function readAudits(): Promise<StoredAudits> {
  return readJsonFile<StoredAudits>(AUDITS_FILE, {});
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return fallback;
    }

    throw error;
  }
}

async function writeJsonFile(filePath: string, value: unknown): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}
