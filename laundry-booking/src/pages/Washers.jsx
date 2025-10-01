import { Link } from "react-router-dom";

export default function Washers() {
  const washers = [1, 2, 3];
  return (
    <div>
      <h2>Стиральные машины</h2>
      <ul>
        {washers.map((id) => (
          <li key={id}>
            <Link to={`/washers/${id}`}>Стиральная машина №{id}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
