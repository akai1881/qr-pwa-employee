import React, {useEffect, useRef, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import useAuth from '../context/AuthContextProvider';
import PWAPrompt from 'react-ios-pwa-prompt'
import AOS from 'aos';
import logo from './../assets/images/main_logo.svg';
import warning from './../assets/images/warning.svg';
import 'aos/dist/aos.css';

AOS.init();

const Login = () => {
    const {login, user} = useAuth();
    const history = useHistory();
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const inputRef = useRef(null);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            history.push('/');
        }
    }, []);

    const togglePassword = () => {
        if (inputRef.current.type === 'password') {
            inputRef.current.type = 'text';
            return;
        }
        inputRef.current.type = 'password';
    };

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            setError('');
            setLoading(true);
            await login(email, password);
            history.push('/');
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const canBeSubmitted = () => {
        if (email.length > 0 && password.length > 0) {
            return true;
        }
    };

    return (
        <>
            <div className="limiter">
                <div className="container-login100">
                    <div className="wrap-login100 p-t-50 p-b-50 p-l-30 p-r-30 ">
                        <form className="login100-form validate-form flex-sb flex-w" onSubmit={handleSubmit}>
                            <div className="img-container w-full flex-c-m m-b-50" data-aos="fade-down">
                                <img src={logo} style={{width: '120px'}} alt="logo"/>
                            </div>
                            {error && (
                                <div className="warn">
                                    <img src={warning} alt="warning"/>
                                    {error}
                                </div>
                            )}
                            <div
                                className="wrap-input100 validate-input m-b-16"
                                data-validate="Email is required"
                                data-aos="fade-right"
                                data-aos-delay="300"
                            >
                                <input
                                    className="input100"
                                    type="text"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    name="email"
                                    placeholder="Email"
                                />
                                <span className="focus-input100"/>
                            </div>

                            <div
                                className="wrap-input100 validate-input m-b-16"
                                data-validate="Password is required"
                                data-aos="fade-left"
                                data-aos-delay="400"
                            >
                                <input
                                    className="input100"
                                    type="password"
                                    name="pass"
                                    value={password}
                                    ref={inputRef}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Password"
                                />
                                <span className="focus-input100"/>
                            </div>

                            <div className="flex-sb-m w-full p-t-3 p-b-24" data-aos="fade-up" data-aos-delay="500">
                                <div className="contact100-form-checkbox">
                                    <input
                                        className="input-checkbox100"
                                        id="ckb1"
                                        onChange={togglePassword}
                                        type="checkbox"
                                        name="remember-me"
                                    />
                                    <label className="label-checkbox100" htmlFor="ckb1">
                                        ???????????????? ????????????
                                    </label>
                                </div>
                            </div>

                            <div className="flex-sb-m w-full p-t-3 p-b-24" data-aos="fade-up" data-aos-delay="500">
                                <Link to="/forget">???????????? ?????????????</Link>
                            </div>

                            <div className="container-login100-form-btn m-t-17" data-aos="fade-up" data-aos-delay="500">
                                <button className="login100-form-btn" disabled={loading || !canBeSubmitted()}>
                                    ??????????
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <PWAPrompt promptOnVisit={1} timesToShow={3} copyClosePrompt="Close" permanentlyHideOnDismiss={false}/>
        </>

    );
};

export default Login;
