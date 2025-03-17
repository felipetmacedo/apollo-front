import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Waves } from "@/components/ui/wave-background";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { EyeOffIcon } from "lucide-react";
import { EyeIcon } from "lucide-react";

import useSignupContainer from "./Signup.container";

const Signup = () => {
  const {
    register,
    handleSubmit,
    errors,
    isPending,
    onSubmit,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword
  } = useSignupContainer();

  return (
    <div className="flex min-h-screen flex-1">
      <div className="w-full bg-slate-200 flex-col items-center justify-center antialiased relative hidden lg:block">
        <div className="absolute inset-0">
          <Waves
            lineColor="rgba(0, 0, 0, 0.3)"
            backgroundColor="transparent"
            waveSpeedX={0.02}
            waveSpeedY={0.01}
            waveAmpX={40}
            waveAmpY={20}
            friction={0.9}
            tension={0.01}
            maxCursorMove={120}
            xGap={12}
            yGap={36}
          />
        </div>

        <div className="absolute z-10 p-8 left-[0] top-[0]">
          <h3 className="text-2xl font-bold">Bem-vindo ao Apollo</h3>
          <span>
            Crie sua conta para começar
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-center px-4 py-12 lg:flex-none sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-sm min-w-[400px]">
          <Card className="md:min-w-[400px]">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-semibold">Crie sua conta</CardTitle>
              <CardDescription>
                Crie sua conta para começar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    {...register("name")}
                    aria-invalid={errors.name ? "true" : "false"}
                  />
                  {errors.name &&
                    <p className="text-sm text-destructive">
                      {errors.name.message}
                    </p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="youremail@domain.com"
                    {...register("email")}
                    aria-invalid={errors.email ? "true" : "false"}
                  />
                  {errors.email &&
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("password")}
                      aria-invalid={errors.password ? "true" : "false"}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword
                        ? <EyeOffIcon className="h-4 w-4" />
                        : <EyeIcon className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.password &&
                    <p className="text-sm text-destructive">
                      {errors.password.message}
                    </p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar senha</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("confirmPassword")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword
                        ? <EyeOffIcon className="h-4 w-4" />
                        : <EyeIcon className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.confirmPassword &&
                    <p className="text-sm text-destructive">
                      {errors.confirmPassword.message}
                    </p>}
                </div>
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Criando conta..." : "Criar conta"}
                </Button>
              </form>
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary hover:underline"
                >
                  Faça login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Signup;
