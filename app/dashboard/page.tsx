import AuthButton from "@/components/AuthButton";
import Footer from "@/components/Footer";
import TodoList from "@/components/TodoList";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: todos, error } = await supabase
    .from('todos')
    .select('*')
    .or(`user_id.eq.${user?.id},user_id.is.null`)
    .order('id', { ascending: false });
  if (error) console.log('error', error);

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="w-full">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
            <AuthButton />
          </div>
        </nav>
      </div>

      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3">
        <main className="flex-1 flex flex-col gap-6">
          <h2 className="font-bold text-4xl mb-4">TODOS</h2>
          <TodoList initialTodos={todos || []} />
        </main>
      </div>

      <Footer />
    </div>
  );
}
