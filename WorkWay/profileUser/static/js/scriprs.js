* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
    background: linear-gradient(135deg, 
        #f8fafc 0%, 
        #f1f5f9 25%, 
        #e2e8f0 50%, 
        #f1f5f9 75%, 
        #f8fafc 100%);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    color: #1e293b;
}

/* Градиентные волны */
.gradient-wave {
    position: fixed;
    height: 200px;
    width: 100%;
    z-index: -1;
    opacity: 0.15;
}

.wave-1 {
    top: 0;
    background: linear-gradient(180deg, #93c5fd, transparent);
    animation: waveMove 25s linear infinite;
}

.wave-2 {
    top: 50%;
    transform: translateY(-50%);
    background: linear-gradient(90deg, transparent, #c7d2fe, transparent);
    animation: waveMove 30s linear infinite reverse;
    height: 150px;
}

.wave-3 {
    bottom: 0;
    background: linear-gradient(0deg, #86efac, transparent);
    animation: waveMove 20s linear infinite;
    opacity: 0.1;
}

.container {
    width: 100%;
    max-width: 1200px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 25px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

header {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
    padding: 40px 30px;
    text-align: center;
    position: relative;
    overflow: hidden;
}

header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
    opacity: 0.1;
}

header h1 {
    font-size: 3.2rem;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    font-weight: 800;
    letter-spacing: -1px;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.logo-highlight {
    background: linear-gradient(135deg, #ffffff, #c7d2fe);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.subtitle {
    font-size: 1.3rem;
    opacity: 0.9;
    font-weight: 300;
    max-width: 600px;
    margin: 0 auto;
}

.main-content {
    padding: 50px 40px;
}

.welcome-section {
    text-align: center;
    margin-bottom: 50px;
}

.welcome-section h2 {
    background: linear-gradient(135deg, #3b82f6, #10b981);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-size: 2.5rem;
    margin-bottom: 15px;
    font-weight: 800;
}

.welcome-section p {
    color: #64748b;
    font-size: 1.2rem;
    max-width: 500px;
    margin: 0 auto;
    line-height: 1.6;
}

.auth-tabs {
    background: white;
    border-radius: 20px;
    padding: 40px;
    margin-bottom: 50px;
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(226, 232, 240, 0.6);
}

.tabs-header {
    display: flex;
    margin-bottom: 40px;
    border-bottom: 2px solid #e2e8f0;
    background: #f8fafc;
    border-radius: 15px;
    padding: 5px;
}

.tab-btn {
    flex: 1;
    padding: 18px 30px;
    background: none;
    border: none;
    font-size: 1.1rem;
    font-weight: 700;
    color: #64748b;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.tab-btn i {
    font-size: 1.2rem;
}

.tab-btn.active {
    color: #3b82f6;
    background: white;
    box-shadow: 0 4px 20px rgba(59, 130, 246, 0.15);
}

.tab-btn.active::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 10%;
    width: 80%;
    height: 3px;
    background: linear-gradient(135deg, #3b82f6, #10b981);
    border-radius: 3px;
}

.tab-content {
    display: none;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.5s ease;
}

.tab-content.active {
    display: block;
    opacity: 1;
    transform: translateY(0);
    animation: slideIn 0.5s ease;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.form-group {
    margin-bottom: 30px;
}

.form-group label {
    display: block;
    margin-bottom: 12px;
    color: #334155;
    font-weight: 600;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 12px;
}

.form-group label i {
    color: #3b82f6;
    width: 20px;
    text-align: center;
}

.form-group input {
    width: 100%;
    padding: 16px 20px;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: #f8fafc;
    color: #1e293b;
}

.form-group input:focus {
    outline: none;
    border-color: #3b82f6;
    background: white;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
}

.form-group input::placeholder {
    color: #94a3b8;
}

.btn-primary {
    width: 100%;
    padding: 18px;
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    position: relative;
    overflow: hidden;
}

.btn-primary::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s ease;
}

.btn-primary:hover::before {
    left: 100%;
}

.btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
}

.btn-primary:active {
    transform: translateY(-1px);
}

.divider {
    display: flex;
    align-items: center;
    margin: 30px 0;
    color: #94a3b8;
    font-weight: 500;
}

.divider::before,
.divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
}

.divider span {
    padding: 0 20px;
    background: white;
}

.switch-text {
    text-align: center;
    color: #64748b;
    font-size: 1rem;
}

.switch-text a {
    color: #3b82f6;
    text-decoration: none;
    font-weight: 700;
    transition: all 0.3s ease;
    position: relative;
    padding: 2px 4px;
}

.switch-text a::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background: #3b82f6;
    transform: scaleX(0);
    transition: transform 0.3s ease;
}

.switch-text a:hover::after {
    transform: scaleX(1);
}

.register-choice {
    text-align: center;
}

.register-choice h3 {
    color: #1e293b;
    margin-bottom: 15px;
    font-size: 1.8rem;
    font-weight: 800;
}

.register-choice > p {
    color: #64748b;
    margin-bottom: 40px;
    font-size: 1.1rem;
    line-height: 1.6;
}

.choice-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 30px;
    margin-bottom: 40px;
}

.choice-card {
    background: white;
    border-radius: 20px;
    padding: 35px;
    text-align: center;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    border: 2px solid transparent;
    position: relative;
    overflow: hidden;
}

.choice-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #3b82f6, #10b981);
    transform: scaleX(0);
    transition: transform 0.4s ease;
}

.choice-card:hover::before {
    transform: scaleX(1);
}

.choice-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
}

