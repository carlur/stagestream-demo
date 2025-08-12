"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    stageKey: "",
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/admin/dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Stage<span className="text-purple-400">Stream</span>
          </h1>
          <p className="text-gray-300">Admin Panel</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="stageKey"
                className="block text-sm font-medium text-gray-200 mb-2"
              >
                Stage Key
              </label>
              <input
                type="text"
                id="stageKey"
                name="stageKey"
                value={formData.stageKey}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your stage key"
                required
              />
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-200 mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-200 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center bg-red-500/20 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/")}
              className="text-gray-300 hover:text-white transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>Use your stage key to access the admin panel.</p>
          <p>
            If you don't have credentials, they'll be created on first login.
          </p>
        </div>
      </div>
    </div>
  );
}