export default function MojuBookingPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">📅 MojuBooking</h1>
        <p className="text-gray-500 mt-1">Handles appointment scheduling end-to-end, 24/7.</p>
      </div>
      <div className="bg-white rounded-xl border p-8 text-center">
        <div className="text-4xl mb-4">📅</div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">MojuBooking is not yet activated</h2>
        <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
          MojuBooking handles your entire scheduling workflow — customers book, reschedule, and cancel on their own. Integrates with Google Calendar and Calendly.
        </p>
        <button className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">Activate MojuBooking</button>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {["24/7 self-serve booking", "Auto-sends reminders", "Syncs with Google Calendar"].map((f) => (
          <div key={f} className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 border">✓ {f}</div>
        ))}
      </div>
    </div>
  );
}
