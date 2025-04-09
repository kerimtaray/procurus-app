import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@shared/schema";
import useLanguageStore from "@/hooks/useLanguage";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Loader2, LogIn, UserPlus, Truck, Briefcase, CheckCircle2 } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required")
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum([UserRole.AGENT, UserRole.PROVIDER]),
  companyName: z.string().min(2, "Company name is required")
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user, login, register, isLoading } = useAuth();
  const { language } = useLanguageStore();
  const [activeTab, setActiveTab] = useState<string>("login");

  // Translations for the auth page
  const t = {
    welcome: language === 'es' ? 'Bienvenido a Procurus' : 'Welcome to Procurus',
    loginTitle: language === 'es' ? 'Iniciar Sesión' : 'Login',
    registerTitle: language === 'es' ? 'Registro' : 'Register',
    username: language === 'es' ? 'Usuario' : 'Username',
    password: language === 'es' ? 'Contraseña' : 'Password',
    role: language === 'es' ? 'Rol' : 'Role',
    companyName: language === 'es' ? 'Nombre de Empresa' : 'Company Name',
    agent: language === 'es' ? 'Agente de Logística' : 'Logistics Agent',
    provider: language === 'es' ? 'Proveedor de Transporte' : 'Transport Provider',
    loginButton: language === 'es' ? 'Iniciar Sesión' : 'Login',
    registerButton: language === 'es' ? 'Registrarse' : 'Register',
    loginSubtitle: language === 'es' ? 'Accede a tu cuenta' : 'Access your account',
    registerSubtitle: language === 'es' ? 'Crea una nueva cuenta' : 'Create a new account',
    noAccount: language === 'es' ? '¿No tienes una cuenta?' : 'Don\'t have an account?',
    alreadyAccount: language === 'es' ? '¿Ya tienes una cuenta?' : 'Already have an account?',
    registerNow: language === 'es' ? 'Regístrate ahora' : 'Register now',
    loginNow: language === 'es' ? 'Inicia sesión' : 'Login now',
    heroTitle: language === 'es' ? 'La plataforma logística inteligente' : 'The intelligent logistics platform',
    heroSubtitle: language === 'es' 
      ? 'Conecta con los mejores transportistas y optimiza tu cadena de suministro' 
      : 'Connect with the best carriers and optimize your supply chain',
    featureTitle1: language === 'es' ? 'Fácil y Rápido' : 'Quick & Easy',
    featureDesc1: language === 'es' 
      ? 'Crea solicitudes de envío y recibe múltiples cotizaciones' 
      : 'Create shipping requests and receive multiple quotes',
    featureTitle2: language === 'es' ? 'Transporte Confiable' : 'Reliable Transport',
    featureDesc2: language === 'es' 
      ? 'Conecta con transportistas verificados y calificados' 
      : 'Connect with verified and rated transport providers',
    featureTitle3: language === 'es' ? 'Todo en un Solo Lugar' : 'All in One Place',
    featureDesc3: language === 'es' 
      ? 'Gestiona todo el proceso desde la solicitud hasta la entrega' 
      : 'Manage the entire process from request to delivery',
  };

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      role: UserRole.AGENT,
      companyName: ""
    }
  });

  // Handle login submission
  const onLoginSubmit = async (values: LoginFormValues) => {
    await login(values.username, values.password);
  };

  // Handle register submission
  const onRegisterSubmit = async (values: RegisterFormValues) => {
    await register(values.username, values.password, values.role, values.companyName);
  };

  // Switch between login and register tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="flex flex-col min-h-screen antialiased bg-gray-50">
      <div className="flex flex-1">
        <div className="flex flex-col justify-center w-full px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 lg:w-1/2">
          <div className="w-full max-w-md mx-auto lg:max-w-lg">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent mb-2">
                Procurus
              </h1>
              <p className="text-gray-600">{t.welcome}</p>
            </div>

            <Tabs defaultValue="login" value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login">{t.loginTitle}</TabsTrigger>
                <TabsTrigger value="register">{t.registerTitle}</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Card>
                  <CardHeader>
                    <CardTitle>{t.loginTitle}</CardTitle>
                    <CardDescription>{t.loginSubtitle}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                        <FormField
                          control={loginForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t.username}</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="john.doe" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t.password}</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} placeholder="••••••" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                          {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <LogIn className="mr-2 h-4 w-4" />
                          )}
                          {t.loginButton}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>

                  <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-600">
                      {t.noAccount}{" "}
                      <button
                        onClick={() => setActiveTab("register")}
                        className="font-medium text-primary hover:underline"
                      >
                        {t.registerNow}
                      </button>
                    </p>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="register">
                <Card>
                  <CardHeader>
                    <CardTitle>{t.registerTitle}</CardTitle>
                    <CardDescription>{t.registerSubtitle}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                        <FormField
                          control={registerForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t.username}</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="john.doe" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t.password}</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} placeholder="••••••" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={registerForm.control}
                          name="role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t.role}</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder={t.role} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value={UserRole.AGENT}>
                                    <div className="flex items-center">
                                      <Briefcase className="h-4 w-4 mr-2" />
                                      {t.agent}
                                    </div>
                                  </SelectItem>
                                  <SelectItem value={UserRole.PROVIDER}>
                                    <div className="flex items-center">
                                      <Truck className="h-4 w-4 mr-2" />
                                      {t.provider}
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={registerForm.control}
                          name="companyName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t.companyName}</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Acme Logistics" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                          {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <UserPlus className="mr-2 h-4 w-4" />
                          )}
                          {t.registerButton}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>

                  <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-600">
                      {t.alreadyAccount}{" "}
                      <button
                        onClick={() => setActiveTab("login")}
                        className="font-medium text-primary hover:underline"
                      >
                        {t.loginNow}
                      </button>
                    </p>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right Side - Hero Section */}
        <div className="hidden lg:block relative w-0 flex-1 bg-gradient-to-br from-blue-600 to-teal-500">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAwIDJhOTggOTggMCAwMTQxLjQgMTg2LjggOTggOTggMCAwMS04Mi44IDAgOTggOTggMCAwMTQxLjQtMTg2Ljh6bTAgMTYwYTYyIDYyIDAgMTAwLTEyNCA2MiA2MiAwIDAwMCAxMjR6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9Ii4wNSIvPjwvc3ZnPg==')] bg-cover" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center px-16">
            <div className="max-w-lg text-white">
              <h2 className="text-4xl font-bold mb-6">{t.heroTitle}</h2>
              <p className="text-xl mb-10 text-white/80">{t.heroSubtitle}</p>
              
              <div className="space-y-8">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-white/10 rounded-full p-3">
                    <Truck className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-medium">{t.featureTitle1}</h3>
                    <p className="mt-1 text-white/70">{t.featureDesc1}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-white/10 rounded-full p-3">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-medium">{t.featureTitle2}</h3>
                    <p className="mt-1 text-white/70">{t.featureDesc2}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-white/10 rounded-full p-3">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-medium">{t.featureTitle3}</h3>
                    <p className="mt-1 text-white/70">{t.featureDesc3}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}