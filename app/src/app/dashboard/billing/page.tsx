export default function MojuBillingPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">💰 MojuBilling</h1>
        <p className="text-gray-500 mt-1">Sends invoices, chases payments, tracks what&apos;s overdue.</p>
      </div>
      <div className="bg-white rounded-xl border p-8 text-center">
        <div className="text-4xl mb-4">💰</div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">MojuBilling is not yet activated</h2>
        <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
          MojuBilling automates your entire billing cycle — sends invoices, follows up on unpaid ones, and alerts you when payments are overdue. Stop chasing money manually.
        </p>
        <button className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">Activate MojuBilling</button>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {["Auto-sends invoices", "Chases overdue payments", "Tracks payment status"].map((f) => (
          <div key={f} className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 border">✓ {f}</div>
        ))}
      </div>
    </div>
  );
}
