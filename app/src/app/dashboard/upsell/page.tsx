export default function MojuUpsellPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">📈 MojuUpsell</h1>
        <p className="text-gray-500 mt-1">Identifies past customers and pitches relevant offers.</p>
      </div>
      <div className="bg-white rounded-xl border p-8 text-center">
        <div className="text-4xl mb-4">📈</div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">MojuUpsell is not yet activated</h2>
        <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
          MojuUpsell mines your existing customer base for repeat business — it identifies customers who are due for a follow-up and sends them the right offer at the right time.
        </p>
        <button className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">Activate MojuUpsell</button>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {["Finds re-engagement opportunities", "Sends targeted offers", "Tracks conversion rate"].map((f) => (
          <div key={f} className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 border">✓ {f}</div>
        ))}
      </div>
    </div>
  );
}
