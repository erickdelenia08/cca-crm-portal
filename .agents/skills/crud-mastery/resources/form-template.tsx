"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ItemSchema, ItemValues } from "@/schemas/your-item";
import { createItem } from "@/app/actions/your-action";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const ItemForm = () => {
  const form = useForm<ItemValues>({
    resolver: zodResolver(ItemSchema),
    defaultValues: { title: "", content: "", published: false },
  });

  const onSubmit = async (values: ItemValues) => {
    const res = await createItem(values);
    if (res.error) toast.error(res.error);
    if (res.success) {
      toast.success(res.success);
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
