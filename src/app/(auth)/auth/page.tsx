import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignupForm from "@/app/(auth)/auth/SignupForm";
import LoginForm from "@/app/(auth)/auth/LoginForm";

export default function AuthPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="space-y-4">
        <h1 className="text-center text-2xl font-bold">Cinema</h1>
        <Tabs defaultValue="login" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Zaloguj się</TabsTrigger>
            <TabsTrigger value="signup">Utwórz konto</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          <TabsContent value="signup">
            <SignupForm />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
