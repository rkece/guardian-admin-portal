import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaShieldAlt, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="glass-panel" style={{
            position: 'fixed',
            top: '1rem',
            left: '1rem',
            right: '1rem',
            zIndex: 1000,
            padding: '0.75rem 2rem'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                    <FaShieldAlt />
                    <span>Guardian</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Admin Portal</span>
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    {user ? (
                        <>
                            <Link to="/dashboard" style={{ fontWeight: 500 }}>Dashboard</Link>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FaUserCircle size={24} />
                                <span>{user.name}</span>
                            </div>
                            <button onClick={handleLogout} className="btn btn-glass" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                                <FaSignOutAlt />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={{ fontWeight: 500 }}>Login</Link>
                            <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
