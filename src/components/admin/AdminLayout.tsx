import { Link, Outlet } from "@tanstack/react-router";
import { FaChartBar, FaMapMarkerAlt, FaSignOutAlt, FaUsers } from "react-icons/fa";
import { useTheme } from "@/ui/theme-provider";
import { useAuth } from "./auth";
import { useState } from "react";

const LoginForm = ({ onLogin }: { onLogin: (username: string, password: string) => void }) => {

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		const username = formData.get("username") as string;
		const password = formData.get("password") as string;
		console.log(username, password);
		onLogin(username, password);
	};

	return (
		<form onSubmit={handleSubmit}>
			<input type="text" placeholder="Username" name="username" />
			<input type="password" placeholder="Passcode" name="password" />
			<button type="submit">Login</button>
		</form>
	);
};
const AdminLayout = () => {
	const { isAuthenticated, login, logout, user } = useAuth();
	const { isDarkMode } = useTheme();

	const menuItems = [
		{ icon: FaMapMarkerAlt, label: "Strikes", to: "/admin/strikes" },
		{ icon: FaUsers, label: "Users", to: "/admin/users" },
		{ icon: FaChartBar, label: "Analytics", to: "/admin/analytics" },
	];

	if (!isAuthenticated) {
		return (
			<div className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
				<div className={`w-96 p-8 rounded-lg shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
					<h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
					<LoginForm onLogin={(username, password) => {
						login(username, password);
					}} />
				</div>
			</div>
		);
	}

	return (
		<div
			className={`min-h-screen flex ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}
		>
			{/* Sidebar */}
			<aside
				className={`w-64 ${isDarkMode ? "bg-gray-800" : "bg-white"} p-4 shadow-lg`}
			>
				<div className="mb-8">
					<h1 className="text-xl font-bold">Admin Dashboard</h1>
				</div>
				<nav>
					<ul className="space-y-2">
						{menuItems.map((item) => (
							<li key={item.to}>
								<Link
									to={item.to}
									className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
                    ${
											isDarkMode
												? "hover:bg-gray-700 [&.active]:bg-gray-700"
												: "hover:bg-gray-100 [&.active]:bg-gray-200"
										}`}
								>
									<item.icon className="w-5 h-5" />
									<span>{item.label}</span>
								</Link>
							</li>
						))}
					</ul>
				<li className="mt-auto">
					<button
						onClick={logout}
						className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors w-full text-left
						${
							isDarkMode
								? "hover:bg-gray-700 text-red-400 hover:text-red-300"
								: "hover:bg-gray-100 text-red-600 hover:text-red-700"
						}`}
					>
						<FaSignOutAlt className="w-5 h-5" />
						<span>Logout</span>
					</button>
				</li>
				</nav>
			</aside>

			{/* Main Content */}
			<main className="flex-1 p-8">
				<Outlet />
			</main>
		</div>
	);
};

export default AdminLayout;
