import { getPrismaClient, hasDatabaseUrl } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/security";
import { appendItem, readCollection, writeCollection } from "@/lib/store";

export type SessionUser = {
  id: string;
  tenantId?: string;
  name: string;
  email: string;
  company: string;
};

export type LeadRecord = {
  id: string;
  tenantId?: string;
  userId?: string;
  name: string;
  channel: string;
  stage: string;
  email: string;
  phone: string;
  lastMessage: string;
  updatedAt: string;
};

export type AutomationRecord = {
  id: string;
  tenantId?: string;
  userId?: string;
  name: string;
  channel: string;
  trigger: string;
  status: string;
  message: string;
};

export type ExecutionRecord = {
  id: string;
  tenantId?: string;
  userId?: string;
  automationId: string;
  automationName: string;
  channel: string;
  contactName: string;
  recipient: string;
  status: string;
  preview: string;
  createdAt: string;
};

export type ScheduledJobRecord = {
  id: string;
  tenantId?: string;
  userId?: string;
  automationId: string;
  automationName: string;
  channel: string;
  contactName: string;
  recipient: string;
  message: string;
  scheduledFor: string;
  status: string;
  createdAt: string;
};

export type WorkerStateRecord = {
  status: string;
  lastRunAt: string | null;
  lastProcessed: number;
  pending: number;
  mode: string;
};

type LocalUser = {
  id: string;
  tenantId?: string;
  name: string;
  email: string;
  password?: string;
  passwordHash?: string;
  company: string;
};

type LocalIntegrations = {
  whatsapp: { tenantId?: string; connected: boolean; label: string; phoneNumberId: string; accessToken?: string; verifyToken?: string };
  instagram: { tenantId?: string; connected: boolean; label: string; appId: string; accessToken?: string; verifyToken?: string };
  pix: { tenantId?: string; connected: boolean; label: string; provider: string; accessToken?: string };
};

function getBootstrapAdminConfig() {
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim();
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD?.trim();

  if (!email || !password) {
    return null;
  }

  return {
    name: process.env.BOOTSTRAP_ADMIN_NAME?.trim() || "Owner Klio",
    email,
    password,
    company: process.env.BOOTSTRAP_ADMIN_COMPANY?.trim() || "Klio"
  };
}

export async function findUserByCredentials(email: string, password: string): Promise<SessionUser | null> {
  if (hasDatabaseUrl()) {
    const prisma = getPrismaClient();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return null;
    }

    return { id: user.id, tenantId: user.tenantId, name: user.name, email: user.email, company: user.company };
  }

  const users = await readCollection<LocalUser[]>("users");
  const user = users.find((item) => item.email === email);

  if (!user) {
    return null;
  }

  if (user.passwordHash) {
    if (!verifyPassword(password, user.passwordHash)) {
      return null;
    }
  } else if (user.password !== password) {
    return null;
  }

  return { id: user.id, tenantId: user.tenantId, name: user.name, email: user.email, company: user.company };
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  company: string;
  tenantId?: string;
}): Promise<SessionUser> {
  const passwordHash = hashPassword(input.password);

  if (hasDatabaseUrl()) {
    const prisma = getPrismaClient();
    let tenantId = input.tenantId;

    if (!tenantId) {
      const tenant = await prisma.tenant.create({
        data: {
          name: input.company,
          slug: input.company.toLowerCase().replace(/[^a-z0-9]+/g, "-")
        }
      });
      tenantId = tenant.id;
    }

    const user = await prisma.user.create({
      data: {
        tenantId,
        name: input.name,
        email: input.email,
        passwordHash,
        company: input.company
      }
    });

    return { id: user.id, tenantId: user.tenantId, name: user.name, email: user.email, company: user.company };
  }

  const users = await readCollection<LocalUser[]>("users");

  if (users.some((user) => user.email === input.email)) {
    throw new Error("Ja existe um usuario com este email.");
  }

  const tenantSlug = input.company.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const user = {
    id: `user_${Date.now()}`,
    tenantId: input.tenantId || `tenant_${tenantSlug || Date.now()}`,
    name: input.name,
    email: input.email,
    passwordHash,
    company: input.company
  };

  await writeCollection("users", [user, ...users]);
  return { id: user.id, tenantId: user.tenantId, name: user.name, email: user.email, company: user.company };
}

