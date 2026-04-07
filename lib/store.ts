import { promises as fs } from "fs";
import path from "path";

type CollectionName = "users" | "leads" | "automations" | "integrations" | "executions" | "scheduled-jobs" | "worker-state";

const baseDir = path.join(process.cwd(), "data");

const fileMap: Record<CollectionName, string> = {
  users: "users.json",
  leads: "leads.json",
  automations: "automations.json",
  integrations: "integrations.json",
  executions: "executions.json",
  "scheduled-jobs": "scheduled-jobs.json",
  "worker-state": "worker-state.json"
};

async function readRawFile<T>(collection: CollectionName): Promise<T> {
  const filePath = path.join(baseDir, fileMap[collection]);
  const content = await fs.readFile(filePath, "utf8");
  return JSON.parse(content) as T;
}

async function writeRawFile<T>(collection: CollectionName, data: T) {
  const filePath = path.join(baseDir, fileMap[collection]);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

export async function readCollection<T>(collection: CollectionName) {
  return readRawFile<T>(collection);
}

export async function writeCollection<T>(collection: CollectionName, data: T) {
  return writeRawFile(collection, data);
}

export async function appendItem<T extends { id: string }>(
  collection: "leads" | "automations" | "executions" | "scheduled-jobs",
  item: T
) {
  const current = await readRawFile<T[]>(collection);
  current.unshift(item);
  await writeRawFile(collection, current);
  return item;
}
