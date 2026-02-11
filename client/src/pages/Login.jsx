import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaShieldAlt } from 'react-icons/fa';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(formData.email, formData.password);
            toast.success('Welcome back! 🎉');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: '60px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Floating Background Elements */}
            <motion.div
                style={{
                    position: 'absolute',
                    top: '10%',
                    left: '10%',
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255, 69, 58, 0.15), transparent)',
                    filter: 'blur(60px)',
                    zIndex: 0
                }}
                animate={{
                    y: [0, -30, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <motion.div
                style={{
                    position: 'absolute',
                    bottom: '10%',
                    right: '10%',
                    width: '400px',
                    height: '400px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(10, 132, 255, 0.15), transparent)',
                    filter: 'blur(80px)',
                    zIndex: 0
                }}
                animate={{
                    y: [0, 40, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <motion.div
                className="glass-panel"
                style={{
                    width: '100%',
                    maxWidth: '450px',
                    padding: '3rem 2.5rem',
                    position: 'relative',
                    zIndex: 1
                }}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                {/* Logo/Icon */}
                <motion.div
                    style={{ textAlign: 'center', marginBottom: '2rem' }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                    <div style={{
                        width: '80px',
                        height: '80px',
                        margin: '0 auto 1rem',
                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 30px rgba(255, 69, 58, 0.3)',
                        animation: 'float 3s ease-in-out infinite'
                    }}>
                        <FaShieldAlt size={40} color="white" />
                    </div>
                    <h2 style={{ fontSize: '2.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>
                        Welcome Back
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                        Sign in to continue to Guardian
                    </p>
                </motion.div>

                <form onSubmit={handleSubmit}>
                    <motion.div
                        className="input-group"
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <label style={{
                            display: 'block',
                            marginBottom: '0.75rem',
                            marginLeft: '0.5rem',
                            fontWeight: 500,
                            fontSize: '0.95rem'
                        }}>
                            <FaEnvelope style={{ marginRight: '0.5rem' }} />
                            Email Address
                        </label>
                        <input
                            type="email"
                            className="input-field"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </motion.div>

                    <motion.div
                        className="input-group"
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <label style={{
                            display: 'block',
                            marginBottom: '0.75rem',
                            marginLeft: '0.5rem',
                            fontWeight: 500,
                            fontSize: '0.95rem'
                        }}>
                            <FaLock style={{ marginRight: '0.5rem' }} />
                            Password
                        </label>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </motion.div>

                    <motion.button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '1.5rem', fontSize: '1.05rem' }}
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        {loading ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                                ⚡
                            </motion.div>
                        ) : (
                            'Sign In'
                        )}
                    </motion.button>
                </form>

                <motion.p
                    style={{
                        textAlign: 'center',
                        marginTop: '2rem',
                        color: 'var(--text-secondary)',
                        fontSize: '0.95rem'
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    Don't have an account?{' '}
                    <Link
                        to="/register"
                        style={{
                            color: 'var(--primary)',
                            fontWeight: 600,
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => e.target.style.color = 'var(--primary-hover)'}
                        onMouseLeave={(e) => e.target.style.color = 'var(--primary)'}
                    >
                        Create Account
                    </Link>
                </motion.p>
            </motion.div>
        </div>
    );
};

export default Login;
