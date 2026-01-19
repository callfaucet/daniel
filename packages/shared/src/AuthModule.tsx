import React, { useState, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
    EnvelopeSimple,
    Lock,
    User,
    Phone,
    Eye,
    EyeSlash,
    ShieldCheck,
    SpinnerGap,
    CheckCircle,
    XCircle,
    SignIn,
    UserPlus
} from '@phosphor-icons/react';

// --- Types ---
interface AuthModuleProps {
    supabaseUrl: string;
    supabaseKey: string;
    viewDetails: 'desktop' | 'mobile'; // To apply specific optimizations if needed
}

type AuthView = 'login' | 'signup';

// --- Validation ---

const validatePassword = (p: string): string | null => {
    if (p.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(p)) return "Password must contain an uppercase letter.";
    if (!/[a-z]/.test(p)) return "Password must contain a lowercase letter.";
    if (!/\d/.test(p)) return "Password must contain a number.";
    if (!/[@$!%*?&]/.test(p)) return "Password must contain a special character.";
    return null;
};

const getPasswordStrength = (p: string): { score: number; label: string; color: string } => {
    let score = 0;
    if (p.length >= 8) score++;
    if (p.length >= 12) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[a-z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[@$!%*?&]/.test(p)) score++;

    if (score <= 2) return { score, label: 'Weak', color: '#ef4444' };
    if (score <= 4) return { score, label: 'Medium', color: '#f59e0b' };
    return { score, label: 'Strong', color: '#22c55e' };
};

