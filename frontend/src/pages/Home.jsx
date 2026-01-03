import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-extrabold text-primary-900 sm:text-5xl md:text-6xl">
        Welcome to PulseGen
      </h1>
      <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
        Seamless video uploading, sensitivity analysis, and streaming.
      </p>
      <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
        {user ? (
          <div className="rounded-md shadow">
            <Link to="/videos" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10">
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="rounded-md shadow">
            <Link to="/register" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10">
              Get Started
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
