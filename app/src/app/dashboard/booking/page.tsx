"use client";

import OnboardingWizard, { WizardStep } from "@/components/OnboardingWizard";
import { useBotConfig } from "@/hooks/useBotConfig";

const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "America/Anchorage",
  "Pacific/Honolulu",
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const DURATIONS = ["15 min", "30 min", "45 min", "60 min", "90 min", "2 hours"];

const STEPS: WizardStep[] = [
  {
    title: "Business info",
    render: (data, update) => (
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Business name</label>
          <input
            type="text"
            value={(data.businessName as string) ?? ""}
            onChange={(e) => update({ businessName: e.target.value })}
            placeholder="Acme Coffee Co."
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Timezone</label>
          <select
            value={(data.timezone as string) ?? ""}
            onChange={(e) => update({ timezone: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
          >
            <option value="">Select timezone...</option>
            {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Booking confirmation email</label>
          <input
            type="email"
            value={(data.confirmationEmail as string) ?? ""}
            onChange={(e) => update({ confirmationEmail: e.target.value })}
            placeholder="you@yourbusiness.com"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>
    ),
  },
  {
    title: "Your availability",
    render: (data, update) => {
      const activeDays = (data.activeDays as string[]) ?? ["Mon", "Tue", "Wed", "Thu", "Fri"];
      const openTime = (data.openTime as string) ?? "09:00";
      const closeTime = (data.closeTime as string) ?? "17:00";

      return (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-3">Days open</label>
            <div className="flex gap-2 flex-wrap">
              {DAYS.map((d) => {
                const active = activeDays.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() =>
                      update({
                        activeDays: active
                          ? activeDays.filter((x) => x !== d)
                          : [...activeDays, d],
                      })
                    }
                    className={`w-12 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      active
                        ? "bg-black text-white border-black"
                        : "border-gray-200 text-gray-500 hover:border-gray-400"
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Opens at</label>
              <input
                type="time"
                value={openTime}
                onChange={(e) => update({ openTime: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Closes at</label>
              <input
                type="time"
                value={closeTime}
                onChange={(e) => update({ closeTime: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Buffer between bookings</label>
            <select
              value={(data.buffer as string) ?? ""}
              onChange={(e) => update({ buffer: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
            >
              <option value="">None</option>
              <option value="5">5 minutes</option>
              <option value="10">10 minutes</option>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
            </select>
          </div>
        </div>
      );
    },
  },
  {
    title: "Your services",
    render: (data, update) => {
      type Service = { name: string; duration: string; price: string };
      const services = (data.services as Service[]) ?? [];
      const setServices = (next: Service[]) => update({ services: next });

      return (
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            Add the services customers can book. MojuBooking will offer these as options.
          </p>
          {services.map((svc, i) => (
            <div key={i} className="border border-gray-100 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-400">Service {i + 1}</span>
                <button
                  type="button"
                  onClick={() => setServices(services.filter((_, j) => j !== i))}
                  className="text-gray-300 hover:text-red-400 text-sm"
                >
                  ✕
                </button>
              </div>
              <input
                type="text"
                value={svc.name}
                onChange={(e) => {
                  const next = [...services];
                  next[i] = { ...next[i], name: e.target.value };
                  setServices(next);
                }}
                placeholder="Haircut & Style"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={svc.duration}
                  onChange={(e) => {
                    const next = [...services];
                    next[i] = { ...next[i], duration: e.target.value };
                    setServices(next);
                  }}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
                >
                  <option value="">Duration...</option>
                  {DURATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <input
                  type="text"
                  value={svc.price}
                  onChange={(e) => {
                    const next = [...services];
                    next[i] = { ...next[i], price: e.target.value };
                    setServices(next);
                  }}
                  placeholder="Price (e.g. $45)"
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setServices([...services, { name: "", duration: "", price: "" }])}
            className="w-full py-2.5 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors"
          >
            + Add service
          </button>
        </div>
      );
    },
  },
  {
    title: "Calendar sync",
    render: (data, update) => (
      <div className="space-y-5">
        <p className="text-sm text-gray-700">
          Connect Google Calendar so MojuBooking can check your availability in real time and add new bookings automatically.
        </p>
        <button
          type="button"
          onClick={() => update({ calendarConnected: true })}
          className={`w-full flex items-center justify-center gap-3 py-3 px-5 rounded-lg border text-sm font-medium transition-colors ${
            data.calendarConnected
              ? "bg-green-50 border-green-200 text-green-700"
              : "border-gray-200 text-gray-700 hover:border-gray-400"
          }`}
        >
          {data.calendarConnected ? (
            <>✓ Google Calendar connected</>
          ) : (
            <>
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Connect Google Calendar
            </>
          )}
        </button>
        {!!data.calendarConnected && (
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-sm text-green-700">
            New bookings will appear in your Google Calendar automatically. Customers will receive confirmation emails.
          </div>
        )}
        <div className="flex items-center justify-between py-3 border border-gray-100 rounded-lg px-4">
          <div>
            <p className="text-sm font-medium text-gray-800">Send SMS reminders</p>
            <p className="text-xs text-gray-600">Remind customers 24h and 1h before their booking</p>
          </div>
          <button
            type="button"
            onClick={() => update({ smsReminders: !data.smsReminders })}
            className={`w-11 h-6 rounded-full transition-colors ${data.smsReminders ? "bg-black" : "bg-gray-200"}`}
          >
            <span className={`block w-5 h-5 rounded-full bg-white shadow transition-transform mx-0.5 ${data.smsReminders ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 text-xs text-gray-500">
          Full Google OAuth launches with your subscription. SMS reminders require the Pro plan or above.
        </div>
      </div>
    ),
  },
];

type Service = { name: string; duration: string; price: string };

export default function MojuBookingPage() {
  const { config, loaded, reconfiguring, setReconfiguring, save, clear } = useBotConfig("booking");

  if (!loaded) return <div className="text-sm text-gray-400">Loading...</div>;

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📅 MojuBooking</h1>
          <p className="text-gray-500 mt-1">Handles appointment scheduling end-to-end, 24/7.</p>
        </div>
        {config && !reconfiguring && (
          <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">Active</span>
        )}
      </div>

      {config && !reconfiguring ? (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Configuration</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 block mb-0.5">Business</span>
                <span className="text-gray-900 font-medium">{config.businessName as string ?? "—"}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-0.5">Timezone</span>
                <span className="text-gray-900 font-medium">{config.timezone as string ?? "—"}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-0.5">Hours</span>
                <span className="text-gray-900 font-medium">
                  {config.openTime as string ?? "—"} – {config.closeTime as string ?? "—"}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block mb-0.5">Open days</span>
                <span className="text-gray-900 font-medium">
                  {((config.activeDays as string[]) ?? []).join(", ") || "—"}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500 block mb-0.5">Services</span>
                <span className="text-gray-900 font-medium">
                  {((config.services as Service[]) ?? []).map((s) => s.name).filter(Boolean).join(", ") || "—"}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block mb-0.5">Calendar</span>
                <span className="text-gray-900 font-medium">{config.calendarConnected ? "Connected" : "Not connected"}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-0.5">SMS reminders</span>
                <span className="text-gray-900 font-medium">{config.smsReminders ? "On" : "Off"}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setReconfiguring(true)}
              className="px-5 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reconfigure
            </button>
            <button
              onClick={() => void clear()}
              className="px-5 py-2 text-sm text-red-500 border border-red-100 rounded-lg hover:bg-red-50 transition-colors"
            >
              Deactivate
            </button>
          </div>
        </div>
      ) : (
        <OnboardingWizard
          steps={STEPS}
          onComplete={save}
          initialData={reconfiguring && config ? (config as Record<string, unknown>) : {}}
        />
      )}
    </div>
  );
}
