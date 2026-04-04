export default function MojuLeadsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">🎯 MojuLeads</h1>
        <p className="text-gray-500 mt-1">Drips follow-up sequences on cold leads automatically.</p>
      </div>
      <div className="bg-white rounded-xl border p-8 text-center">
        <div className="text-4xl mb-4">🎯</div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">MojuLeads is not yet activated</h2>
        <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
          MojuLeads keeps your leads warm automatically — it runs personalized email and SMS follow-up sequences so no opportunity goes cold while you&apos;re busy running your business.
        </p>
        <button className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">Activate MojuLeads</button>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {["Automated email & SMS sequences", "Personalizes each follow-up", "Notifies you when a lead replies"].map((f) => (
          <div key={f} className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 border">✓ {f}</div>
        ))}
      </div>
    </div>
  );
}
