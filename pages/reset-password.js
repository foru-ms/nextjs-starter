import Meta from "@/components/Meta";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import useForumsApi from "@/hooks/data/useForumsApi";
import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { useRouter } from "next/router";

const ResetPassword = ({ forumUser }) => {
    const [submittingState, setSubmittingState] = useState(false);

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

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setSubmittingState(true);

        const login = e.target.login.value;
        const password = e.target.password.value;

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: login,
                    password,
                    token: e.target.token.value || router.query.token || '',
                }),
            });
            const data = await response.json();
            if (data?.message) {
                toast(data.message);
                await loginCommon(login, password);
            } else {
                toast.error('An error occurred while resetting password.');
            }
            setSubmittingState(false);
        } catch (error) {
            console.error('Error resetting password:', error);
            setSubmittingState(false);
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
                            <h3 className="mb-5 text-gray-900 font-medium text-xl">Reset password</h3>
                            <form className="space-y-4 md:space-y-6" action="POST" onSubmit={handleResetPassword}>
                                <div>
                                    <label htmlFor="username-email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="login"
                                        id="username-email"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="name@company.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="login-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        New password
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
                                <div>
                                    <label htmlFor="reset-token" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Reset token
                                    </label>
                                    <textarea
                                        name="token"
                                        id="reset-token"
                                        placeholder="eY2j3k4l5m6n7o8p9q0r..."
                                        value={router.query.token || ''}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-blue-700 text-sm text-white rounded hover:bg-blue-600 transition duration-150 ease-in-out py-2 px-6"
                                    disabled={submittingState}
                                >
                                    Change password
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

export default ResetPassword;
