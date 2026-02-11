import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaShieldAlt } from 'react-icons/fa';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const { register } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return toast.error('Passwords do not match');
        }

        setLoading(true);
        try {
            await register({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password
            });
            toast.success('Account created successfully! 🎉');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: '80px',
            paddingBottom: '2rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Animated Background */}
            <motion.div
                style={{
                    position: 'absolute',
                    top: '5%',
                    right: '5%',
                    width: '350px',
                    height: '350px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(191, 90, 242, 0.2), transparent)',
                    filter: 'blur(70px)',
                    zIndex: 0
                }}
                animate={{
                    x: [0, 50, 0],
                    y: [0, -50, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <motion.div
                className="glass-panel"
                style={{
                    width: '100%',
                    maxWidth: '550px',
                    padding: '3rem 2.5rem',
                    position: 'relative',
                    zIndex: 1
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    style={{ textAlign: 'center', marginBottom: '2rem' }}
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div style={{
                        width: '70px',
                        height: '70px',
                        margin: '0 auto 1rem',
                        background: 'linear-gradient(135deg, var(--accent), var(--secondary))',
                        borderRadius: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 30px rgba(191, 90, 242, 0.3)',
                        animation: 'float 3s ease-in-out infinite'
                    }}>
                        <FaShieldAlt size={35} color="white" />
                    </div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 700 }}>
                        Join Guardian
                    </h2>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Create your account and stay protected
                    </p>
                </motion.div>

                <form onSubmit={handleSubmit}>
                    <motion.div
                        className="input-group"
                        initial={{ x: -30, opacity: 0 }}
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
                            <FaUser style={{ marginRight: '0.5rem' }} />
                            Full Name
                        </label>
                        <input
                            name="name"
                            type="text"
                            className="input-field"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </motion.div>

                    <motion.div
                        className="input-group"
                        initial={{ x: -30, opacity: 0 }}
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
                            <FaEnvelope style={{ marginRight: '0.5rem' }} />
                            Email Address
                        </label>
                        <input
                            name="email"
                            type="email"
                            className="input-field"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </motion.div>

                    <motion.div
                        className="input-group"
                        initial={{ x: -30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <label style={{
                            display: 'block',
                            marginBottom: '0.75rem',
                            marginLeft: '0.5rem',
                            fontWeight: 500,
                            fontSize: '0.95rem'
                        }}>
                            <FaPhone style={{ marginRight: '0.5rem' }} />
                            Phone Number
                        </label>
                        <input
                            name="phone"
                            type="tel"
                            className="input-field"
                            placeholder="Enter your phone number"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </motion.div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <motion.div
                            className="input-group"
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
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
                                name="password"
                                type="password"
                                className="input-field"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </motion.div>

                        <motion.div
                            className="input-group"
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.7 }}
                        >
                            <label style={{
                                display: 'block',
                                marginBottom: '0.75rem',
                                marginLeft: '0.5rem',
                                fontWeight: 500,
                                fontSize: '0.95rem'
                            }}>
                                Confirm
                            </label>
                            <input
                                name="confirmPassword"
                                type="password"
                                className="input-field"
                                placeholder="Confirm"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </motion.div>
                    </div>

                    <motion.button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '1.5rem', fontSize: '1.05rem' }}
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
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
                    transition={{ delay: 0.9 }}
                >
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        style={{
                            color: 'var(--primary)',
                            fontWeight: 600
                        }}
                    >
                        Sign In
                    </Link>
                </motion.p>
            </motion.div>
        </div>
    );
};

export default Register;
