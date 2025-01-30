"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const FormSchema = z.object({
  srednieSpalanie: z.coerce.number(),
  cenaPaliwa: z.coerce.number(),
  odleglosc: z.coerce.number(),
  liczbaOsob: z.coerce
    .number()
    .min(1, { message: "Nie może być mniej niż 1 osoba debilu" })
    .max(5, { message: "Ta, wiecej niż 5 to w bagażniku pojedziemy" }),
  procentZaOsobe: z.coerce.number(),
  parkingi: z.coerce.number(),
  autostrada: z.coerce.number(),
});

export function InputyDlaTrasy() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      srednieSpalanie: 0.0,
      cenaPaliwa: 0.0,
      odleglosc: 0,
      liczbaOsob: 1,
      procentZaOsobe: 5,
      parkingi: 0,
      autostrada: 0,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="m-3">
        <FormField
          control={form.control}
          name="srednieSpalanie"
          render={({ field }) => (
            <FormItem className="flex m-0 p-0 items-center justify-center">
              <FormLabel>Średnie spalanie:</FormLabel>
              <FormControl>
                <Input placeholder="7.5" {...field} />
              </FormControl>
              <FormDescription>l/100km</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cenaPaliwa"
          render={({ field }) => (
            <FormItem className="flex m-0 p-0 items-center justify-center">
              <FormLabel>Cena paliwa:</FormLabel>
              <FormControl>
                <Input placeholder="6.40" {...field} />
              </FormControl>
              <FormDescription>zł</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Licz</Button>
      </form>
    </Form>
  );
}
