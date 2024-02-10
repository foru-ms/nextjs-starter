import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Meta from '@/components/Meta/index';
import Sidebar from '@/components/Sidebar/index';
import useForumsApi from '@/hooks/data/useForumsApi';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function NewThread() {
    const router = useRouter();

    const [isSubmitting, setSubmittingState] = useState(false);
    const [forumUser, setForumUser] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        body: '',
    });
    const api = useForumsApi();

    useEffect(() => {
        const getUser = async (token) => {
            const userResponse = await api.fetchUser(token);
            setForumUser(userResponse);
        };
            const forumUserToken = Cookies.get('forumUserToken');
            forumUserToken && getUser(forumUserToken);
    }, []);

    const onChange = (e) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setSubmittingState(true);
        try {
            const response = await api.createThread(
                formData.title,
                formData.body,
                forumUser?.id
            );
            setSubmittingState(false);
            if (response.errors) {
                Object.values(response.errors).forEach((error) =>
                    toast.error(error.msg)
                );
            } else {
                toast.success('Thread successfully created!');
                router.push(`/thread/${response.id}`);
            }
        } catch (error) {
            console.error('Error creating thread:', error);
            setSubmittingState(false);
            toast.error('An error occurred while creating the thread.');
        }
    };

    return (
        <>
            <Meta title="New thread" />
  <div class="flex flex-no-wrap">
    <Sidebar />
    <div class="flex flex-row w-full">
        <div class="flex flex-col lg:w-full items-center justify-center mx-auto md:h-screen lg:py-0">
          <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Post a new thread
                            </h1>
                            <form
                                className="space-y-4 md:space-y-6"
                                action="POST"
                                onSubmit={onSubmit}
                            >
                                <div>
                                    <label
                                        htmlFor="title"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Title
                                    </label>
                                    <input
                                        onChange={onChange}
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        id="title"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Thread title"
                                        required
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="body"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Body
                                    </label>
                                    <textarea
                                        onChange={onChange}
                                        name="body"
                                        id="body"
                                        rows="7"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Thread body"
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                    Submit post
                                </button>
                            </form>
                        </div>
                    </div>

                    <Link href="/" className="btn btn-outline btn-neutral btn-wide mt-5">
                        Back to the forums
                    </Link>
                </div>
                </div>
            </div>
        </>
    );
}