export async function ensureSeedUser() {
  const bootstrap = getBootstrapAdminConfig();

  if (hasDatabaseUrl()) {
    if (!bootstrap) {
      return;
    }

    const prisma = getPrismaClient();
    const existing = await prisma.user.findUnique({ where: { email: bootstrap.email } });
    const legacy = await prisma.user.findUnique({ where: { email: "admin@klio.local" } });
    const bootstrapHash = hashPassword(bootstrap.password);

    if (!existing) {
      if (legacy) {
        let tenantId = legacy.tenantId;

        const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });

        if (tenant && tenant.name !== bootstrap.company) {
          await prisma.tenant.update({
            where: { id: tenant.id },
            data: {
              name: bootstrap.company,
              slug: bootstrap.company.toLowerCase().replace(/[^a-z0-9]+/g, "-")
            }
          });
        }

        await prisma.user.update({
          where: { id: legacy.id },
          data: {
            name: bootstrap.name,
            email: bootstrap.email,
            passwordHash: bootstrapHash,
            company: bootstrap.company
          }
        });
      } else {
        const tenant = await prisma.tenant.create({
          data: {
            name: bootstrap.company,
            slug: bootstrap.company.toLowerCase().replace(/[^a-z0-9]+/g, "-")
          }
        });

        await prisma.user.create({
          data: {
            tenantId: tenant.id,
            name: bootstrap.name,
            email: bootstrap.email,
            passwordHash: bootstrapHash,
            company: bootstrap.company
          }
        });
      }
    } else if (!verifyPassword(bootstrap.password, existing.passwordHash) || existing.name !== bootstrap.name || existing.company !== bootstrap.company) {
      await prisma.user.update({
        where: { id: existing.id },
        data: {
          name: bootstrap.name,
          passwordHash: bootstrapHash,
          company: bootstrap.company
        }
      });
    }

    return;
  }

  const users = await readCollection<LocalUser[]>("users");

  if (!bootstrap) {
    return;
  }

  const bootstrapHash = hashPassword(bootstrap.password);
  const existing = users.find((user) => user.email === bootstrap.email);
  const legacy = users.find((user) => user.email === "admin@klio.local");

  if (existing) {
    const nextUsers = users.map((user) =>
      user.id === existing.id
        ? {
            ...user,
            name: bootstrap.name,
            passwordHash: bootstrapHash,
            company: bootstrap.company
          }
        : user
    );

    await writeCollection("users", nextUsers);
    return;
  }

  if (legacy) {
    const nextUsers = users.map((user) =>
      user.id === legacy.id
        ? {
            ...user,
            name: bootstrap.name,
            email: bootstrap.email,
            passwordHash: bootstrapHash,
            company: bootstrap.company
          }
        : user
    );

    await writeCollection("users", nextUsers);
    return;
  }

  const tenantSlug = bootstrap.company.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  await writeCollection("users", [
    {
      id: `user_${Date.now()}`,
      tenantId: `tenant_${tenantSlug || Date.now()}`,
      name: bootstrap.name,
      email: bootstrap.email,
      passwordHash: bootstrapHash,
      company: bootstrap.company
    },
    ...users
  ]);
}

export async function listLeads(userId?: string) {
  if (hasDatabaseUrl()) {
    const prisma = getPrismaClient();
    const leads = await prisma.lead.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { updatedAt: "desc" }
    });

    return (leads as Array<{ updatedAt: Date } & Record<string, unknown>>).map((lead) => ({
      ...lead,
      updatedAt: lead.updatedAt.toISOString()
    }));
  }

  return readCollection<LeadRecord[]>("leads");
}

export async function createLead(input: LeadRecord) {
  if (hasDatabaseUrl() && input.userId) {
    const prisma = getPrismaClient();
    const lead = await prisma.lead.create({
      data: {
        tenantId: input.tenantId!,
        userId: input.userId,
        name: input.name,
        channel: input.channel,
        stage: input.stage,
        email: input.email,
        phone: input.phone,
        lastMessage: input.lastMessage
      }
    });

    return { ...lead, updatedAt: lead.updatedAt.toISOString() };
  }

  await appendItem("leads", input);
  return input;
}

