import React, { useEffect, useMemo, useState } from "react";
import api from "../api";
import useLogout from "../hooks/useLogout";
import { getAccessToken, getUser } from "../auth";
import { useNavigate } from "react-router-dom";

const fmt = (v) => (v ? new Date(v).toLocaleString() : "");

const ALL_SLOTS = (() => {
  const out = [];
  for (let h = 8; h < 16; h++) {
    out.push(`${String(h).padStart(2, "0")}:00`);
    out.push(`${String(h).padStart(2, "0")}:30`);
  }
  return out;
})();

function isWeekend(dateStr) {
  if (!dateStr) return false;
  const d = new Date(`${dateStr}T00:00:00`);
  const wd = d.getDay(); // 0=Sun, 6=Sat
  return wd === 0 || wd === 6;
}

function toMySQLFromParts(dateStr, hhmm) {
  if (!dateStr || !hhmm) return null;
  const hasSec = hhmm.length > 5 ? hhmm : `${hhmm}:00`;
  return `${dateStr} ${hasSec}`;
}
export default function PatientDashboard() {
  const logout = useLogout();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  // me & prefilled email
  const [me, setMe] = useState(null);
  const [email, setEmail] = useState("");

  // patient fields (manually filled by the user)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [dob, setDob]             = useState(""); // YYYY-MM-DD
  const [gender, setGender]       = useState("");
  const [phone, setPhone]         = useState("");
  const [reason, setReason]       = useState("");

  const fullName = useMemo(() => {
    const v = `${firstName || ""} ${lastName || ""}`.trim();
    return v || null;
  }, [firstName, lastName]);

  // doctors & booking slots
  const [doctors, setDoctors] = useState([]); // [{id,name,specialty,city,...}]
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [date, setDate] = useState(""); // "YYYY-MM-DD"
  const [booked, setBooked] = useState([]); // ["08:30", ...]
  const [selectedTime, setSelectedTime] = useState(""); // "HH:mm"
  const availableSlots = useMemo(
    () => ALL_SLOTS.filter((t) => !booked.includes(t)),
    [booked]
  );

  const [creating, setCreating] = useState(false);

  // history + search
  const [appointments, setAppointments] = useState([]);
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return appointments;
    return appointments.filter((a) =>
      [
        a.reason,
        a.status,
        String(a.doctor_id ?? a.doctorId),
        a.doctor_name,
        fmt(a.scheduled_at || a.datetime),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [appointments, q]);


    useEffect(() => {
    const hasAT = !!getAccessToken();
    const role = (getUser()?.role || "").toUpperCase();
     if (!hasAT || role !== "PATIENT") {
      navigate("/login", { replace: true });
     }
    }, [navigate]);


  // initial load
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        // who am I?
        const { data: meRes } = await api.get("/me");
        setMe(meRes.user);

        // prefill email from /patients/me or /me
        try {
          const { data: prof } = await api.get("/patients/me");
          setEmail(prof?.email || meRes?.user?.email || "");
        } catch {
          setEmail(meRes?.user?.email || "");
        }

        // doctors list (public search)
        const { data: docsRes } = await api.get("/doctors/search");
        setDoctors(Array.isArray(docsRes?.items) ? docsRes.items : []);

        // my appointments
        const { data: appts } = await api.get("/patients/me/appointments");
        setAppointments(Array.isArray(appts) ? appts : []);
        setErr("");
      } catch (e) {
        setErr(e?.response?.data?.message || "Invalid token");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    setSelectedTime("");
    if (!selectedDoctorId || !date || isWeekend(date)) {
      setBooked([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get(
          `/appointments/doctor/${selectedDoctorId}/booked`,
          { params: { date } }
        );
        if (!cancelled) {
          const times = Array.isArray(data?.booked) ? data.booked : [];
          setBooked(times);
        }
      } catch {
        if (!cancelled) setBooked([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedDoctorId, date]);

  async function createAppointment(e) {
    e.preventDefault();
    setErr("");
    setOk("");

    const canSubmit =
      !!selectedDoctorId &&
      !!date &&
      !isWeekend(date) &&
      !!selectedTime &&
      !!firstName &&
      !!lastName;

    if (!canSubmit) return;

    setCreating(true);
    try {
      const payload = {
        doctor_id: Number(selectedDoctorId),
        scheduled_at: toMySQLFromParts(date, selectedTime),
        reason: reason || null,
        patient: {
          first_name: firstName || null,
          last_name : lastName || null,
          name      : fullName,,
          email     : email || null, // prefilled
          phone     : phone || null,
          gender    : gender || null,
        },
      };


      // UI: optimistically mark the slot as taken
      setBooked((prev) => Array.from(new Set([...prev, selectedTime])));
      setSelectedTime("");

      setOk("✅ Appointment saved successfully.");

      // refresh history
      const { data: appts } = await api.get("/patients/me/appointments");
      setAppointments(Array.isArray(appts) ? appts : []);
    } catch (e) {
      const s = e?.response?.status;
      if (s === 409) setErr("This timeslot is taken for this doctor. Please choose another time.");
      else setErr(e?.response?.data?.message || "Could not save the appointment.");
    } finally {
      setCreating(false);
    }
  }
  return (
    <main className="min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-emerald-50 via-sky-50 to-white" />
        <div className="pointer-events-none absolute -top-16 -left-20 h-56 w-56 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-10 h-56 w-56 rounded-full bg-sky-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
          {/* Banner like the screenshot */}
          <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-600 text-white p-6 flex items-start justify-between shadow-sm">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {me?.email || "Patient"}
              </h1>
              <p className="mt-1 text-sm/6 opacity-95">Patient Dashboard</p>
              {me?.email ? <p className="text-sm/6 opacity-90">{me.email}</p> : null}
            </div>

            <button
              type="button"
              onClick={logout}
              className="rounded-lg bg-white/20 hover:bg-white/30 text-white px-4 py-2 text-sm font-medium border border-white/30 transition disabled:opacity-60"
              title="Log out"
              aria-label="Log out"
            >
              Log out
            </button>
          </div>

          {/* Status toast */}
          {(err || ok) && (
            <div
              className={[
                "mt-4 rounded-2xl px-4 py-3 text-sm shadow-sm border",
                err
                  ? "border-rose-200 bg-rose-50 text-rose-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700",
              ].join(" ")}
            >
              {err || ok}
            </div>
          )}
        </div>
      </section>