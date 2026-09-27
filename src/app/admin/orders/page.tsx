import { createClient } from "@/lib/supabase/server"
import { Search, Filter, CreditCard, Receipt } from "lucide-react"
import { formatCurrency } from "@/lib/currency"

export const metadata = {
  title: "Orders | Admin — Suffa",
  description: "Manage platform orders and payments.",
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const resolvedParams = await searchParams
  const query = resolvedParams.q
  const supabase = await createClient()

  let supabaseQuery = supabase
    .from("orders")
    .select("*, profiles!orders_student_id_fkey(full_name, email), courses(title)")
  
  if (query) {
    // If we want to search by student name or course title, we might need a view or RPC.
    // For now, we'll just sort it. If we wanted to search nested relations in supabase we'd need foreign data wrapper search or ilike on relations.
  }

  const { data: orders, error } = await supabaseQuery.order("created_at", { ascending: false })

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-heading-2 font-[652] tracking-tight mb-2">Orders</h1>
          <p className="text-body-sm text-text-muted font-[456]">View and manage all platform orders and payment statuses.</p>
        </div>
      </div>

      <div className="bg-canvas border border-hairline-soft rounded-md shadow-sm overflow-hidden flex flex-col">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-hairline-soft flex items-center gap-4 bg-canvas-soft/30">
          <form className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              name="q"
              placeholder="Search orders (Visual Only)..." 
              defaultValue={query}
              className="w-full pl-9 pr-4 py-2 bg-canvas border border-hairline-soft rounded-sm text-body-sm outline-none focus:border-ink transition-colors font-[456]"
            />
          </form>
          <button className="flex items-center gap-2 px-4 py-2 bg-canvas border border-hairline-soft rounded-sm text-body-sm text-ink hover:bg-canvas-soft transition-colors font-[456]">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-body-sm whitespace-nowrap">
            <thead className="bg-canvas-soft/50 border-b border-hairline-soft text-text-muted text-caption uppercase tracking-wider font-[600]">
              <tr>
                <th className="py-4 px-6 font-[600]">Transaction</th>
                <th className="py-4 px-6 font-[600]">Student</th>
                <th className="py-4 px-6 font-[600]">Course</th>
                <th className="py-4 px-6 font-[600]">Amount</th>
                <th className="py-4 px-6 font-[600]">Status</th>
              </tr>
            </thead>
            <tbody>
              {error ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-[#ef4444] font-[600]">
                    Failed to load orders: {error.message}
                  </td>
                </tr>
              ) : !orders || orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-text-muted">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-canvas-soft border border-hairline flex items-center justify-center mb-3">
                        <Receipt className="w-5 h-5 text-text-muted opacity-50" />
                      </div>
                      <p className="text-body font-[600] text-ink mb-1">No orders yet</p>
                      <p className="text-body-sm font-[456]">Orders will appear here when students purchase courses.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order: any) => (
                  <tr key={order.id} className="border-b border-hairline-soft last:border-0 hover:bg-canvas-soft/40 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-caption font-[600] text-ink uppercase tracking-wider">{order.id.split('-')[0]}</span>
                        <span className="text-caption text-text-muted font-[456]">{new Date(order.created_at).toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-body-sm font-[600] text-ink">{order.profiles?.full_name || "Unknown"}</span>
                        <span className="text-caption text-text-muted font-[456]">{order.profiles?.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-body-sm text-text-muted font-[456] truncate max-w-[200px]">
                      {order.courses?.title || "—"}
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-body-sm font-[600] text-ink flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-text-muted" />
                        {formatCurrency(order.amount)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-caption font-[600] tracking-wide uppercase ${
                        order.status === 'completed' 
                          ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20' 
                          : order.status === 'pending'
                          ? 'bg-canvas-soft text-text-muted border border-hairline-soft'
                          : 'bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        {orders && orders.length > 0 && (
          <div className="p-4 border-t border-hairline-soft bg-canvas flex items-center justify-between text-body-sm text-text-muted font-[456]">
            <span>Showing {orders.length} orders</span>
            <div className="flex gap-2">
              <button disabled className="px-3 py-1 rounded-sm border border-hairline-soft opacity-50 cursor-not-allowed">Previous</button>
              <button disabled className="px-3 py-1 rounded-sm border border-hairline-soft opacity-50 cursor-not-allowed">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
