import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser, FiGrid, FiMenu, FiX } from 'react-icons/fi';

const brandPurple = '#5B21D9';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
    setIsMenuOpen(false);
  };

  const isLoggedIn = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  const navLinkClass = "text-gray-700 font-medium hover:text-gray-900 transition duration-150 block py-2";
  const mobileLinkClass = "text-gray-700 font-medium hover:text-white hover:bg-opacity-20 block px-4 py-3 rounded-lg transition duration-150";

  return (
    <header className="bg-white shadow-lg sticky top-0 z-20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          
          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            <img 
              src="https://i.ibb.co.com/MyHmCfRG/Gemini-Generated-Image-ju50q9ju50q9ju50-2.png" 
              alt="CourseMuster Logo" 
              className="h-8 w-auto"
            />
          </Link>
          
          <nav className="hidden md:block">
            <ul className="flex space-x-6 items-center">
              <li>
                <Link to="/" className={navLinkClass}>Home</Link>
              </li>
              <li>
                <Link to="/courses" className={navLinkClass}>Courses</Link>
              </li>
              
              {!isLoggedIn ? (
                <>
                  <li>
                    <Link to="/login" 
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition duration-150"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" 
                      style={{ backgroundColor: brandPurple }}
                      className="px-4 py-2 text-white rounded-lg font-medium shadow-md hover:opacity-90 transition duration-150"
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  {userRole && (
                    <li>
                      <Link 
                        to={`/dashboard/${userRole === 'admin' ? 'admin' : 'student'}`} 
                        className="flex items-center text-gray-700 font-medium hover:text-gray-900 transition duration-150"
                      >
                        Dashboard
                      </Link>
                    </li>
                  )}
                  
                  <li>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center text-white px-4 py-2 rounded-lg font-medium shadow-md hover:opacity-90 transition duration-150"
                      style={{ backgroundColor: brandPurple }}
                    >
                      <FiLogOut className="mr-1" />
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </nav>
          
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-800 focus:outline-none">
              {isMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>
          </div>

        </div>
      </div>

      <div 
        className={`md:hidden absolute w-full bg-white shadow-xl transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-screen opacity-100 py-4 border-t' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <ul className="flex flex-col space-y-2 px-6">
          <li>
            <Link to="/" className={mobileLinkClass} onClick={() => setIsMenuOpen(false)}>Home</Link>
          </li>
          <li>
            <Link to="/courses" className={mobileLinkClass} onClick={() => setIsMenuOpen(false)}>Courses</Link>
          </li>
          
          {!isLoggedIn ? (
            <>
              <li>
                <Link to="/login" 
                  className="w-full text-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition duration-150 block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" 
                  style={{ backgroundColor: brandPurple }}
                  className="w-full text-center px-4 py-3 text-white rounded-lg font-medium shadow-md hover:opacity-90 transition duration-150 block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </li>
            </>
          ) : (
            <>
              {userRole && (
                <li>
                  <Link 
                    to={`/dashboard/${userRole === 'admin' ? 'admin' : 'student'}`} 
                    className={mobileLinkClass}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiGrid className="inline mr-2" />
                    Dashboard
                  </Link>
                </li>
              )}
              
              <li>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left flex items-center text-gray-700 font-medium hover:text-white hover:bg-opacity-20 px-4 py-3 rounded-lg transition duration-150"
                >
                  <FiLogOut className="mr-2" />
                  Logout
                </button>
              </li>
              
              {isLoggedIn && (
                <li>
                  <button className={mobileLinkClass} onClick={() => setIsMenuOpen(false)}>
                    <FiUser className="inline mr-2" />
                    Profile
                  </button>
                </li>
              )}

            </>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;