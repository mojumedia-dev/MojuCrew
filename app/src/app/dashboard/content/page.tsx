export default function MojuContentPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">📣 MojuContent</h1>
        <p className="text-gray-500 mt-1">Social & content bot — drafts posts and keeps your brand active.</p>
      </div>
      <div className="bg-white rounded-xl border p-8 text-center">
        <div className="text-4xl mb-4">📣</div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">MojuContent is not yet activated</h2>
        <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
          MojuContent drafts social media posts, repurposes your content across channels, and responds to comments — keeping your brand active without the effort.
        </p>
        <button className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">
          Activate MojuContent
        </button>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {["Drafts social posts", "Repurposes content across channels", "Responds to comments & DMs"].map((f) => (
          <div key={f} className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 border">✓ {f}</div>
        ))}
      </div>
    </div>
  );
}
