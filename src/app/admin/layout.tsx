import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin/sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch user profile to check role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  // Strict role gate
  if (profile?.role !== "admin") {
    // If not an admin, send them to the regular student dashboard or home
    redirect("/account")
  }

  return (
    <div className="flex min-h-screen bg-field font-sans">
      <AdminSidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-canvas border-b border-hairline flex items-center px-6">
          <h2 className="text-body font-semibold">Admin Panel</h2>
        </header>
        <div className="p-6 flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
