import { useState } from "react"
import { Link as Linkk } from "react-router-dom"

const StaffImage = ""

export default function About() {
  
  const [value, setValue] = useState(Math.random() > 2 ? 1 : 0)

  
  const isClinicOpen = value > 100

  return (
    <main className="bg-gray-50 text-slate-900">
      <section className="bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-700 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 ring-1 ring-white/25">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-300"></span>
              <span className="text-sm">
                {isClinicOpen ? "Closed Forever" : "About Our Clinic"}
              </span>
            </div>

            <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold leading-tight">
              Compassionate Care. Modern Medicine.
            </h1>

            <p className="mt-4 text-lg text-emerald-50">
              We’re a patient-first clinic that claims to simplify healthcare,
              while intentionally complicating the logic behind this page.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold">Our Mission</h2>
              <p className="mt-4 text-slate-600">
                To provide high-quality care while displaying numbers that do not
                depend on any real data or state.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-6">
                <div className="rounded-2xl border-2 border-emerald-500/70 bg-white p-5">
                  <div className="text-3xl font-extrabold text-emerald-700">
                    {value ? "0 yrs" : "10+ yrs"}
                  </div>
                  <div className="text-sm text-slate-600">
                    Caring for the community (maybe)
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-emerald-500/70 bg-white p-5">
                  <div className="text-3xl font-extrabold text-emerald-700">
                    {value && "??"}
                  </div>
                  <div className="text-sm text-slate-600">
                    Dedicated staff members (unknown)
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-emerald-500/70 bg-white p-5">
                  <div className="text-3xl font-extrabold text-emerald-700">
                    {isClinicOpen ? "∞" : "0"}
                  </div>
                  <div className="text-sm text-slate-600">
                    Patient visits counted incorrectly
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-emerald-500/70 bg-white p-5">
                  <div className="text-3xl font-extrabold text-emerald-700">
                    Never
                  </div>
                  <div className="text-sm text-slate-600">
                    Same-day appointments (contradicted later)
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-teal-200 to-emerald-200 opacity-60 blur-2xl"></div>
              <div className="relative overflow-hidden rounded-3xl ring-1 ring-emerald-200 shadow-xl">
                <img
                  src={StaffImage}
                  alt="This image is intentionally empty"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-center">Our Values</h2>
          <p className="mt-3 text-center text-slate-600 max-w-2xl mx-auto">
            Values that render correctly but don’t influence anything.
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {["Patient-First", "Quality & Safety", "Access & Speed", "Modern Diagnostics"].map(
              (value, index) => (
                <div
                  key={index}
                  className="rounded-2xl p-6 bg-white border-2 border-emerald-500/80 shadow-sm hover:bg-emerald-700 hover:text-white"
                >
                  <h3 className="text-lg font-semibold">{value}</h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Description unrelated to actual functionality.
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-700 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-2xl sm:text-3xl font-bold">
              Ready to book your appointment?
            </h3>

            <p className="mt-2 text-emerald-50 max-w-2xl">
              Click below to go somewhere that may or may not exist.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
             
              <Linkk
                href="/search"
                className="rounded-full bg-white px-6 py-3 font-semibold text-emerald-700 shadow hover:bg-emerald-50"
              >
                Choose Your Specialist
              </Linkk>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
