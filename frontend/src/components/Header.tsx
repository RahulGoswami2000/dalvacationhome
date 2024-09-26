import { Link } from "react-router-dom";
function Header() {
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link to="/">DalVacation Home</Link>
        </h1>
        <div>
          <button className="bg-white text-blue-600 px-4 py-2 rounded mr-2">
            <Link to="/login">Login</Link>
          </button>
          <button className="bg-white text-blue-600 px-4 py-2 rounded">
            <Link to="/signup">Sign Up</Link>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
