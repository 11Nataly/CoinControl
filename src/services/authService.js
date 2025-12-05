import api from "./api";

// LOGIN
export const login = async (email, password) => {
  try {
    console.log("🔑 Iniciando sesión...");

    const response = await api.post("/auth/login", { email, password });
    const data = response.data;

    // Guardar token y usuario
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("usuario", JSON.stringify(data.usuario));

    console.log("✅ Login correcto:", data.usuario);

    return data.usuario;
  } catch (error) {
    console.error("❌ Error en login:", error.response?.data || error);
    throw new Error(error.response?.data?.detail || "Error al iniciar sesión");
  }
};

// REGISTER
export const register = async (usuarioData) => {
  try {
    console.log("📝 Registrando usuario...");

    const response = await api.post("/auth/register", usuarioData);
    const data = response.data;

    localStorage.setItem("token", data.access_token);
    localStorage.setItem("usuario", JSON.stringify(data.usuario));

    return data.usuario;
  } catch (error) {
    console.error("❌ Error en registro:", error.response?.data || error);
    throw new Error(error.response?.data?.detail || "Error al registrarse");
  }
};

// LOGOUT
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
};

// AUTH CHECK
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return token && token.length > 10;
};

// GET USER
export const getUser = () => {
  return JSON.parse(localStorage.getItem("usuario"));
};
