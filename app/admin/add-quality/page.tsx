import { redirect } from "next/navigation";

export default async function AddQualityPage({
  searchParams,
}: {
  searchParams: Promise<{ batchId: string }>;
}) {
  const { batchId } = await searchParams;

  if (batchId) {
    redirect(`/admin/quality/${batchId}`);
  } else {
    redirect("/admin");
  }
}
