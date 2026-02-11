import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaMapMarkedAlt, FaBell, FaUsers, FaChartLine, FaMobileAlt } from 'react-icons/fa';

const Home = () => {
    return (
        <div style={{ minHeight: '100vh', paddingTop: '100px', display: 'flex', flexDirection: 'column' }}>
            <header className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        style={{
                            fontSize: '5rem',
                            marginBottom: '1rem'
                        }}
                        animate={{
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        🛡️
                    </motion.div>

                    <h1 style={{ fontSize: '4.5rem', fontWeight: 900, marginBottom: '1.5rem', lineHeight: 1.1 }}>
                        Safety Reimagined <br />
                        <motion.span
                            style={{
                                background: 'linear-gradient(135deg, #FF453A 0%, #FF9F0A 50%, #0A84FF 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundSize: '200% 200%'
                            }}
                            animate={{
                                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        >
                            For Everyone
                        </motion.span>
                    </h1>

                    <motion.p
                        style={{
                            fontSize: '1.35rem',
                            color: 'var(--text-secondary)',
                            maxWidth: '700px',
                            margin: '0 auto 3rem',
                            lineHeight: 1.7
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Advanced women safety protection platform with real-time tracking,
                        hardware integration, and immediate emergency response.
                    </motion.p>

                    <motion.div
                        style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Link to="/register">
                            <motion.button
                                className="btn btn-primary"
                                style={{ fontSize: '1.15rem', padding: '1.2rem 2.5rem' }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Get Protected Now
                            </motion.button>
                        </Link>
                        <Link to="/login">
                            <motion.button
                                className="btn btn-glass"
                                style={{ fontSize: '1.15rem', padding: '1.2rem 2.5rem' }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Sign In
                            </motion.button>
                        </Link>
                    </motion.div>
                </motion.div>
            </header>

            <section className="container" style={{ padding: '4rem 1rem' }}>
                <motion.h2
                    style={{
                        textAlign: 'center',
                        fontSize: '2.5rem',
                        fontWeight: 800,
                        marginBottom: '3rem'
                    }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    Powerful Features
                </motion.h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem'
                }}>
                    <FeatureCard
                        icon={<FaShieldAlt size={45} />}
                        title="Instant Protection"
                        desc="Trigger alerts instantly via web or hardware device. Notifies police and family within seconds."
                        color="var(--primary)"
                        delay={0.1}
                    />
                    <FeatureCard
                        icon={<FaMapMarkedAlt size={45} />}
                        title="Live Tracking"
                        desc="Real-time GPS tracking with history. Share your live location with trusted contacts."
                        color="var(--secondary)"
                        delay={0.2}
                    />
                    <FeatureCard
                        icon={<FaBell size={45} />}
                        title="Smart Alerts"
                        desc="Intelligent notification system that finds the nearest help centers automatically."
                        color="var(--accent)"
                        delay={0.3}
                    />
                    <FeatureCard
                        icon={<FaUsers size={45} />}
                        title="Emergency Contacts"
                        desc="Manage trusted contacts who will be notified immediately during emergencies."
                        color="#30D158"
                        delay={0.4}
                    />
                    <FeatureCard
                        icon={<FaChartLine size={45} />}
                        title="Analytics Dashboard"
                        desc="Track your safety metrics, alert history, and location patterns over time."
                        color="#FFD60A"
                        delay={0.5}
                    />
                    <FeatureCard
                        icon={<FaMobileAlt size={45} />}
                        title="Hardware Integration"
                        desc="Connect physical SOS devices for one-button emergency activation anywhere."
                        color="#BF5AF2"
                        delay={0.6}
                    />
                </div>
            </section>

            {/* CTA Section */}
            <section style={{ padding: '5rem 1rem', textAlign: 'center' }}>
                <div className="container">
                    <motion.div
                        className="glass-panel"
                        style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto' }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
                            Ready to Feel Safer?
                        </h2>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                            Join thousands of users who trust Guardian for their safety
                        </p>
                        <Link to="/register">
                            <motion.button
                                className="btn btn-primary"
                                style={{ fontSize: '1.2rem', padding: '1.2rem 3rem' }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Get Started Free
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc, color, delay }) => (
    <motion.div
        className="glass-panel"
        style={{ padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        whileHover={{ y: -10 }}
    >
        <motion.div
            style={{ marginBottom: '1.5rem', color }}
            whileHover={{ scale: 1.2, rotate: 360 }}
            transition={{ duration: 0.6 }}
        >
            {icon}
        </motion.div>
        <h3 style={{ fontSize: '1.6rem', marginBottom: '1rem', fontWeight: 700 }}>{title}</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{desc}</p>

        {/* Decorative gradient */}
        <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${color}, transparent)`,
            opacity: 0.6
        }} />
    </motion.div>
);

export default Home;
