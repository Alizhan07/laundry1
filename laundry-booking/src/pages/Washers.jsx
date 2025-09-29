import { Link } from "react-router-dom";

export default function Washers() {
  const washers = Array.from({ length: 10 }, (_, i) => i + 1);
  return (
    <div className="grid">
      {washers.map((id) => (
        <Link key={id} to={`/washer/${id}`} className="btn white">
          Стиральная {id}
        </Link>
      ))}
    </div>
  );
}
