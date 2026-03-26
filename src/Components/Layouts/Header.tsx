import { ArrowLeft } from 'lucide-react';
import { useHeader } from '../../Shared/Context/HeaderContext';
import './Header.scss';

function Header() {
  const { title, subtitle, showBack, onBackClick, setPortalTarget } =
    useHeader();

  return (
    <header className="header">
      <div className="header-left">
        {showBack && (
          <button
            type="button"
            className="header-back-btn"
            onClick={onBackClick}
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <div className="header-title-group">
          <h1 className="header-title">{title}</h1>
          {subtitle && <p className="header-subtitle">{subtitle}</p>}
        </div>
      </div>
      <div className="header-right">
        {/* <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search anything..." />
        </div> */}

        <div className="header-actions">
          {/* Dynamic actions from views will be teleported here */}
          <div className="dynamic-actions" ref={setPortalTarget} />
        </div>
      </div>
    </header>
  );
}

export default Header;
