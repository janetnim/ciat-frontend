import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useUserLoginMutation } from '../containers/auth/authService';

const Login = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [userLogin, { isLoading, isError, error, isSuccess }] = useUserLoginMutation();

  // redirect authenticated user to image loading page
  useEffect(() => {
    if (isSuccess) navigate('/');
  }, [navigate, isSuccess]);

  const submitForm = async (data) => {
    await userLogin(data).unwrap();
  }

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <h5 className='form-title'>Login</h5>
      <span hidden={!isError} className='error'>{error?.data?.message}</span>
      <div className='form-group'>
        <label htmlFor='email'></label>
        <input
          type='email'
          placeholder='&#9993; Enter your email'
          className='form-input'
          {...register('email')}
          required
        />
      </div>
      <div className='form-group'>
        <label htmlFor='password'></label>
        <input
          type='password'
          placeholder='&#128274; Enter your password'
          className='form-input'
          {...register('password')}
          required
        />
      </div>
      <button type='submit' className='button' disabled={isLoading}>
        {isLoading ? <span>spinner</span> : 'Login'}
      </button>
    </form>
  )
};

export default Login;
