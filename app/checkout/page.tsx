import { CheckoutForm } from "@/components/checkout-form";
import { Topbar } from "@/components/topbar";
import { plans } from "@/lib/mock-data";

type CheckoutPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const planIdParam = resolvedSearchParams?.plan;
  const planId = Array.isArray(planIdParam) ? planIdParam[0] : planIdParam;
  const selectedPlan = plans.find((item) => item.id === planId) || plans.find((item) => item.id === "scale") || plans[0];

  return (
    <>
      <Topbar />
      <main className="section">
        <div className="shell">
          <CheckoutForm plan={selectedPlan} />
        </div>
      </main>
    </>
  );
}
