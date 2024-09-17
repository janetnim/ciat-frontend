import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../containers/auth/authSlice';

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className='header'>
      <div className='header-status'>
        <span>
          {user && `logged in as ${user?.firstName} ${user?.lastName}`}
        </span>
        <div className='cta'>
          {user && (
            <button className='button' onClick={onLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
      <nav className='container navigation'>
        <NavLink to='/' className='nav-link'>Home</NavLink>
        <NavLink to='/login' className='nav-link'>Login</NavLink>
        <NavLink to='/register' className='nav-link'>Sign Up</NavLink>
      </nav>
    </header>
  )
};

export default Header;
