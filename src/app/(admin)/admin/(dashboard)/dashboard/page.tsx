import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faShoppingCart,
  faDollarSign,
  faUsers,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";

const statsCards = [
  {
    title: "Total Books",
    value: "1,234",
    change: "+12%",
    trend: "up",
    icon: faBook,
    color: "bg-blue-500",
  },
  {
    title: "Total Orders",
    value: "856",
    change: "+8%",
    trend: "up",
    icon: faShoppingCart,
    color: "bg-green-500",
  },
  {
    title: "Revenue",
    value: "$45,678",
    change: "+23%",
    trend: "up",
    icon: faDollarSign,
    color: "bg-purple-500",
  },
  {
    title: "Customers",
    value: "2,345",
    change: "-3%",
    trend: "down",
    icon: faUsers,
    color: "bg-orange-500",
  },
];

const recentOrders = [
  {
    id: "#ORD-001",
    customer: "John Doe",
    book: "The Great Gatsby",
    amount: "$24.99",
    status: "Completed",
  },
  {
    id: "#ORD-002",
    customer: "Jane Smith",
    book: "1984",
    amount: "$19.99",
    status: "Processing",
  },
  {
    id: "#ORD-003",
    customer: "Bob Johnson",
    book: "To Kill a Mockingbird",
    amount: "$15.99",
    status: "Pending",
  },
  {
    id: "#ORD-004",
    customer: "Alice Brown",
    book: "Pride and Prejudice",
    amount: "$12.99",
    status: "Completed",
  },
  {
    id: "#ORD-005",
    customer: "Charlie Wilson",
    book: "The Catcher in the Rye",
    amount: "$18.99",
    status: "Shipped",
  },
];

const topSellingBooks = [
  { title: "The Great Gatsby", sales: 234, revenue: "$5,851" },
  { title: "1984", sales: 189, revenue: "$3,779" },
  { title: "To Kill a Mockingbird", sales: 156, revenue: "$2,494" },
  { title: "Pride and Prejudice", sales: 134, revenue: "$1,742" },
  { title: "The Catcher in the Rye", sales: 112, revenue: "$2,127" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card) => (
          <div key={card.title} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {card.value}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <FontAwesomeIcon
                    icon={card.trend === "up" ? faArrowUp : faArrowDown}
                    className={`w-3 h-3 ${card.trend === "up" ? "text-green-500" : "text-red-500"}`}
                  />
                  <span
                    className={`text-sm ${card.trend === "up" ? "text-green-500" : "text-red-500"}`}
                  >
                    {card.change}
                  </span>
                  <span className="text-sm text-gray-400">vs last month</span>
                </div>
              </div>
              <div
                className={`${card.color} p-4 rounded-full flex items-center justify-center`}
              >
                <FontAwesomeIcon
                  icon={card.icon}
                  className="w-6 h-6 text-white"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Recent Orders
            </h3>
          </div>
          <div className="overflow-x-auto">
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
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.amount}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          order.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Processing"
                              ? "bg-blue-100 text-blue-700"
                              : order.status === "Shipped"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Selling Books */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Top Selling Books
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topSellingBooks.map((book, index) => (
                <div
                  key={book.title}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {book.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {book.sales} sales
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    {book.revenue}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