export async function listAutomations(userId?: string) {
  if (hasDatabaseUrl()) {
    const prisma = getPrismaClient();
    const automations = await prisma.automation.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { updatedAt: "desc" }
    });

    return automations;
  }

  return readCollection<AutomationRecord[]>("automations");
}

export async function createAutomation(input: AutomationRecord) {
  if (hasDatabaseUrl() && input.userId) {
    const prisma = getPrismaClient();
    return prisma.automation.create({
      data: {
        tenantId: input.tenantId!,
        userId: input.userId,
        name: input.name,
        channel: input.channel,
        trigger: input.trigger,
        status: input.status,
        message: input.message
      }
    });
  }

  await appendItem("automations", input);
  return input;
}

export async function getAutomationById(id: string, userId?: string) {
  if (hasDatabaseUrl()) {
    const prisma = getPrismaClient();
    return prisma.automation.findFirst({
      where: {
        id,
        ...(userId ? { userId } : {})
      }
    });
  }

  const automations = await readCollection<AutomationRecord[]>("automations");
  return automations.find((automation) => automation.id === id && (!userId || automation.userId === userId));
}

export async function getIntegrations(tenantId?: string) {
  if (hasDatabaseUrl()) {
    const prisma = getPrismaClient();
    const tenant =
      tenantId
        ? await prisma.tenant.findUnique({ where: { id: tenantId } })
        : await prisma.tenant.findFirst({ orderBy: { createdAt: "asc" } });

    if (!tenant) {
      return {
        whatsapp: {
          connected: false,
          label: "WhatsApp Business Cloud API",
          phoneNumberId: ""
        },
        instagram: {
          connected: false,
          label: "Instagram Messaging API",
          appId: ""
        },
        pix: {
          connected: false,
          label: "Mercado Pago / Asaas / Banco",
          provider: "mock"
        }
      };
    }

    const configs = await prisma.integrationConfig.findMany({ where: { tenantId: tenant.id } });

    const typedConfigs = configs as Array<{
      channel: string;
      connected: boolean;
      label: string;
      configJson: string;
    }>;
    const byChannel = new Map(typedConfigs.map((config) => [config.channel, config]));
    const whatsapp = byChannel.get("whatsapp");
    const instagram = byChannel.get("instagram");
    const pix = byChannel.get("pix");

    return {
      whatsapp: whatsapp
        ? { connected: whatsapp.connected, label: whatsapp.label, ...JSON.parse(whatsapp.configJson) }
        : {
            connected: false,
            label: "WhatsApp Business Cloud API",
            phoneNumberId: ""
          },
      instagram: instagram
        ? { connected: instagram.connected, label: instagram.label, ...JSON.parse(instagram.configJson) }
        : {
            connected: false,
            label: "Instagram Messaging API",
            appId: ""
          },
      pix: pix
        ? { connected: pix.connected, label: pix.label, ...JSON.parse(pix.configJson) }
        : {
            connected: false,
            label: "Mercado Pago / Asaas / Banco",
            provider: "mock"
          }
    };
  }

  return readCollection<LocalIntegrations>("integrations");
}

export async function updateIntegrations(input: LocalIntegrations, tenantId?: string) {
  if (hasDatabaseUrl()) {
    const prisma = getPrismaClient();
    const tenant =
      tenantId
        ? await prisma.tenant.findUnique({ where: { id: tenantId } })
        : await prisma.tenant.findFirst({ orderBy: { createdAt: "asc" } });

    if (!tenant) {
      throw new Error("Tenant não encontrado para salvar integrações.");
    }

    const entries = [
      {
        channel: "whatsapp",
        label: input.whatsapp.label,
        connected: input.whatsapp.connected,
        configJson: JSON.stringify({
          phoneNumberId: input.whatsapp.phoneNumberId,
          accessToken: input.whatsapp.accessToken || "",
          verifyToken: input.whatsapp.verifyToken || ""
        })
      },
      {
        channel: "instagram",
        label: input.instagram.label,
        connected: input.instagram.connected,
        configJson: JSON.stringify({
          appId: input.instagram.appId,
          accessToken: input.instagram.accessToken || "",
          verifyToken: input.instagram.verifyToken || ""
        })
      },
      {
        channel: "pix",
        label: input.pix.label,
        connected: input.pix.connected,
        configJson: JSON.stringify({
          provider: input.pix.provider,
          accessToken: input.pix.accessToken || ""
        })
      }
    ];

    for (const entry of entries) {
      await prisma.integrationConfig.upsert({
        where: {
          tenantId_channel: {
            tenantId: tenant.id,
            channel: entry.channel
          }
        },
        update: {
          label: entry.label,
          connected: entry.connected,
          configJson: entry.configJson
        },
        create: {
          tenantId: tenant.id,
          channel: entry.channel,
          label: entry.label,
          connected: entry.connected,
          configJson: entry.configJson
        }
      });
    }

    return input;
  }

  await writeCollection("integrations", input);
  return input;
}

