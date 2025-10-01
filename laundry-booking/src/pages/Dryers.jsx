import { Link } from "react-router-dom";

export default function Dryers() {
  const dryers = [1, 2, 3];
  return (
    <div>
      <h2>Сушильные машины</h2>
      <ul>
        {dryers.map((id) => (
          <li key={id}>
            <Link to={`/dryers/${id}`}>Сушильная машина №{id}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
