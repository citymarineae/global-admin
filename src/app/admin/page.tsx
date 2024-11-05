"use client";
import { useState } from "react";
import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include", // This is important for including cookies in the request
      });

      if (response.ok) {
        router.push("/admin/dashboard");
      } else {
        const data = await response.json();
        setError(data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="flex justify-center pb-0 flex-col">
          
              <img src="/logo/logo-dark.svg" style={{height:"100px",width:"200px"}}></img>
          
          <h1 className="text-2xl font-bold">Login</h1>
        </CardHeader>
        <CardBody>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input name="username" label="Username" placeholder="Enter your username" type="text" required />
            <Input name="password" label="Password" placeholder="Enter your password" type="password" required />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" color="primary" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
