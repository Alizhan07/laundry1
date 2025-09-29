import { Link } from "react-router-dom";

export default function Dryers() {
  const dryers = [1, 2];
  return (
    <div className="grid">
      {dryers.map((id) => (
        <Link key={id} to={`/dryer/${id}`} className="btn white">
          Сушильная {id}
        </Link>
      ))}
    </div>
  );
}
