import { useParams } from "react-router-dom";
import { useState } from "react";

export default function MachinePage() {
  const { type, id } = useParams(); // получаем тип и номер машины
  const [bookings, setBookings] = useState([]);

  const [room, setRoom] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [time, setTime] = useState("");
  const [mode, setMode] = useState("fast");

  // режимы машин и их продолжительность (в минутах)
  const modes = {
    fast: 40,
    delicate: 60,
    intensive: 90,
  };

  // форматирование времени (минуты -> HH:MM)
  const formatTime = (minutes) => {
    const h = Math.floor(minutes / 60)
      .toString()
      .padStart(2, "0");
    const m = (minutes % 60).toString().padStart(2, "0");
    return `${h}:${m}`;
  };

  // перевод HH:MM -> минуты
  const parseTime = (str) => {
    const [h, m] = str.split(":").map(Number);
    return h * 60 + m;
  };

  // проверка, что выбранное время свободно
  const isAvailable = (start, duration) => {
    const end = start + duration;
    return !bookings.some(
      (b) =>
        (start >= b.start && start < b.end) || // пересекается с началом
        (end > b.start && end <= b.end) || // пересекается с концом
        (start <= b.start && end >= b.end) // полностью перекрывает
    );
  };

  // бронирование
  const handleBooking = () => {
    if (!room || !phone || !time || !password) {
      alert("Заполните все поля!");
      return;
    }

    const start = parseTime(time);
    const duration = modes[mode];
    const end = start + duration;

    if (!isAvailable(start, duration)) {
      alert("Это время занято!");
      return;
    }

    const newBooking = {
      room,
      phone,
      mode,
      start,
      end,
      password,
    };

    setBookings([...bookings, newBooking]);
    setRoom("");
    setPhone("");
    setTime("");
    setPassword("");
  };

  // удаление по паролю (2025 или пароль при брони)
  const handleDelete = (index) => {
    const inputPass = prompt("Введите пароль для удаления:");
    if (
      inputPass === "147258369" ||
      inputPass === bookings[index].password
    ) {
      const updated = bookings.filter((_, i) => i !== index);
      setBookings(updated);
    } else {
      alert("Неверный пароль!");
    }
  };

  // поиск ближайшего свободного времени
  const findNearest = () => {
    const duration = modes[mode];
    for (let t = 0; t < 24 * 60; t++) {
      if (isAvailable(t, duration)) {
        alert(
          `Ближайшее время: ${formatTime(t)} - ${formatTime(
            t + duration
          )}`
        );
        return;
      }
    }
    alert("Свободного времени нет!");
  };

  return (
    <div className="machine-page">
      <h2>
        {type === "washers"
          ? "Стиральная машина"
          : "Сушильная машина"}{" "}
        №{id}
      </h2>

      <div className="form">
        <input
          type="text"
          placeholder="Комната"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <input
          type="tel"
          placeholder="Телефон"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="fast">Быстрый (40 мин)</option>
          <option value="delicate">Деликатный (60 мин)</option>
          <option value="intensive">Интенсивный (90 мин)</option>
        </select>
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleBooking}>Забронировать</button>
        <button onClick={findNearest}>
          Найти ближайшее время
        </button>
      </div>

      <h3>Бронирования:</h3>
      <ul>
        {bookings.length === 0 && <li>Пока нет бронирований</li>}
        {bookings.map((b, i) => (
          <li key={i}>
            {formatTime(b.start)} - {formatTime(b.end)} |{" "}
            {b.mode} | комната {b.room} | {b.phone}{" "}
            <button onClick={() => handleDelete(i)}>
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

