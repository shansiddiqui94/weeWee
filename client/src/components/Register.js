import { Room } from "@material-ui/icons";
import "./register.css";

export default function Register() {
  return (
    <div className="registerContainer">
      <div className="logo">
        <Room />
      </div>
      <form>
        <input type="text" placeholder="username" />
        <input type="email" placeholder="email" />
        <input type="password" placeholder="password" />
        <button>Register</button>
      </form>
    </div>
  );
}
