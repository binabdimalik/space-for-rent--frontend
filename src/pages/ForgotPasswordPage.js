import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiArrowLeft, FiCheck } from 'react-icons/fi';
import { ClientsContext } from '../context/ClientsContext';

const ForgotPasswordPage = () => {
    const { getClientByEmail, resetPassword } = useContext(ClientsContext);
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Enter email, 2: Enter new password, 3: Success
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Check if email exists
        const client = getClientByEmail(email);
        if (!client) {
            setError('No account found with this email address.');
            setLoading(false);
            return;
        }

        // Move to password reset step
        setStep(2);
        setLoading(false);
    };

    const handlePasswordReset = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validate passwords
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long.');
            setLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        // Reset password
        const result = resetPassword(email, newPassword);
        if (result.success) {
            setStep(3);
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div style={{ 
            minHeight: 'calc(100vh - 65px)', 
            background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '40px',
                width: '100%',
                maxWidth: '420px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
                {/* Back to Login */}
                <Link 
                    to="/login" 
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        color: '#6a7282', 
                        textDecoration: 'none',
                        fontSize: '14px',
                        marginBottom: '24px'
                    }}
                >
                    <FiArrowLeft size={16} />
                    Back to Login
                </Link>

                {/* Step 1: Enter Email */}
                {step === 1 && (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <div style={{ 
                                width: '64px', 
                                height: '64px', 
                                background: '#eff6ff', 
                                borderRadius: '50%', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                margin: '0 auto 16px'
                            }}>
                                <FiMail size={28} color="#2563eb" />
                            </div>
                            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1e3a8a', marginBottom: '8px' }}>
                                Forgot Password?
                            </h1>
                            <p style={{ color: '#6a7282', fontSize: '14px' }}>
                                Enter your email address and we'll help you reset your password.
                            </p>
                        </div>

                        {error && (
                            <div style={{ 
                                background: '#fee2e2', 
                                color: '#991b1b', 
                                padding: '12px', 
                                borderRadius: '6px', 
                                marginBottom: '16px',
                                fontSize: '14px'
                            }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleEmailSubmit}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '6px', 
                                    marginBottom: '8px',
                                    fontWeight: 500,
                                    color: '#1e3a8a',
                                    fontSize: '14px'
                                }}>
                                    <FiMail size={16} />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-input"
                                    placeholder="Enter your registered email"
                                    required
                                />
                            </div>

                            <button 
                                type="submit" 
                                className="btn btn-primary w-full"
                                disabled={loading}
                            >
                                {loading ? 'Verifying...' : 'Continue'}
                            </button>
                        </form>
                    </>
                )}

                {/* Step 2: Enter New Password */}
                {step === 2 && (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <div style={{ 
                                width: '64px', 
                                height: '64px', 
                                background: '#eff6ff', 
                                borderRadius: '50%', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                margin: '0 auto 16px'
                            }}>
                                <FiLock size={28} color="#2563eb" />
                            </div>
                            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1e3a8a', marginBottom: '8px' }}>
                                Reset Password
                            </h1>
                            <p style={{ color: '#6a7282', fontSize: '14px' }}>
                                Create a new password for <strong>{email}</strong>
                            </p>
                        </div>

                        {error && (
                            <div style={{ 
                                background: '#fee2e2', 
                                color: '#991b1b', 
                                padding: '12px', 
                                borderRadius: '6px', 
                                marginBottom: '16px',
                                fontSize: '14px'
                            }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handlePasswordReset}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '6px', 
                                    marginBottom: '8px',
                                    fontWeight: 500,
                                    color: '#1e3a8a',
                                    fontSize: '14px'
                                }}>
                                    <FiLock size={16} />
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="form-input"
                                    placeholder="Enter new password (min 6 characters)"
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '6px', 
                                    marginBottom: '8px',
                                    fontWeight: 500,
                                    color: '#1e3a8a',
                                    fontSize: '14px'
                                }}>
                                    <FiLock size={16} />
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="form-input"
                                    placeholder="Confirm your new password"
                                    required
                                />
                            </div>

                            <button 
                                type="submit" 
                                className="btn btn-primary w-full"
                                disabled={loading}
                            >
                                {loading ? 'Updating...' : 'Reset Password'}
                            </button>
                        </form>

                        <button 
                            onClick={() => { setStep(1); setError(''); }}
                            style={{ 
                                background: 'none', 
                                border: 'none', 
                                color: '#6a7282', 
                                cursor: 'pointer',
                                marginTop: '16px',
                                width: '100%',
                                fontSize: '14px'
                            }}
                        >
                            Use a different email
                        </button>
                    </>
                )}

                {/* Step 3: Success */}
                {step === 3 && (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ 
                            width: '80px', 
                            height: '80px', 
                            background: '#dcfce7', 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            margin: '0 auto 24px'
                        }}>
                            <FiCheck size={40} color="#059669" />
                        </div>
                        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#059669', marginBottom: '12px' }}>
                            Password Reset Successful!
                        </h1>
                        <p style={{ color: '#6a7282', fontSize: '14px', marginBottom: '24px' }}>
                            Your password has been updated. You can now log in with your new password.
                        </p>
                        <button 
                            onClick={() => navigate('/login')}
                            className="btn btn-primary w-full"
                        >
                            Go to Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
