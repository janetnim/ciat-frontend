import { useSelector } from 'react-redux';
import { NavLink, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return (
      <div className='unauthorized'>
        <h5 className='page-title'>Unauthorized access</h5>
        <span>
          Please <NavLink to='/login'>Login</NavLink> or <NavLink to='/register'>Sign Up</NavLink> to gain access
        </span>
      </div>
    )
  }

  return <Outlet />;
};

export default ProtectedRoute;