// --- Component ---
export const AuthModule: React.FC<AuthModuleProps> = ({ supabaseUrl, supabaseKey, viewDetails }) => {
    const [supabase] = useState(() => createClient(supabaseUrl, supabaseKey));
    const [view, setView] = useState<AuthView>('login');

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            setMessage("Logged in successfully!");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Backend Validation Simulation (Client-side first)
        const passError = validatePassword(password);
        if (passError) {
            setError(passError);
            setLoading(false);
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                phone,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                        phone: phone // Storing in metadata as well for easy access
                    }
                }
            });
            if (error) throw error;
            setMessage("Signup successful! Please check your email for verification.");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // --- Styles ---
    const containerStyle: React.CSSProperties = {
        fontFamily: "'Inter', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#0f172a', // Dark slate
        color: '#e2e8f0',
        padding: viewDetails === 'mobile' ? '20px' : '0',
    };

    const cardStyle: React.CSSProperties = {
        backgroundColor: '#1e293b',
        padding: viewDetails === 'mobile' ? '1.5rem' : '2.5rem',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        width: viewDetails === 'mobile' ? '100%' : '420px',
        maxWidth: '100%',
        border: '1px solid #334155'
    };

    const inputWrapperStyle: React.CSSProperties = {
        position: 'relative',
        marginBottom: '1rem'
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '0.875rem 0.875rem 0.875rem 3rem',
        borderRadius: '10px',
        border: '1px solid #475569',
        backgroundColor: '#0f172a',
        color: 'white',
        fontSize: '1rem',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        outline: 'none'
    };

    const inputIconStyle: React.CSSProperties = {
        position: 'absolute',
        left: '1rem',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#64748b',
        pointerEvents: 'none'
    };

    const passwordToggleStyle: React.CSSProperties = {
        position: 'absolute',
        right: '1rem',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#64748b',
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    const buttonStyle: React.CSSProperties = {
        width: '100%',
        padding: '0.875rem',
        borderRadius: '10px',
        border: 'none',
        background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
        color: 'white',
        fontSize: '1rem',
        fontWeight: 600,
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.7 : 1,
        transition: 'transform 0.2s, box-shadow 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.3)'
    };

    const linkStyle: React.CSSProperties = {
        color: '#60a5fa',
        cursor: 'pointer',
        textDecoration: 'none',
        marginTop: '1.5rem',
        display: 'block',
        textAlign: 'center',
        fontSize: '0.875rem',
        transition: 'color 0.2s'
    };

    const strengthBarStyle: React.CSSProperties = {
        height: '4px',
        borderRadius: '2px',
        backgroundColor: '#334155',
        marginTop: '0.5rem',
        overflow: 'hidden'
    };

    const strengthFillStyle: React.CSSProperties = {
        height: '100%',
        width: `${(passwordStrength.score / 6) * 100}%`,
        backgroundColor: passwordStrength.color,
        transition: 'width 0.3s, background-color 0.3s',
        borderRadius: '2px'
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                {/* Header with Shield Icon */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '64px',
                        height: '64px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)',
                        marginBottom: '1rem'
                    }}>
                        <ShieldCheck size={32} weight="duotone" color="#3b82f6" />
                    </div>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>
                        {view === 'login' ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p style={{ margin: '0.5rem 0 0', color: '#94a3b8', fontSize: '0.875rem' }}>
                        {view === 'login' ? 'Sign in to continue' : 'Start your secure journey'}
                    </p>
                </div>

                {error && (
                    <div style={{
                        color: '#ef4444',
                        marginBottom: '1rem',
                        padding: '0.75rem 1rem',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem'
                    }}>
                        <XCircle size={20} weight="fill" />
                        {error}
                    </div>
                )}

                {message && (
                    <div style={{
                        color: '#22c55e',
                        marginBottom: '1rem',
                        padding: '0.75rem 1rem',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem'
                    }}>
                        <CheckCircle size={20} weight="fill" />
                        {message}
                    </div>
                )}

                <form onSubmit={view === 'login' ? handleLogin : handleSignup}>
                    {view === 'signup' && (
                        <>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ ...inputWrapperStyle, flex: 1 }}>
                                    <User size={20} style={inputIconStyle} />
                                    <input
                                        type="text" placeholder="First Name" required
                                        value={firstName} onChange={e => setFirstName(e.target.value)}
                                        style={inputStyle}
                                    />
                                </div>
                                <div style={{ ...inputWrapperStyle, flex: 1 }}>
                                    <User size={20} style={inputIconStyle} />
                                    <input
                                        type="text" placeholder="Last Name" required
                                        value={lastName} onChange={e => setLastName(e.target.value)}
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                            <div style={inputWrapperStyle}>
                                <Phone size={20} style={inputIconStyle} />
                                <input
                                    type="tel" placeholder="Phone Number" required
                                    value={phone} onChange={e => setPhone(e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                        </>
                    )}

                    <div style={inputWrapperStyle}>
                        <EnvelopeSimple size={20} style={inputIconStyle} />
                        <input
                            type="email" placeholder="Email Address" required
                            value={email} onChange={e => setEmail(e.target.value)}
                            style={inputStyle}
                        />
                    </div>

                    <div style={inputWrapperStyle}>
                        <Lock size={20} style={inputIconStyle} />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            style={inputStyle}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={passwordToggleStyle}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {view === 'signup' && password && (
                        <div style={{ marginBottom: '1rem', marginTop: '-0.5rem' }}>
                            <div style={strengthBarStyle}>
                                <div style={strengthFillStyle} />
                            </div>
                            <p style={{
                                margin: '0.25rem 0 0',
                                fontSize: '0.75rem',
                                color: passwordStrength.color
                            }}>
                                Password strength: {passwordStrength.label}
                            </p>
                        </div>
                    )}

                    {view === 'signup' && (
                        <div style={inputWrapperStyle}>
                            <Lock size={20} style={inputIconStyle} />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm Password"
                                required
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                style={inputStyle}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={passwordToggleStyle}
                                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                            >
                                {showConfirmPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    )}

                    <button type="submit" style={buttonStyle} disabled={loading}>
                        {loading ? (
                            <>
                                <SpinnerGap size={20} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                                Processing...
                            </>
                        ) : view === 'login' ? (
                            <>
                                <SignIn size={20} weight="bold" />
                                Sign In
                            </>
                        ) : (
                            <>
                                <UserPlus size={20} weight="bold" />
                                Create Account
                            </>
                        )}
                    </button>
                </form>

                <span
                    style={linkStyle}
                    onClick={() => {
                        setView(view === 'login' ? 'signup' : 'login');
                        setError(null);
                        setMessage(null);
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#93c5fd')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#60a5fa')}
                >
                    {view === 'login' ? "Don't have an account? Sign up" : "Already have an account? Login"}
                </span>
            </div>

            {/* Add keyframes for spinner animation */}
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

