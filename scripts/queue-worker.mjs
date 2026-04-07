import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const dataDir = path.join(rootDir, "data");
const envLocalPath = path.join(rootDir, ".env.local");

function parseEnvFile(content) {
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

async function loadLocalEnv() {
  try {
    const content = await fs.readFile(envLocalPath, "utf8");
    parseEnvFile(content);
  } catch {
    // Skip when .env.local does not exist.
  }
}

async function readJson(fileName, fallback) {
  try {
    const content = await fs.readFile(path.join(dataDir, fileName), "utf8");
    return JSON.parse(content);
  } catch {
    return fallback;
  }
}

async function writeJson(fileName, data) {
  await fs.writeFile(path.join(dataDir, fileName), JSON.stringify(data, null, 2), "utf8");
}

function getPollMs() {
  return Number(process.env.WORKER_POLL_MS || 30000);
}

function isDatabaseEnabled() {
  return Boolean(process.env.DATABASE_URL);
}

let prismaClientPromise;

async function getPrisma() {
  if (!isDatabaseEnabled()) {
    return null;
  }

  if (!prismaClientPromise) {
    prismaClientPromise = import("@prisma/client").then(({ PrismaClient }) => new PrismaClient({ log: ["error"] }));
  }

  return prismaClientPromise;
}

async function getTenantChannelConfig(prisma, tenantId, channel) {
  if (!prisma || !tenantId) {
    return null;
  }

  const config = await prisma.integrationConfig.findUnique({
    where: {
      tenantId_channel: {
        tenantId,
        channel
      }
    }
  });

  if (!config) {
    return null;
  }

  try {
    return JSON.parse(config.configJson);
  } catch {
    return null;
  }
}

async function deliverMessage(channel, recipient, message, tenantId) {
  const prisma = await getPrisma();
  const tenantConfig = await getTenantChannelConfig(prisma, tenantId, channel);

  if (
    channel === "whatsapp" &&
    (tenantConfig?.accessToken || process.env.WHATSAPP_ACCESS_TOKEN) &&
    (tenantConfig?.phoneNumberId || process.env.WHATSAPP_PHONE_NUMBER_ID)
  ) {
    const response = await fetch(`https://graph.facebook.com/v22.0/${tenantConfig?.phoneNumberId || process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tenantConfig?.accessToken || process.env.WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: recipient,
        type: "text",
        text: { body: message }
      })
    });

    return { ok: response.ok, status: response.ok ? "sent" : "provider_error" };
  }

  if (channel === "instagram" && (tenantConfig?.accessToken || process.env.INSTAGRAM_ACCESS_TOKEN)) {
    const response = await fetch("https://graph.facebook.com/v22.0/me/messages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tenantConfig?.accessToken || process.env.INSTAGRAM_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        recipient: { id: recipient },
        message: { text: message }
      })
    });

    return { ok: response.ok, status: response.ok ? "sent" : "provider_error" };
  }

  return { ok: true, status: "mock_sent" };
}

async function processQueueWithDatabase(mode) {
  const prisma = await getPrisma();
  const now = new Date();
  const dueJobs = await prisma.scheduledJob.findMany({
    where: {
      status: "pending",
      scheduledFor: {
        lte: now
      }
    },
    orderBy: {
      scheduledFor: "asc"
    }
  });
  let processed = 0;

  for (const job of dueJobs) {
    const delivery = await deliverMessage(job.channel, job.recipient, job.message, job.tenantId);

    await prisma.execution.create({
      data: {
        tenantId: job.tenantId,
        userId: job.userId,
        automationId: job.automationId,
        automationName: `${job.automationName} - 2a etapa`,
        channel: job.channel,
        contactName: job.contactName,
        recipient: job.recipient,
        status: delivery.status,
        preview: job.message,
        createdAt: new Date()
      }
    });

    await prisma.scheduledJob.update({
      where: { id: job.id },
      data: {
        status: delivery.status === "provider_error" ? "error" : "processed"
      }
    });

    processed += 1;
  }

  const pending = await prisma.scheduledJob.count({
    where: {
      status: "pending"
    }
  });

  await writeJson("worker-state.json", {
    status: "idle",
    lastRunAt: new Date().toISOString(),
    lastProcessed: processed,
    pending,
    mode
  });

  console.log(`[Klio Worker] database=true processed=${processed} pending=${pending}`);
}

async function processQueueWithJson(mode) {
  const jobs = await readJson("scheduled-jobs.json", []);
  const executions = await readJson("executions.json", []);
  const now = Date.now();
  let processed = 0;

  for (const job of jobs) {
    if (job.status !== "pending") {
      continue;
    }

    if (new Date(job.scheduledFor).getTime() > now) {
      continue;
    }

    const delivery = await deliverMessage(job.channel, job.recipient, job.message, job.tenantId);

    executions.unshift({
      id: `execution_${Date.now()}_${processed}`,
      userId: job.userId || "user-1",
      automationId: job.automationId,
      automationName: `${job.automationName} - 2a etapa`,
      channel: job.channel,
      contactName: job.contactName,
      recipient: job.recipient,
      status: delivery.status,
      preview: job.message,
      createdAt: new Date().toISOString()
    });

    job.status = delivery.status === "provider_error" ? "error" : "processed";
    processed += 1;
  }

  await writeJson("scheduled-jobs.json", jobs);
  await writeJson("executions.json", executions);
  await writeJson("worker-state.json", {
    status: "idle",
    lastRunAt: new Date().toISOString(),
    lastProcessed: processed,
    pending: jobs.filter((job) => job.status === "pending").length,
    mode
  });

  console.log(`[Klio Worker] processed=${processed} pending=${jobs.filter((job) => job.status === "pending").length}`);
}

async function processQueue(mode) {
  if (isDatabaseEnabled()) {
    await processQueueWithDatabase(mode);
    return;
  }

  await processQueueWithJson(mode);
}

async function run() {
  await loadLocalEnv();

  const once = process.argv.includes("--once");

  if (once) {
    await processQueue("once");
    return;
  }

  const pollMs = getPollMs();

  console.log(`[Klio Worker] running every ${pollMs}ms`);
  await processQueue("daemon");

  setInterval(() => {
    processQueue("daemon").catch((error) => {
      console.error("[Klio Worker] error", error);
    });
  }, pollMs);
}

run().catch((error) => {
  console.error("[Klio Worker] fatal", error);
  process.exit(1);
});
