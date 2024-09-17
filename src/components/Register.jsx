import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useRegisterUserMutation } from '../containers/auth/authService';

const Register = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [registerUser, { isLoading, isSuccess, error, isError }] = useRegisterUserMutation();

  useEffect(() => {
    // redirect user to login page if registration was successful
    if (isSuccess) navigate('/login');
  }, [navigate, isSuccess]);

  const submitForm = (data) => {
    if (data.password !== data.confirmPassword) {
      alert('Password mismatch');
      return;
    }

    registerUser(data);
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <h5 className='form-title'>Sign Up</h5>
      <span hidden={!isError} className='error'>{error?.data?.message}</span>
      <div className='form-group'>
        <label htmlFor='firstName'></label>
        <input
          type='text'
          placeholder='&#926; Enter your first name'
          className='form-input'
          {...register('firstName')}
          required
        />
      </div>
      <div className='form-group'>
        <label htmlFor='firstName'></label>
        <input
          type='text'
          placeholder='&#926; Enter your last name'
          className='form-input'
          {...register('lastName')}
          required
        />
      </div>
      <div className='form-group'>
        <label htmlFor='email'></label>
        <input
          type='email'
          className='form-input'
          placeholder='&#9993; Enter your email'
          {...register('email')}
          required
        />
      </div>
      <div className='form-group'>
        <label htmlFor='password'></label>
        <input
          type='password'
          className='form-input'
          placeholder='&#128274; Enter your password'
          {...register('password')}
          required
        />
      </div>
      <div className='form-group'>
        <label htmlFor='confirmPassword'></label>
        <input
          type='password'
          className='form-input'
          placeholder='&#128274; Please confirm your password'
          {...register('confirmPassword')}
          required
        />
      </div>
      <button type='submit' className='button' disabled={isLoading}>
        {isLoading ? <span>spinner</span> : 'Register'}
      </button>
    </form>
  )
};

export default Register;
