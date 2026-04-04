export default function MojuReviewsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">⭐ MojuReviews</h1>
        <p className="text-gray-500 mt-1">Monitor and respond to Google & Yelp reviews automatically.</p>
      </div>

      <div className="bg-white rounded-xl border p-8 text-center">
        <div className="text-4xl mb-4">⭐</div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">MojuReviews is not yet activated</h2>
        <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
          Connect your Google Business Profile and let MojuReviews handle responses, flag negatives, and nudge happy customers to leave reviews.
        </p>
        <button className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">
          Activate MojuReviews
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {["Auto-responds to reviews", "Flags negative reviews instantly", "Requests reviews from happy customers"].map((f) => (
          <div key={f} className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 border">✓ {f}</div>
        ))}
      </div>
    </div>
  );
}
