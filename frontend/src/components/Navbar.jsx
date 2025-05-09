import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiMenu, FiX, FiLayout, FiPlusCircle, FiBarChart2, FiLogOut } from 'react-icons/fi';
import LOGOmisty from '../assets/LOGOmisty.png';

const NavbarLink = ({ to, icon: Icon, label, isOpen, onClick }) => (
    <NavLink
        to={to}
        className="flex items-center text-white text-lg font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:bg-purple-700"
        onClick={onClick}
        aria-label={label}
    >
        <Icon className="text-2xl shrink-0" />
        <span
            className={`ml-4 transition-all duration-200 ${
                isOpen ? 'inline' : 'hidden md:group-hover:inline'
            }`}
        >
            {label}
        </span>
    </NavLink>
);

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Define routes that should show "Dashboard" and "Reports"
    const dashboardRoutes = ['/dashboard', '/reports', '/tasks/'];
    const isDashboardRoute = dashboardRoutes.some((route) =>
        route.includes('/tasks/') ? location.pathname.startsWith('/tasks/') : location.pathname === route
    );

    const handleLogout = () => {
        toast(({ closeToast }) => (
            <div className="flex flex-col gap-4">
                <p className="text-gray-800 font-semibold">Do you want to logout?</p>
                <div className="flex gap-4">
                    <button
                        className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
                        onClick={() => {
                            localStorage.removeItem('authToken');
                            navigate('/client/login');
                            closeToast();
                        }}
                    >
                        Yes
                    </button>
                    <button
                        className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500"
                        onClick={closeToast}
                    >
                        No
                    </button>
                </div>
            </div>
        ), {
            position: 'top-center',
            autoClose: false,
            closeOnClick: false,
            draggable: false,
        });
    };

    return (
        <>
            {/* Mobile menu toggle */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 text-white text-2xl p-2 bg-purple-700 rounded-lg"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
                {isOpen ? <FiX /> : <FiMenu />}
            </button>

            {/* Sidebar */}
            <nav
                role="navigation"
                className={`group fixed top-0 left-0 h-full bg-gradient-to-b from-purple-800 to-purple-600 border-r border-purple-700 z-50 transition-all duration-300 ${
                    isOpen ? 'w-64' : 'w-16'
                } md:hover:w-64 md:w-16`}
            >
                <div className="flex flex-col h-full p-4 md:p-2 gap-8">
                    {/* Logo */}
                    <div className="flex items-center justify-center">
                        <img src={LOGOmisty} alt="Logo" className="h-12" />
                    </div>

                    {/* Navigation */}
                    <div className="flex flex-col gap-2 flex-1">
                        {isDashboardRoute ? (
                            <>
                                <NavbarLink
                                    to="/dashboard"
                                    icon={FiLayout}
                                    label="Dashboard"
                                    isOpen={isOpen}
                                    onClick={() => setIsOpen(false)}
                                />
                                <NavbarLink
                                    to="/reports"
                                    icon={FiBarChart2}
                                    label="Reports"
                                    isOpen={isOpen}
                                    onClick={() => setIsOpen(false)}
                                />
                            </>
                        ) : (
                            <>
                                <NavbarLink
                                    to="/"
                                    icon={FiLayout}
                                    label="Board"
                                    isOpen={isOpen}
                                    onClick={() => setIsOpen(false)}
                                />
                                <NavbarLink
                                    to="/add-card"
                                    icon={FiPlusCircle}
                                    label="Add Card"
                                    isOpen={isOpen}
                                    onClick={() => setIsOpen(false)}
                                />
                            </>
                        )}
                    </div>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center text-white text-lg font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:bg-purple-700"
                        aria-label="Logout"
                    >
                        <FiLogOut className="text-2xl shrink-0" />
                        <span
                            className={`ml-4 transition-all duration-200 ${
                                isOpen ? 'inline' : 'hidden md:group-hover:inline'
                            }`}
                        >
                            Logout
                        </span>
                    </button>
                </div>
            </nav>
        </>
    );
};

export default Navbar;