import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import InputMask from "react-input-mask";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";

export default function MachinePage() {
  const { type, id } = useParams();
  const [bookings, setBookings] = useState([]);
  const [room, setRoom] = useState("");
  const [phone, setPhone] = useState("");
  const [mode, setMode] = useState("fast");
  const [startTime, setStartTime] = useState("");
  const [password, setPassword] = useState("");

  // Длительность режимов
  const modeDurations = {
    fast: 40,
    delicate: 60,
    normal: 90,
    intensive: 120,
  };

  // Загрузка броней из Firestore
  useEffect(() => {
    const fetchBookings = async () => {
      const querySnapshot = await getDocs(collection(db, "bookings"));
      const data = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((b) => b.type === type && b.machineId === id);
      setBookings(data);
    };
    fetchBookings();
  }, [type, id]);

  // Добавить бронь
  const handleBooking = async () => {
    if (!room || !phone || !startTime) {
      alert("Заполните все поля!");
      return;
    }

    const duration = modeDurations[mode];
    const start = new Date(startTime);
    const end = new Date(start.getTime() + duration * 60000);

    const booking = {
      type,
      machineId: id,
      room,
      phone,
      mode,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      password: password || "2025",
    };

    await addDoc(collection(db, "bookings"), booking);
    alert("Бронь добавлена!");
    window.location.reload();
  };

  // Удалить бронь
  const handleDelete = async (bookingId, bookingPassword) => {
    if (password === "2025" || password === bookingPassword) {
      await deleteDoc(doc(db, "bookings", bookingId));
      alert("Бронь удалена!");
      window.location.reload();
    } else {
      alert("Неверный пароль!");
    }
  };

  return (
    <div>
      <h2>
        {type === "washers" ? "Стиральная машина" : "Сушильная машина"} №{id}
      </h2>

      <h3>Текущие брони:</h3>
      <ul>
        {bookings.map((b) => (
          <li key={b.id}>
            {b.room}, {b.phone}, режим: {b.mode},{" "}
            {new Date(b.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}{" "}
            →{" "}
            {new Date(b.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            <button onClick={() => handleDelete(b.id, b.password)}>Удалить</button>
          </li>
        ))}
      </ul>

      <h3>Добавить бронь</h3>
      <input
        type="text"
        placeholder="Комната"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
      />
      <InputMask
        mask="+7-999-999-99-99"
        placeholder="+7-___-___-__-__"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <select value={mode} onChange={(e) => setMode(e.target.value)}>
        <option value="fast">Быстрый (40 мин)</option>
        <option value="delicate">Деликатный (60 мин)</option>
        <option value="normal">Обычный (90 мин)</option>
        <option value="intensive">Интенсивный (120 мин)</option>
      </select>
      <input
        type="datetime-local"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
      />
      <input
        type="password"
        placeholder="Пароль (по умолчанию 2025)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleBooking}>Забронировать</button>
    </div>
  );
}
