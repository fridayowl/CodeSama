import React from 'react';
import { Code, Search, Bell, User, Settings } from 'lucide-react';

const NavBarMinimal: React.FC = () => (
    <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-4">
                <Code size={24} className="text-indigo-600" />
                <span className="text-xl font-semibold text-gray-800">CodeSama</span>
            </div>
            <div className="flex items-center space-x-6">
                <Search size={20} className="text-gray-600 hover:text-indigo-600 cursor-pointer" />
                <Bell size={20} className="text-gray-600 hover:text-indigo-600 cursor-pointer" />
                <Settings size={20} className="text-gray-600 hover:text-indigo-600 cursor-pointer" />
                <User size={20} className="text-gray-600 hover:text-indigo-600 cursor-pointer" />
            </div>
        </div>
    </nav>
);

export default NavBarMinimal;