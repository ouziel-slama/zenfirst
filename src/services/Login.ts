const Login = async (data: any) => {
    const url = "https://api.zenfirst.fr/auth/local";
  
    const submitRequest = async (reqBody: any) => {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reqBody),
        });
        const json = await res.json();
        if (res.ok) {
          return { response: json, error: undefined };
        } else {
          return { response: undefined, error: json };
        }
      } catch (error) {
        return { response: undefined, error: error };
      }
    };
  
    return await submitRequest(data);
  };
  
  export default Login;