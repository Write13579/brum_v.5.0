"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { dodajTrase } from "./actions";
import { ArrowRightIcon } from "lucide-react";

export default function DodajTrase() {
  const [opened, setOpened] = useState(false);

  const infoSchema = z.object({
    startTrasy: z.string().max(256).nonempty({ message: "wpisz tu coś" }),

    koniecTrasy: z.string().max(256).nonempty({ message: "wpisz tu coś" }),

    odleglosc: z.coerce.number().min(0.1, { message: "za mało" }),
  });

  const form = useForm<z.infer<typeof infoSchema>>({
    resolver: zodResolver(infoSchema),
    defaultValues: {
      startTrasy: "",
      koniecTrasy: "",
      odleglosc: 0,
    },
  });
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof infoSchema>) {
    const res = await dodajTrase(
      values.startTrasy,
      values.koniecTrasy,
      values.odleglosc + 0.1
    );
    if (!res.data) {
      toast({
        title: "Dodano trasę!",
        description: "Możesz teraz z niej skorzystać bałwanie.",
      });
      setOpened(false);
      form.reset();
      router.refresh();
      return;
    }
  }

  return (
    <Dialog open={opened} onOpenChange={setOpened}>
      <DialogTrigger asChild>
        <Button>Dodaj trasę</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Dodaj trasę</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 m-6 mt-4"
            >
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="startTrasy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Start Trasy</FormLabel>
                      <FormControl>
                        <Input placeholder={"np. Dom"} {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-center items-center">
                  <ArrowRightIcon />
                </div>
                <FormField
                  control={form.control}
                  name="koniecTrasy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Koniec Trasy</FormLabel>
                      <FormControl>
                        <Input placeholder={"np. Uczelnia"} {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="odleglosc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Odleglość (km)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={"np. 23,1"}
                        {...field}
                        value={field.value ?? 0}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div id="dodajTrase" className="flex justify-center">
                <Button
                  type="submit"
                  className="font-bold"
                  loading={form.formState.isSubmitting}
                >
                  Dodaj
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
