import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faSearch, faFilter } from "@fortawesome/free-solid-svg-icons";

const orders = [
  {
    id: "#ORD-001",
    customer: "John Doe",
    email: "john@example.com",
    items: 3,
    total: "$74.97",
    date: "2024-01-15",
    status: "Completed",
  },
  {
    id: "#ORD-002",
    customer: "Jane Smith",
    email: "jane@example.com",
    items: 1,
    total: "$19.99",
    date: "2024-01-15",
    status: "Processing",
  },
  {
    id: "#ORD-003",
    customer: "Bob Johnson",
    email: "bob@example.com",
    items: 2,
    total: "$35.98",
    date: "2024-01-14",
    status: "Shipped",
  },
  {
    id: "#ORD-004",
    customer: "Alice Brown",
    email: "alice@example.com",
    items: 5,
    total: "$124.95",
    date: "2024-01-14",
    status: "Pending",
  },
  {
    id: "#ORD-005",
    customer: "Charlie Wilson",
    email: "charlie@example.com",
    items: 1,
    total: "$18.99",
    date: "2024-01-13",
    status: "Completed",
  },
  {
    id: "#ORD-006",
    customer: "Diana Ross",
    email: "diana@example.com",
    items: 4,
    total: "$89.96",
    date: "2024-01-13",
    status: "Cancelled",
  },
  {
    id: "#ORD-007",
    customer: "Edward King",
    email: "edward@example.com",
    items: 2,
    total: "$44.98",
    date: "2024-01-12",
    status: "Completed",
  },
  {
    id: "#ORD-008",
    customer: "Fiona Green",
    email: "fiona@example.com",
    items: 3,
    total: "$67.97",
    date: "2024-01-12",
    status: "Shipped",
  },
];

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Order History</h1>
        <p className="text-gray-500 mt-1">View and manage all orders</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by order ID or customer..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <FontAwesomeIcon icon={faFilter} className="w-4 h-4" />
            More Filters
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-800">
                  {order.id}
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {order.customer}
                    </p>
                    <p className="text-xs text-gray-500">{order.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {order.items} {order.items === 1 ? "item" : "items"}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-800">
                  {order.total}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      order.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Processing"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "Shipped"
                            ? "bg-purple-100 text-purple-700"
                            : order.status === "Cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Showing 1 to 8 of 856 orders</p>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Previous
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            1
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            2
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            3
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
