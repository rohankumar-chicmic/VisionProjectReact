import './navbar.scss';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../../Shared/Constants';

export function Navbar() {
  return (
    <header className="header d-flex" id="header">
      <div>
        <Link to={ROUTES.HOMEPAGE}>Home page</Link>
      </div>
      <div>
        <Link to={ROUTES.LOGIN}>Login</Link>
      </div>
    </header>
  );
}

export default Navbar;
