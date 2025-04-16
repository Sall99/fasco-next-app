import { CreateAdminForm } from "@/components/ui/admin/create-admin-form";

export default function CreateAdminPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mx-auto max-w-md">
        <h1 className="mb-6 text-2xl font-bold">Create New Admin</h1>
        <div className="rounded-lg bg-white p-6 shadow">
          <CreateAdminForm />
        </div>
      </div>
    </div>
  );
}
