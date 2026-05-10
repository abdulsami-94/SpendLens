import { supabaseAdmin } from "@/lib/supabase";
import Link from "next/link";

async function getDashboardData() {
  const [auditsRes, leadsRes] = await Promise.all([
    supabaseAdmin.from("audits").select("*").order("created_at", { ascending: false }),
    supabaseAdmin.from("leads").select("*").order("created_at", { ascending: false }),
  ]);

  return {
    audits: auditsRes.data || [],
    leads: leadsRes.data || [],
  };
}

export default async function DashboardPage() {
  const { audits, leads } = await getDashboardData();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Track audits and manage leads</p>
          </div>
          <Link href="/" className="text-blue-600 hover:underline">
            Back to Home
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              Recent Audits
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {audits.length}
              </span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-gray-500">
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">ID</th>
                    <th className="pb-2 font-medium text-right">Savings</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {audits.map((audit: any) => (
                    <tr key={audit.id} className="hover:bg-gray-50">
                      <td className="py-3 text-gray-500">
                        {new Date(audit.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3">
                        <Link href={`/audit/${audit.id}`} className="text-blue-600 font-mono hover:underline">
                          {audit.id.split("-")[0]}...
                        </Link>
                      </td>
                      <td className="py-3 text-right font-semibold text-green-600">
                        ${audit.results?.totalSavingsMonthly?.toFixed(0)}/mo
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
               Captured Leads
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                {leads.length}
              </span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-gray-500">
                    <th className="pb-2 font-medium">Email</th>
                    <th className="pb-2 font-medium">Type</th>
                    <th className="pb-2 font-medium">Company</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {leads.map((lead: any) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="py-3 font-medium">{lead.email}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            lead.type === "credex"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {lead.type}
                        </span>
                      </td>
                      <td className="py-3 text-gray-500">{lead.company || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
