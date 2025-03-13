"use client";

export default function ApplicationsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Applications</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600 mb-4">
          Track and manage all your job applications in one place.
        </p>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Company</th>
                <th className="py-3 px-6 text-left">Position</th>
                <th className="py-3 px-6 text-left">Applied Date</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-6">Example Corp.</td>
                <td className="py-3 px-6">Software Engineer</td>
                <td className="py-3 px-6">March 5, 2025</td>
                <td className="py-3 px-6">
                  <span className="bg-yellow-100 text-yellow-800 py-1 px-3 rounded-full text-xs">
                    In Review
                  </span>
                </td>
                <td className="py-3 px-6">
                  <button className="text-blue-600 hover:text-blue-900">
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
