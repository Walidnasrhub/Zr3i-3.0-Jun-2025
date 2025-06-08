import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../lib/validations';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RegisterForm() {
  const { register: registerUser, error } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const success = await registerUser(data);
    setIsLoading(false);
    
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-container">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            {...register('username')}
            disabled={isLoading}
          />
          {errors.username && (
            <p className="text-sm text-destructive">{errors.username.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            {...register('password')}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Register'
          )}
        </Button>
      </form>
    </div>
  );
}

