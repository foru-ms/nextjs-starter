import Meta from "@/components/Meta";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import useForumsApi from "@/hooks/data/useForumsApi";
import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { useRouter } from "next/router";

const Login = ({ forumUser }) => {
    const [submittingState, setSubmittingState] = useState(false);
    const [resetSubmittingState, setResetSubmittingState] = useState(false);

    const router = useRouter();
  
    if (forumUser?.id){
      router.push(`/`);
    }

    const loginCommon = async (login, password) => {
        try {
            const response = await fetch('/api/auth/login', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                login,
                password,
              })
          });

          const data = await response.json();

          if (data) {
            if (data?.message) {
                 toast(data.message);
            } else if(data?.token) {
                toast.success('Login successful!');

                if (data?.token) {
                    Cookies.set('forumUserToken', data.token);
                } 

                router.push(`/`);
              }
            }
            setSubmittingState(false);
        } catch (error) {
            console.error('Error logging in:', error);
            setSubmittingState(false);
            toast.error('An error occurred while logging in.');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setSubmittingState(true);

        const username = e.target.username.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        
        try {
            const response = await fetch('/api/auth/register', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                username,
                email,
                password,
              })
          });
            if (response?.message) {
              toast(response.message);
            } else if (response?.id) {
                toast.success('Registration successful!');
                await loginCommon(email, password);
            }
            else {
                toast.error('An error occurred while registering.');
            }
        } catch (error) {
            console.error('Error registering:', error);
            setSubmittingState(false);
            toast.error('An error occurred while registering.');
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setSubmittingState(true);

        const login = e.target.login.value;
        const password = e.target.password.value;

        await loginCommon(login, password);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setResetSubmittingState(true);

        const email = e.target.email.value;

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                }),
            });
            const data = await response.json();
            if (data?.resetToken) {
              toast.custom((t) => (
                <div
  className={`${
    t.visible ? 'animate-enter' : 'animate-leave'
  } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
>
  <div className="flex-1 w-0 p-4">
    <div className="flex items-start">
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium text-gray-900">
          Please copy the reset token below:
        </p>
        <p className="mt-1 text-sm font-mono text-gray-700 bg-gray-100 p-2 rounded-md break-all">
          {data.resetToken}
        </p>
        <p className="mt-2 text-sm text-gray-900">
          <Link
            href="/reset-password"
            className="font-medium text-blue-600 hover:underline dark:text-blue-500"
          >
            Click here to reset your password using the token above
          </Link>
        </p>
      </div>
    </div>
  </div>
  <div className="flex border-gray-200">
    <button
      onClick={() => {
        navigator.clipboard.writeText(data.resetToken);
        toast.dismiss(t.id); // Optionally dismiss the toast after copying
        toast.success('Token copied to clipboard!');
        router.push(`/reset-password?token=${data.resetToken}`);
      }}
      className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      Copy Token
    </button>
  </div>
</div>
              ));
              
            } else {
                toast.success('Password reset token generated!');
            }
            setResetSubmittingState(false);
        } catch (error) {
            console.error('Error resetting password:', error);
            setResetSubmittingState(false);
            toast.error('An error occurred while resetting password.');
        }
    };

    return (
        <>
            <Meta title="Login" />
            <div className="flex flex-row w-full">
                <Sidebar data={forumUser} />
                <div className="flex flex-col lg:w-full items-center justify-center mx-auto md:h-screen lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h3 className="mb-5 text-gray-900 font-medium text-xl">Login</h3>
                            <form className="space-y-4 md:space-y-6" action="POST" onSubmit={handleLogin}>
                                <div>
                                    <label htmlFor="username-email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Username/Email
                                    </label>
                                    <input
                                        type="text"
                                        name="login"
                                        id="username-email"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="username/name@company.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="login-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="login-password"
                                        placeholder="••••••••"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-gray-800 text-sm  text-white rounded hover:bg-gray-600 transition duration-150 ease-in-out py-2 px-6"
                                    disabled={submittingState}
                                >
                                    Login
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-4 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h3 className="mb-5 text-gray-900 font-medium text-xl">Forgot password?</h3>
                            <form className="space-y-4 md:space-y-6" action="POST" onSubmit={handleResetPassword}>
                                <div>
                                    <label htmlFor="reset-email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="reset-email"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="name@company.com"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-blue-700 text-sm text-white rounded hover:bg-blue-600 transition duration-150 ease-in-out py-2 px-6"
                                    disabled={resetSubmittingState}
                                >
                                    Reset password
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col lg:w-full items-center justify-center mx-auto md:h-screen lg:py-0">
    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h3 className="mb-5 text-gray-900 font-medium text-xl">
          Create an account
        </h3>
        <form className="space-y-4 md:space-y-6" action="POST" onSubmit={handleRegister}>
          <div>
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="my_username"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="name@company.com"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                aria-describedby="terms"
                type="checkbox"
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                required
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="terms"
                className="font-light text-gray-500 dark:text-gray-300"
              >
                I accept the{" "}
                <Link
                  className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  href="#"
                >
                  Terms and conditions
                </Link>
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-700 text-sm text-white rounded hover:bg-blue-600 transition duration-150 ease-in-out py-2 px-6"
            disabled={submittingState}
            >
            Create account
          </button>
        </form>
      </div>
      </div>
      </div>
            </div>
        </>
    );
};

export async function getServerSideProps(context) {
  const api = useForumsApi();
  const { forumUserToken } = context.req.cookies;
  let forumUser = null;

  if (forumUserToken) {
      const userResponse = await api.fetchUser(forumUserToken);
      if (userResponse?.id) {
          forumUser = userResponse;
      }
  }
  
  return {
      props: {
          forumUser,
      }
  };
}

export default Login;
