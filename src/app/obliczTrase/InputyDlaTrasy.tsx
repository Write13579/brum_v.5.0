"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { useState } from "react";

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

  const [caloscBezOsob, setCaloscBezOsob] = useState(0);
  const [caloscZOsobami, setCaloscZOsobami] = useState(0);
  const [zaOsobe, setZaOsobe] = useState(0);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const caloscBezOsob = parseFloat(
      (
        (data.srednieSpalanie / 100) * data.odleglosc * data.cenaPaliwa +
        data.parkingi +
        data.autostrada
      ).toFixed(2)
    );
    setCaloscBezOsob(caloscBezOsob);

    const caloscZOsobami = parseFloat(
      (
        (data.srednieSpalanie / 100) *
          data.odleglosc *
          data.cenaPaliwa *
          (1 + data.procentZaOsobe / 100) +
        data.parkingi +
        data.autostrada
      ).toFixed(2)
    );
    setCaloscZOsobami(caloscZOsobami);

    const zaOsobe = parseFloat((caloscZOsobami / data.liczbaOsob).toFixed(2));
    setZaOsobe(zaOsobe);
  }

  return (
    <div className="px-5 m-3">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
                <FormDescription>zł/l</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="odleglosc"
            render={({ field }) => (
              <FormItem className="flex m-0 p-0 items-center justify-center">
                <FormLabel>Odległość:</FormLabel>
                <FormControl>
                  <Input placeholder="100" {...field} />
                </FormControl>
                <FormDescription>km</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="liczbaOsob"
            render={({ field }) => (
              <FormItem className="flex m-0 p-0 items-center justify-center">
                <FormLabel>Liczba osób:</FormLabel>
                <FormControl>
                  <Input placeholder="2" {...field} />
                </FormControl>
                <FormDescription>os.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="procentZaOsobe"
            render={({ field }) => (
              <FormItem className="flex m-0 p-0 items-center justify-center">
                <FormLabel>Procent za osobę:</FormLabel>
                <FormControl>
                  <Input placeholder="8" {...field} />
                </FormControl>
                <FormDescription>%</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <FormField
            control={form.control}
            name="parkingi"
            render={({ field }) => (
              <FormItem className="flex m-0 p-0 items-center justify-center">
                <FormLabel>Parkingi:</FormLabel>
                <FormControl>
                  <Input placeholder="0" {...field} />
                </FormControl>
                <FormDescription>zł</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <FormField
            control={form.control}
            name="autostrada"
            render={({ field }) => (
              <FormItem className="flex m-0 p-0 items-center justify-center">
                <FormLabel>Autostrada:</FormLabel>
                <FormControl>
                  <Input placeholder="0" {...field} />
                </FormControl>
                <FormDescription>%</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Licz</Button>
        </form>
      </Form>
      <div id="outputy">
        <div id="caloscBezOsob">
          <span>Całość bez osób: </span>
          <span>{caloscBezOsob}zł</span>
        </div>
        <div id="caloscZOsobami">
          <span>Całość z osobami: </span>
          <span>{caloscZOsobami}zł</span>
        </div>
        <div id="zaOsobe">
          <span>Za osobę: </span>
          <span>{zaOsobe}zł</span>
        </div>
      </div>
    </div>
  );
}
