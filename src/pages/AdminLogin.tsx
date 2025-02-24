import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { LogIn, User } from "lucide-react";
import { adminLogin } from "../api/Portf_api"; 

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const BASE_URL = import.meta.env.VITE_BACKEND_URL;
    const response = await fetch(`${BASE_URL}/login/`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {toast
        ({ title: "Error", description: "Invalid credentials", variant: "destructive" });
        return;
    }

    const { access_token, refresh_token, is_admin, expires_in } = await response.json();

    if (access_token) {
        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("token_expiry", (Date.now() + expires_in * 1000).toString());
        localStorage.setItem("is_admin", is_admin ? "true" : "false"); // Store admin status

        toast({ title: "Success", description: is_admin ? "Logged in as Admin" : "Logged in successfully" });

        navigate(is_admin ? "/admin" : "/");
    } else {
        throw new Error("Invalid response format");
    }
};




  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md space-y-8 p-8 bg-black border border-gray-800 rounded-xl shadow-lg">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full mx-auto flex items-center justify-center">
            <User className="h-8 w-8 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-white">Admin Login</h2>
          <p className="text-gray-400">Enter your credentials to access the admin dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-2">
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-black border-gray-800 focus:border-blue-500 text-white placeholder:text-gray-500"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-black border-gray-800 focus:border-blue-500 text-white placeholder:text-gray-500"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;