import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";

const salesStats = [
  {
    title: "Total Revenue",
    value: "$45,678",
    change: "+23%",
    trend: "up",
    period: "vs last month",
  },
  {
    title: "Average Order Value",
    value: "$53.35",
    change: "+8%",
    trend: "up",
    period: "vs last month",
  },
  {
    title: "Total Orders",
    value: "856",
    change: "+12%",
    trend: "up",
    period: "vs last month",
  },
  {
    title: "Refunds",
    value: "$1,234",
    change: "-15%",
    trend: "down",
    period: "vs last month",
  },
];

const monthlySales = [
  { month: "January", revenue: "$38,500", orders: 723, growth: "+5%" },
  { month: "December", revenue: "$42,300", orders: 801, growth: "+12%" },
  { month: "November", revenue: "$37,800", orders: 712, growth: "+3%" },
  { month: "October", revenue: "$36,700", orders: 689, growth: "-2%" },
  { month: "September", revenue: "$37,500", orders: 701, growth: "+7%" },
  { month: "August", revenue: "$35,100", orders: 658, growth: "+4%" },
];

const topCategories = [
  { category: "Fiction", sales: 456, revenue: "$12,345", percentage: 35 },
  { category: "Non-Fiction", sales: 312, revenue: "$9,876", percentage: 25 },
  { category: "Romance", sales: 234, revenue: "$6,543", percentage: 18 },
  { category: "Mystery", sales: 189, revenue: "$5,432", percentage: 14 },
  { category: "Science Fiction", sales: 98, revenue: "$2,987", percentage: 8 },
];

export default function SalesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Sales Analytics</h1>
          <p className="text-gray-500 mt-1">
            Track your store performance and revenue
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <FontAwesomeIcon icon={faCalendar} className="w-4 h-4" />
            Last 30 Days
          </button>
        </div>
      </div>

      {/* Sales Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {salesStats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500">{stat.title}</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
            <div className="flex items-center gap-1 mt-2">
              <FontAwesomeIcon
                icon={stat.trend === "up" ? faArrowUp : faArrowDown}
                className={`w-3 h-3 ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}
              />
              <span
                className={`text-sm ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}
              >
                {stat.change}
              </span>
              <span className="text-sm text-gray-400">{stat.period}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Sales */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Monthly Sales
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Month
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Growth
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {monthlySales.map((month) => (
                  <tr key={month.month} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {month.month}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {month.revenue}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {month.orders}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-medium ${
                          month.growth.startsWith("+")
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {month.growth}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Sales by Category
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {topCategories.map((cat) => (
              <div key={cat.category}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {cat.category}
                    </p>
                    <p className="text-xs text-gray-500">
                      {cat.sales} sales · {cat.revenue}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    {cat.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${cat.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
