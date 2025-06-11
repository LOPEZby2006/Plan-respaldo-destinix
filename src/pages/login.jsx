
import React from "react";
import LoginForm from "../components/loginform";
import RegisterForm from "../components/registerform";
import styles from "../styles/login.module.css";

function Login() {
  return (
      <div className={styles.fondo}>
        <div className={styles.container}>
            <LoginForm />
            <RegisterForm />
          </div>
      </div>

    
  );
}

export default Login;
