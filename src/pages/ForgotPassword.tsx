
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
});

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [success, setSuccess] = useState(false);
  const { forgotPassword, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form input
      forgotPasswordSchema.parse({ email });
      setErrors({});
      
      // Attempt to send reset link
      const result = await forgotPassword(email);
      if (result) {
        setSuccess(true);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Format Zod validation errors
        const formattedErrors: { email?: string } = {};
        error.errors.forEach((err) => {
          if (err.path) {
            formattedErrors[err.path[0] as 'email'] = err.message;
          }
        });
        setErrors(formattedErrors);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-menu-light-purple via-white to-white p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-menu-purple/10">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-menu-purple">Forgot Password</CardTitle>
            <CardDescription>Enter your email to receive a password reset link</CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="text-center p-4">
                <div className="text-menu-purple text-4xl mb-4">✓</div>
                <h3 className="text-lg font-medium mb-2">Reset Link Sent!</h3>
                <p className="text-sm text-gray-500 mb-4">
                  We've sent a password reset link to <span className="font-medium">{email}</span>. Please check your inbox.
                </p>
                <Button asChild className="w-full bg-menu-purple hover:bg-menu-dark-purple">
                  <Link to="/login">Return to Login</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="restaurant@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <Button type="submit" className="w-full bg-menu-purple hover:bg-menu-dark-purple" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              Remember your password?{" "}
              <Link to="/login" className="text-menu-purple hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
