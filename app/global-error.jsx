'use client';

import React from 'react';
import Link from 'next/link';

export default function GlobalError({ error, reset }) {
    return (
        <html lang="en">
            <head>
                <title>Something Went Wrong!</title>
                <link rel="stylesheet" href="/styles/globals.css" />
            </head>
            <body>
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 text-center">
                    <h1 className="text-5xl font-bold mb-4">Oops! Something went wrong.</h1>
                    <p className="text-lg mb-6">We're really sorry, but an unexpected error occurred.</p>

                    {process.env.NODE_ENV === 'development' && (
                        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded relative mb-6 max-w-lg overflow-auto">
                            <strong className="font-bold">Error Details:</strong>
                            <p className="block sm:inline">{error.message}</p>
                            {/* Optional: Show stack trace in development */}
                            {/* <pre className="text-sm text-left whitespace-pre-wrap mt-2">{error.stack}</pre> */}
                        </div>
                    )}

                    <div className="space-x-4">
                        <button
                            onClick={() => reset()}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition duration-300"
                        >
                            Try Again
                        </button>
                        <Link href="/" className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-md shadow-md hover:bg-gray-200 dark:hover:bg-gray-800 transition duration-300">
                            Go to Homepage
                        </Link>
                    </div>

                    <p className="text-sm mt-8 text-gray-600 dark:text-gray-400">
                        If the problem persists, please contact support.
                    </p>
                </div>
            </body>
        </html>
    );
}