import { ScheduledJobRecord, createExecution, createScheduledJob, replaceScheduledJobs, listScheduledJobs } from "@/lib/repositories";
import { compileMessage, decodeTrigger } from "@/lib/automation-utils";
import { sendMetaMessageForTenant } from "@/lib/meta";

type DispatchInput = {
  userId?: string;
  tenantId?: string;
  automationId: string;
  automationName: string;
  trigger: string;
  primaryMessage: string;
  channel: string;
  recipient: string;
  contactName: string;
};

function isMissingMetaConfig(error: unknown) {
  return error instanceof Error && error.message.startsWith("Variavel ");
}

async function deliverMessage(channel: string, recipient: string, message: string, tenantId?: string) {
  if (channel === "whatsapp" || channel === "instagram") {
    try {
      const providerResponse = await sendMetaMessageForTenant({
        channel: channel === "instagram" ? "instagram" : "whatsapp",
        recipient,
        message,
        tenantId
      });

      const data = await providerResponse.json();

      return {
        ok: providerResponse.ok,
        status: providerResponse.ok ? "sent" : "provider_error",
        providerResponse: data
      };
    } catch (error) {
      if (!isMissingMetaConfig(error)) {
        throw error;
      }
    }
  }

  return {
    ok: true,
    status: "mock_sent",
    providerResponse: null
  };
}

export async function dispatchAutomation(input: DispatchInput) {
  const details = decodeTrigger(input.trigger);
  const primaryMessage = compileMessage(input.primaryMessage, input.contactName);
  const effectiveChannel = details.actionType === "handoff_whatsapp" ? "whatsapp" : input.channel;

  const delivery = await deliverMessage(effectiveChannel, input.recipient, primaryMessage, input.tenantId);

  await createExecution({
    id: `execution_${Date.now()}`,
    tenantId: input.tenantId,
    userId: input.userId,
    automationId: input.automationId,
    automationName: input.automationName,
    channel: effectiveChannel,
    contactName: input.contactName,
    recipient: input.recipient,
    status: delivery.status,
    preview: primaryMessage,
    createdAt: new Date().toISOString()
  });

  if (details.secondMessage) {
    const delayMinutes = details.delayMinutes || 0;
    const scheduledFor = new Date(Date.now() + delayMinutes * 60000).toISOString();

    await createScheduledJob({
      id: `job_${Date.now()}`,
      tenantId: input.tenantId,
      userId: input.userId,
      automationId: input.automationId,
      automationName: input.automationName,
      channel: effectiveChannel,
      contactName: input.contactName,
      recipient: input.recipient,
      message: compileMessage(details.secondMessage, input.contactName),
      scheduledFor,
      status: "pending",
      createdAt: new Date().toISOString()
    });
  }

  return {
    ...delivery,
    preview: `[${effectiveChannel}] ${primaryMessage}`
  };
}

export async function processDueJobs() {
  const jobs = await listScheduledJobs() as ScheduledJobRecord[];
  const now = Date.now();
  let processed = 0;
  const updatedJobs = [...jobs];

  for (let index = 0; index < updatedJobs.length; index += 1) {
    const job = updatedJobs[index];

    if (job.status !== "pending" || new Date(job.scheduledFor).getTime() > now) {
      continue;
    }

    const delivery = await deliverMessage(job.channel, job.recipient, job.message, job.tenantId);

    await createExecution({
      id: `execution_${Date.now()}_${index}`,
      tenantId: job.tenantId,
      userId: job.userId,
      automationId: job.automationId,
      automationName: `${job.automationName} - 2a etapa`,
      channel: job.channel,
      contactName: job.contactName,
      recipient: job.recipient,
      status: delivery.status,
      preview: job.message,
      createdAt: new Date().toISOString()
    });

    updatedJobs[index] = {
      ...job,
      status: delivery.status === "provider_error" ? "error" : "processed"
    };
    processed += 1;
  }

  await replaceScheduledJobs(updatedJobs);

  return {
    processed,
    pending: updatedJobs.filter((job) => job.status === "pending").length
  };
}
