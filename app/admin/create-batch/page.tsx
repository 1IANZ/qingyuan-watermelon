
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import CreateForm from "./CreateForm.client";

export default async function CreateBatchPage() {

  const [varieties, locations] = await Promise.all([
    db.base_varieties.findMany({
      orderBy: { name: 'asc' }
    }),
    db.base_locations.findMany({
      orderBy: { name: 'asc' }
    })
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="flex items-center mb-6">
        <Link href="/admin">
          <Button variant="ghost" size="icon" className="-ml-2 mr-1 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">新建种植批次</h1>
      </div>

      <div className="max-w-md mx-auto">
        <CreateForm varieties={varieties} locations={locations} />
      </div>
    </div>
  );
}