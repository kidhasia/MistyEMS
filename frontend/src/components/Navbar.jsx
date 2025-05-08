import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiMenu, FiX, FiLayout, FiPlusCircle, FiLogOut } from 'react-icons/fi';
import LOGOmisty from '../assets/LOGOmisty.png'; // Adjust the path based on your folder structure

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        toast(
            ({ closeToast }) => (
                <div className="flex flex-col gap-4">
                    <p className="text-gray-800 font-semibold">Do you want to logout?</p>
                    <div className="flex gap-4">
                        <button
                            className="bg-purple-600 text-white border-none py-2 px-4 rounded-lg hover:bg-purple-700"
                            onClick={() => {
                                localStorage.removeItem('authToken'); // Adjust based on your auth system
                                navigate('/login');
                                closeToast();
                            }}
                        >
                            Yes
                        </button>
                        <button
                            className="bg-gray-400 text-white border-none py-2 px-4 rounded-lg hover:bg-gray-500"
                            onClick={closeToast}
                        >
                            No
                        </button>
                    </div>
                </div>
            ),
            {
                position: 'top-center',
                autoClose: false,
                closeOnClick: false,
                draggable: false,
            }
        );
    };

    return (
        <>
            <button
                className="md:hidden fixed top-4 left-4 z-50 text-white text-2xl p-2 bg-purple-700 rounded-lg"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <FiX /> : <FiMenu />}
            </button>
            <nav
                className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-purple-800 to-purple-600 backdrop-blur-md border-r border-purple-700 p-6 flex flex-col gap-6 z-50 transition-transform duration-300 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0`}
            >
                <div className="flex items-center justify-center">
                    <img src={LOGOmisty} alt="Logo" className="h-24" />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `flex items-center gap-2 text-white text-lg font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:bg-purple-700 hover:-translate-y-0.5 ${
                                isActive ? 'bg-gradient-to-r from-purple-500 to-purple-700' : ''
                            }`
                        }
                        onClick={() => setIsOpen(false)}
                    >
                        <FiLayout /> Board
                    </NavLink>
                    <NavLink
                        to="/add-card"
                        className={({ isActive }) =>
                            `flex items-center gap-2 text-white text-lg font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:bg-purple-700 hover:-translate-y-0.5 ${
                                isActive ? 'bg-gradient-to-r from-purple-500 to-purple-700' : ''
                            }`
                        }
                        onClick={() => setIsOpen(false)}
                    >
                        <FiPlusCircle /> Add Card
                    </NavLink>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-white text-lg font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:bg-purple-700 hover:-translate-y-0.5"
                >
                    <FiLogOut /> Logout
                </button>
            </nav>
        </>
    );
};

export default Navbar;