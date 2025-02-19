"use client";

import { Card, shuffle } from "@/lib/utils";
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
  numberOfDecks: z.coerce.number().min(1, {
    message: "Number of decks must be at least 1",
  }),
});

export default function Blackjack() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      numberOfDecks: 0,
    },
  });

  const numberOfDecks = form.watch("numberOfDecks");
  console.log(`number` + numberOfDecks);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const oneFullDeck = Array(data.numberOfDecks)
      .fill(Object.values(Card))
      .flat();
    const shuffledDeck = shuffle(oneFullDeck);
    const valuesDeck = shuffledDeck
      .map((card) => card.slice(0, -2))
      .map((card) => (["J", "Q", "K"].includes(card) ? "10" : card));
  }

  return (
    <div id="alles">
      {numberOfDecks === 0 || numberOfDecks === null ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex justify-center items-center flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="numberOfDecks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of decks</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormDescription>
                    Thats the number of decks you want to play with
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      ) : (
        <div>niger</div>
      )}
    </div>
  );
}
