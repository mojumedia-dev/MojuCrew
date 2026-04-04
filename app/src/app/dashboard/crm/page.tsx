export default function MojuCRMPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">📋 MojuCRM</h1>
        <p className="text-gray-500 mt-1">AI CRM manager — logs interactions, follows up leads, manages pipeline.</p>
      </div>
      <div className="bg-white rounded-xl border p-8 text-center">
        <div className="text-4xl mb-4">📋</div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">MojuCRM is not yet activated</h2>
        <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
          MojuCRM automatically logs every customer interaction, sends follow-up emails and SMS, and keeps your pipeline organized — so nothing falls through the cracks.
        </p>
        <button className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">
          Activate MojuCRM
        </button>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {["Auto-logs all interactions", "Sends follow-up emails & SMS", "Weekly pipeline summary"].map((f) => (
          <div key={f} className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 border">✓ {f}</div>
        ))}
      </div>
    </div>
  );
}
