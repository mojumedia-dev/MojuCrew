export default function MojuEmailPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">✉️ MojuEmail</h1>
        <p className="text-gray-500 mt-1">Writes and schedules newsletters and campaign sequences.</p>
      </div>
      <div className="bg-white rounded-xl border p-8 text-center">
        <div className="text-4xl mb-4">✉️</div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">MojuEmail is not yet activated</h2>
        <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
          MojuEmail keeps your customer list engaged — it writes, schedules, and sends newsletters and promotional campaigns, tailored to your brand voice.
        </p>
        <button className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">Activate MojuEmail</button>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {["Writes campaigns in your brand voice", "Schedules and sends automatically", "Tracks open & click rates"].map((f) => (
          <div key={f} className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 border">✓ {f}</div>
        ))}
      </div>
    </div>
  );
}
