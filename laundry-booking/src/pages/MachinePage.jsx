import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const modes = [
  { name: "Быстрый", duration: 40 },
  { name: "Деликатный", duration: 60 },
  { name: "Стандартный", duration: 90 },
  { name: "Интенсивный", duration: 120 },
];

export default function MachinePage() {
  const { type, id } = useParams();
  const machineKey = `${type}-${id}`;

  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({
    room: "",
    phone: "",
    mode: modes[0].name,
    time: "",
    password: "",
  });
  const [deletePassword, setDeletePassword] = useState("");

  // Загружаем брони при загрузке
  useEffect(() => {
    const saved = localStorage.getItem(machineKey);
    if (saved) setBookings(JSON.parse(saved));
  }, [machineKey]);

  // Сохраняем в localStorage при изменении
  useEffect(() => {
    localStorage.setItem(machineKey, JSON.stringify(bookings));
  }, [bookings, machineKey]);

  // Ежедневный сброс в 00:00
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        setBookings([]);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatPhone = (raw) => {
    let digits = raw.replace(/\D/g, "");
    if (digits.startsWith("8")) digits = "7" + digits.slice(1);
    if (!digits.startsWith("7")) digits = "7" + digits;
    if (digits.length > 11) digits = digits.slice(0, 11);

    return `+7 (${digits.slice(1, 4)}${digits.length >= 4 ? ")" : ""}${
      digits.length > 4 ? " " + digits.slice(4, 7) : ""
    }${digits.length > 7 ? "-" + digits.slice(7, 9) : ""}${
      digits.length > 9 ? "-" + digits.slice(9, 11) : ""
    }`;
  };

  const handleBook = (e) => {
    e.preventDefault();

    if (!form.password.trim()) {
      alert("Введите пароль для вашей брони (чтобы потом удалить её)");
      return;
    }

    const selectedMode = modes.find((m) => m.name === form.mode);
    const start = new Date(`2025-01-01T${form.time}`);
    const end = new Date(start.getTime() + selectedMode.duration * 60000);

    const overlap = bookings.some((b) => {
      const bMode = modes.find((m) => m.name === b.mode);
      const bStart = new Date(`2025-01-01T${b.time}`);
      const bEnd = new Date(bStart.getTime() + bMode.duration * 60000);
      return start < bEnd && end > bStart;
    });

    if (overlap) {
      alert("Это время уже занято!");
      return;
    }

    setBookings([...bookings, { ...form }]);
    setForm({
      room: "",
      phone: "",
      mode: modes[0].name,
      time: "",
      password: "",
    });
  };

  const handleDelete = (time) => {
    const booking = bookings.find((b) => b.time === time);
    if (!booking) return;

    if (deletePassword === "2025" || deletePassword === booking.password) {
      setBookings(bookings.filter((b) => b.time !== time));
      alert("Запись удалена!");
    } else {
      alert("Неверный пароль для удаления!");
    }
  };

  const findNearestFreeSlot = () => {
    const selectedMode = modes.find((m) => m.name === form.mode);
    const now = new Date();
    let candidate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes()
    );

    while (true) {
      const end = new Date(candidate.getTime() + selectedMode.duration * 60000);
      const overlap = bookings.some((b) => {
        const bMode = modes.find((m) => m.name === b.mode);
        const bStart = new Date(`2025-01-01T${b.time}`);
        const bEnd = new Date(bStart.getTime() + bMode.duration * 60000);
        return candidate < bEnd && end > bStart;
      });

      if (!overlap) {
        setForm({ ...form, time: candidate.toTimeString().slice(0, 5) });
        return;
      }
      candidate.setMinutes(candidate.getMinutes() + 5);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        {type === "washers" ? "Стиральная машина" : "Сушильная машина"} {id}
      </h1>

      <form onSubmit={handleBook} className="space-y-3">
        <input
          type="text"
          placeholder="Комната"
          value={form.room}
          onChange={(e) => setForm({ ...form, room: e.target.value })}
          required
          className="border p-2 rounded w-full"
        />

        <input
          type="tel"
          placeholder="+7 (___) ___-__-__"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: formatPhone(e.target.value) })}
          required
          className="border p-2 rounded w-full"
        />

        <select
          value={form.mode}
          onChange={(e) => setForm({ ...form, mode: e.target.value })}
          className="border p-2 rounded w-full"
        >
          {modes.map((m) => (
            <option key={m.name} value={m.name}>
              {m.name} ({m.duration} мин)
            </option>
          ))}
        </select>

        <input
          type="time"
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
          required
          className="border p-2 rounded w-full"
        />

        <input
          type="password"
          placeholder="Пароль для вашей брони"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          className="border p-2 rounded w-full"
        />

        <button
          type="button"
          onClick={findNearestFreeSlot}
          className="bg-yellow-400 p-2 rounded w-full"
        >
          Найти ближайшее свободное время
        </button>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full"
        >
          Забронировать
        </button>
      </form>

      <h2 className="mt-6 font-semibold">Текущие бронирования:</h2>
      <ul className="space-y-2 mt-2">
        {bookings.length === 0 && <li>Нет записей</li>}
        {bookings.map((b, i) => (
          <li key={i} className="border p-2 rounded flex justify-between">
            <span>
              {b.time} — {b.mode} ({b.room}, {b.phone})
            </span>
            <button
              onClick={() => handleDelete(b.time)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Удалить
            </button>
          </li>
        ))}
      </ul>

      <input
        type="password"
        placeholder="Введите пароль для удаления"
        value={deletePassword}
        onChange={(e) => setDeletePassword(e.target.value)}
        className="border p-2 rounded mt-3 w-full"
      />
    </div>
  );
}
