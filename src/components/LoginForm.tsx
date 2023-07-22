import React, { useState } from 'react';
import '../styles/App.css';
import logo from '../styles/logo-zenfirst-treso.png';
import Login from '../services/Login';
import showNotification from "../utils/showNotification";

import { useCookies } from 'react-cookie';
import { Button, Form, Input } from 'antd';


const LoginForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [_, setCookie] = useCookies(['zenfirst-cookie']);

  const handleSubmission = React.useCallback(async (result: any) => {
      if (result.error) {
        showNotification("error", {
          message: "Echec lors de la connexion",
          description: result.error.message[0].messages[0].message,
        });
      } else {
        setCookie('zenfirst-cookie', result.response, { 
          path: '/',
        });
        showNotification("success", {
          message: "Connexion réussie",
          description: "Bienvue sur Zenfirst Treso",
        });
      }
    },
    [form]
  );

  const onSubmit = React.useCallback(async () => {
    let values;
    try {
      values = await form.getFieldsValue();
    } catch (errorInfo) {
      return;
    }
    console.log("values", values)
    setLoading(true);
    const result = await Login(values);
    setLoading(false);
    await handleSubmission(result);
  }, [form, handleSubmission]);

 
  return (
    <div className="App">
      <img className="logo" src={logo} />
      <h1>Me connecter</h1>
      <p>Vous n'avez pas de compte ? <a href="https://treso.zenfirst.fr/register">Créer un compte</a></p>
    
      <Form
        form={form}
        className="login-form"
        name="basic"
        style={{ maxWidth: 600 }}
        autoComplete="off"
      >
        <Form.Item
          label="Votre email"
          name="identifier"
          rules={[{ required: true, message: 'Email obligatoire!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Votre mot de passe"
          name="password"
          rules={[{ required: true, message: 'Mot de passe obligatoire!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={onSubmit}>
            Connexion
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default LoginForm;

