import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../context/AuthContextProvider';
import AOS from 'aos';
import logo from './../assets/images/main_logo.svg';
import warning from './../assets/images/warning.svg';
import checked from './../assets/images/checked.svg';
import 'aos/dist/aos.css';

AOS.init();

const ResetPassword = () => {
	const { reset } = useAuth();
	const [error, setError] = useState('');
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');

	const handleSubmit = async e => {
		e.preventDefault();

		try {
			setMessage('');
			setError('');
			setLoading(true);
			await reset(email);
			setMessage('Проверьте вашу почту для дальнейших инструкций');
		} catch (e) {
			setError('Произоша ошибка, попробойте снова');
		} finally {
			setLoading(false);
		}
	};

	const canBeSubmitted = () => {
		if (email.length > 0) {
			return true;
		}
	};

	return (
		<div className="limiter">
			<div className="container-login100">
				<div className="wrap-login100 p-t-50 p-b-50 p-l-30 p-r-30 ">
					<form className="login100-form validate-form flex-sb flex-w" onSubmit={handleSubmit}>
						<div className="img-container w-full flex-c-m m-b-20" data-aos="fade-down">
							<img src={logo} style={{ width: '120px' }} alt="logo" />
						</div>
						<div
							className="flex-sb-m w-full p-t-3 p-b-24 reset-title"
							data-aos="fade-up"
							data-aos-delay="500"
						>
							<span>Восстановление пароля</span>
						</div>

						{error && (
							<div class="warn">
								<img src={warning} />
								{error}
							</div>
						)}
						{message && (
							<div class="success">
								<img src={checked} />
								{message}
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
							<span className="focus-input100" />
						</div>

						<div className="flex-sb-m w-full p-t-3 p-b-24" data-aos="fade-up" data-aos-delay="500">
							<Link to="/login">Войти</Link>
						</div>

						<div className="container-login100-form-btn m-t-17" data-aos="fade-up" data-aos-delay="500">
							<button className="login100-form-btn" disabled={loading || !canBeSubmitted()}>
								Отправить
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default ResetPassword;