.choice-card[data-type="employee"]:hover {
    border-color: #3b82f6;
}

.choice-card[data-type="employer"]:hover {
    border-color: #10b981;
}

.choice-icon {
    width: 90px;
    height: 90px;
    background: linear-gradient(135deg, #3b82f6, #10b981);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 25px;
    color: white;
    font-size: 2.5rem;
    box-shadow: 0 10px 30px rgba(59, 130, 246, 0.25);
    transition: transform 0.3s ease;
}

.choice-card:hover .choice-icon {
    transform: scale(1.1) rotate(5deg);
}

.choice-card h4 {
    color: #1e293b;
    margin-bottom: 10px;
    font-size: 1.5rem;
    font-weight: 800;
}

.choice-card > p {
    color: #3b82f6;
    font-weight: 700;
    margin-bottom: 25px;
    font-size: 1.1rem;
}

.choice-card ul {
    list-style: none;
    text-align: left;
    margin-bottom: 30px;
}

.choice-card ul li {
    padding: 10px 0;
    color: #475569;
    display: flex;
    align-items: center;
    font-size: 0.95rem;
}

.choice-card ul li::before {
    content: '✓';
    color: #10b981;
    font-weight: bold;
    margin-right: 12px;
    font-size: 1.1rem;
}

.btn-choice {
    width: 100%;
    padding: 16px;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.btn-choice[data-type="employee"] {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.btn-choice[data-type="employer"] {
    background: linear-gradient(135deg, #10b981, #059669);
}

.btn-choice::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s ease;
}

.btn-choice:hover::before {
    left: 100%;
}

.btn-choice:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 30px;
    margin-top: 60px;
}

.feature {
    text-align: center;
    padding: 35px 25px;
    background: white;
    border-radius: 20px;
    transition: all 0.4s ease;
    border: 1px solid #e2e8f0;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    position: relative;
    overflow: hidden;
}

.feature::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #3b82f6, #10b981);
    transform: scaleX(0);
    transition: transform 0.4s ease;
}

.feature:hover::before {
    transform: scaleX(1);
}

.feature:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.feature i {
    font-size: 3rem;
    margin-bottom: 20px;
    position: relative;
    display: inline-block;
}

.feature:nth-child(1) i {
    color: #3b82f6;
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.feature:nth-child(2) i {
    color: #10b981;
    background: linear-gradient(135deg, #10b981, #059669);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.feature:nth-child(3) i {
    color: #f59e0b;
    background: linear-gradient(135deg, #f59e0b, #d97706);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.feature h3 {
    color: #1e293b;
    margin-bottom: 15px;
    font-size: 1.4rem;
    font-weight: 700;
}

.feature p {
    color: #64748b;
    font-size: 1rem;
    line-height: 1.6;
}

footer {
    text-align: center;
    padding: 30px;
    background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
    color: #64748b;
    border-top: 1px solid #e2e8f0;
    font-size: 0.95rem;
}

@keyframes waveMove {
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(-100%);
    }
}

/* Анимация появления элементов */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Адаптивность */
@media (max-width: 992px) {
    .container {
        margin: 10px;
        border-radius: 20px;
    }

    header h1 {
        font-size: 2.5rem;
        flex-direction: column;
        gap: 10px;
    }

    .main-content {
        padding: 30px;
    }

    .auth-tabs {
        padding: 30px;
    }

    .choice-cards {
        grid-template-columns: 1fr;
    }

    .features {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    body {
        padding: 10px;
    }

    .container {
        border-radius: 15px;
    }

    header {
        padding: 30px 20px;
    }

    header h1 {
        font-size: 2rem;
    }

    .subtitle {
        font-size: 1.1rem;
    }

    .main-content {
        padding: 20px;
    }

    .welcome-section h2 {
        font-size: 2rem;
    }

    .tabs-header {
        flex-direction: column;
        gap: 5px;
        background: none;
        padding: 0;
    }

    .tab-btn {
        width: 100%;
        border-radius: 10px;
        margin-bottom: 5px;
    }

    .auth-tabs {
        padding: 25px;
    }

    .choice-cards {
        gap: 20px;
    }

    .choice-card {
        padding: 25px;
    }

    .feature {
        padding: 25px 20px;
    }
}

@media (max-width: 480px) {
    header h1 {
        font-size: 1.8rem;
    }

    .welcome-section h2 {
        font-size: 1.7rem;
    }

    .welcome-section p {
        font-size: 1rem;
    }

    .auth-tabs {
        padding: 20px;
    }

    .tab-btn {
        padding: 15px;
        font-size: 1rem;
    }

    .form-group input {
        padding: 14px 16px;
    }

    .btn-primary, .btn-choice {
        padding: 16px;
    }

    .choice-card {
        padding: 20px;
    }

    .choice-icon {
        width: 70px;
        height: 70px;
        font-size: 2rem;
    }
}