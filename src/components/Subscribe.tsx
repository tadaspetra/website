import React, { useEffect, useState } from "react";
import { Resend } from "resend";

interface SubscribeProps {
  apiKey: string;
  audienceId: string;
}

const Subscribe: React.FC<SubscribeProps> = ({ apiKey, audienceId }) => {
  const [email, setEmail] = useState("");
  const [storedEmail, setStoredEmail] = useState<string | null>(
    "tadas@tadaspetra.com"
  );
  const resend = new Resend(apiKey);

  useEffect(() => {
    //retrieve email from cookies
    const email = localStorage.getItem("resend-email");

    if (email) {
      console.log("email", email);
      setStoredEmail(email);
    } else {
      console.log("no email");
      setStoredEmail(null);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await fetch(`/api/resend?email=${email}`, {
      method: "POST",
    });

    //set email to cookies
    localStorage.setItem("resend-email", email);
    setStoredEmail(email);
  };

  return (
    storedEmail == null && (
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-md sm:text-center">
            <h2 className="mb-4 text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl dark:text-white">
              Sign up for updates
            </h2>
            <p className="mx-auto mb-8 max-w-2xl font-light text-gray-500 md:mb-12 sm:text-xl dark:text-gray-400">
              Receive new articles and other content directly in your inbox.
            </p>
            <form onSubmit={handleSubmit} method="POST">
              <div className="items-center mx-auto mb-3 space-y-4 max-w-screen-sm sm:flex sm:space-y-0">
                <div className="relative w-full dark:bg-gray-800">
                  <label
                    htmlFor="email"
                    className="hidden mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Email address
                  </label>
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                  </div>
                  <input
                    className="block p-3 pl-10 w-full text-sm text-skin-default bg-gray-50 rounded-lg border border-gray-300 sm:rounded-none sm:rounded-l-lg focus:ring-primary-500 focus:border-primary-500 dark:border-gray-600 dark:placeholder-gray-400 dark:bg-skin-fill dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Enter your email"
                    type="email"
                    id="email"
                    required={true}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="py-3 px-5 w-full text-sm font-medium text-center text-white rounded-lg border cursor-pointer bg-primary-700 border-primary-600 sm:rounded-none sm:rounded-r-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    )
  );
};

export default Subscribe;