export async function listExecutions(userId?: string) {
  if (hasDatabaseUrl()) {
    const prisma = getPrismaClient();
    const items = await prisma.execution.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: "desc" }
    });

    return (items as Array<{ createdAt: Date } & Record<string, unknown>>).map((item) => ({
      ...item,
      createdAt: item.createdAt.toISOString()
    }));
  }

  const items = await readCollection<ExecutionRecord[]>("executions");
  return userId ? items.filter((item) => item.userId === userId) : items;
}

export async function createExecution(input: ExecutionRecord) {
  if (hasDatabaseUrl() && input.userId && input.tenantId) {
    const prisma = getPrismaClient();
    const created = await prisma.execution.create({
      data: {
        tenantId: input.tenantId,
        userId: input.userId,
        automationId: input.automationId,
        automationName: input.automationName,
        channel: input.channel,
        contactName: input.contactName,
        recipient: input.recipient,
        status: input.status,
        preview: input.preview,
        createdAt: new Date(input.createdAt)
      }
    });

    return {
      ...created,
      createdAt: created.createdAt.toISOString()
    };
  }

  await appendItem("executions", input);
  return input;
}

export async function listScheduledJobs(userId?: string) {
  if (hasDatabaseUrl()) {
    const prisma = getPrismaClient();
    const jobs = await prisma.scheduledJob.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { scheduledFor: "asc" }
    });

    return (jobs as Array<{ scheduledFor: Date; createdAt: Date } & Record<string, unknown>>).map((job) => ({
      ...job,
      scheduledFor: job.scheduledFor.toISOString(),
      createdAt: job.createdAt.toISOString()
    }));
  }

  const items = await readCollection<ScheduledJobRecord[]>("scheduled-jobs");
  return userId ? items.filter((item) => item.userId === userId) : items;
}

export async function createScheduledJob(input: ScheduledJobRecord) {
  if (hasDatabaseUrl() && input.userId && input.tenantId) {
    const prisma = getPrismaClient();
    return prisma.scheduledJob.create({
      data: {
        tenantId: input.tenantId,
        userId: input.userId,
        automationId: input.automationId,
        automationName: input.automationName,
        channel: input.channel,
        contactName: input.contactName,
        recipient: input.recipient,
        message: input.message,
        scheduledFor: new Date(input.scheduledFor),
        status: input.status,
        createdAt: new Date(input.createdAt)
      }
    });
  }

  await appendItem("scheduled-jobs", input);
  return input;
}

export async function replaceScheduledJobs(items: ScheduledJobRecord[]) {
  if (hasDatabaseUrl()) {
    const prisma = getPrismaClient();

    for (const item of items) {
      if (!item.userId || !item.tenantId) {
        continue;
      }

      await prisma.scheduledJob.upsert({
        where: { id: item.id },
        update: {
          status: item.status,
          scheduledFor: new Date(item.scheduledFor),
          message: item.message
        },
        create: {
          id: item.id,
          tenantId: item.tenantId,
          userId: item.userId,
          automationId: item.automationId,
          automationName: item.automationName,
          channel: item.channel,
          contactName: item.contactName,
          recipient: item.recipient,
          message: item.message,
          scheduledFor: new Date(item.scheduledFor),
          status: item.status,
          createdAt: new Date(item.createdAt)
        }
      });
    }

    return items;
  }

  await writeCollection("scheduled-jobs", items);
  return items;
}

export async function getWorkerState() {
  return readCollection<WorkerStateRecord>("worker-state");
}
