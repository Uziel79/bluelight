'use server'

import { createClient } from "@/utils/supabase/server";

interface AddTodo {
  title: string;
  task: string;
  color: string | null | undefined;
}

interface Task extends AddTodo {
  id?: string;
  user_id: string | null | undefined;
  is_complete: boolean | null | undefined;
}

interface SaveTodo {
  id: string;
  title: string;
  task: string;
  color: string | null | undefined;
  is_complete: boolean | null | undefined;
}

interface DeleteTodo {
  id: string;
}

interface InsertResponse {
  id: string;
}

interface Todo {
  id?: string;
  title: string;
  task: string;
  user_id: string | null | undefined;
  color: string | null | undefined;
  is_complete: boolean | null | undefined;
}

export async function addTodo({ title, task: description, color }: AddTodo) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (title && description.trim().length) {
    let task: Task = { title, task: description, user_id: color ? user?.id : null, color, is_complete: false };
    let { data, error } = await supabase
      .from('todos')
      .insert(task)
      .single<InsertResponse>();
    if (error) console.log('error', error);
    else {
      task.id = data?.id || '';
    }

    return task;
  }
}

export async function saveTodo({ id, title, task: description, color, is_complete }: SaveTodo) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (title && description.trim().length && id) {
    let task = { id, title, task: description, user_id: color ? user?.id : null, color: color, is_complete };
    let { error } = await supabase
      .from('todos')
      .update(task)
      .match({ id });
    if (error) console.log('error', error);
    else {
      return task;
    }
  }
}

export async function deleteTodo({ id }: DeleteTodo) {
  const supabase = createClient();

  return await supabase
    .from('todos')
    .delete()
    .match({ id });
}

export async function toggleComplete(todo: Todo) {
  const supabase = createClient();

  const updatedTodo = { ...todo, is_complete: !todo.is_complete };
  let { error } = await supabase
    .from('todos')
    .update(updatedTodo)
    .match({ id: todo.id });
  if (error) console.log('error', error);

  return updatedTodo;
}
