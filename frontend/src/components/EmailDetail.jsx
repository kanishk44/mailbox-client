import { format } from "date-fns";

const EmailDetail = ({ email, onClose }) => {
  if (!email) return null;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Email Header */}
      <div className="border-b border-gray-200">
        <div className="p-4">
          {/* Action Bar */}
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-full"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <button className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-full">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
            <button className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-full">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
            </button>
            <button className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-full">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </button>
          </div>

          {/* Email Subject */}
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            {email.subject}
          </h1>

          {/* Sender Info */}
          <div className="flex items-start">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
              {email.from[0].toUpperCase()}
            </div>
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {email.from}
                  </p>
                  <p className="text-sm text-gray-500">to {email.to}</p>
                </div>
                <p className="text-sm text-gray-500">
                  {format(new Date(email.sentAt), "MMM d, h:mm a")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: email.content }}
        />
      </div>
    </div>
  );
};

export default EmailDetail;
