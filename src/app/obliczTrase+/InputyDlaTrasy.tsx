"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { useEffect, useState } from "react";
import OutputComp from "./outputComp";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/mulitSelect";
import { List, Pencil } from "lucide-react";
import { Odleglosc } from "@/lib/database/schema";
import DodajTrase from "./dodajTrase";

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

export function InputyDlaTrasy({ trasy }: { trasy: Odleglosc[] }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      srednieSpalanie: 7,
      cenaPaliwa: 6.35,
      odleglosc: 100,
      liczbaOsob: 1,
      procentZaOsobe: 5,
      parkingi: 0,
      autostrada: 0,
    },
  });

  const [caloscBezOsob, setCaloscBezOsob] = useState(0);
  const [caloscZOsobami, setCaloscZOsobami] = useState(0);
  const [zaOsobe, setZaOsobe] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { watch, control } = form;
  const data = watch();

  useEffect(() => {
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
          (1 + (data.liczbaOsob * data.procentZaOsobe) / 100) +
        data.parkingi +
        data.autostrada
      ).toFixed(2)
    );
    setCaloscZOsobami(caloscZOsobami);

    const zaOsobe = parseFloat((caloscZOsobami / data.liczbaOsob).toFixed(2));
    setZaOsobe(zaOsobe);
  }, [data]);

  const [wybierzTrase, setWybierzTrase] = useState(false);

  const [wybraneTrasy, setWybraneTrasy] = useState<string[]>([]);

  const convertedTrasy = trasy.map((trasa) => ({
    label: `${trasa.startTrasy} -> ${trasa.koniecTrasy}`,
    value: trasa.odleglosc.toString(),
    id: trasa.id,
  }));

  useEffect(() => {
    if (wybraneTrasy.length > 0) {
      const totalDistance = wybraneTrasy.reduce(
        (acc, curr) => acc + parseFloat(curr),
        0
      );
      form.setValue("odleglosc", totalDistance);
    }
  }, [wybraneTrasy]);

  return (
    <div className="px-5 m-3 flex flex-col gap-3">
      <Button className="flex justify-center items-center w-full">
        Pobierz dane z ostatniego zapisu
      </Button>
      <Form {...form}>
        <form className="text-nowrap flex flex-col items-center mx-3 gap-1 justify-center">
          <FormField
            control={form.control}
            name="srednieSpalanie"
            render={({ field }) => (
              <FormItem className="grid grid-cols-3 m-0 p-0 items-center justify-center">
                <FormLabel>Średnie spalanie:</FormLabel>
                <FormControl>
                  <Input className="w-auto" placeholder="7.5" {...field} />
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
              <FormItem className="grid grid-cols-3 m-0 p-0 items-center justify-center">
                <FormLabel>Cena paliwa:</FormLabel>
                <FormControl>
                  <Input className="w-auto" placeholder="6.40" {...field} />
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
              <FormItem className="grid grid-cols-3 m-0 p-0 items-center justify-center">
                <FormLabel>Odległość:</FormLabel>
                <FormControl>
                  {wybierzTrase ? (
                    <MultiSelect
                      options={convertedTrasy}
                      onValueChange={setWybraneTrasy}
                      defaultValue={wybraneTrasy}
                      className="m-auto w-auto"
                    />
                  ) : (
                    <Input className="w-auto" placeholder="100" {...field} />
                  )}
                </FormControl>
                {wybierzTrase ? (
                  <DodajTrase />
                ) : (
                  <FormDescription>km</FormDescription>
                )}
                <div className="flex justify-start items-start w-full gap-2">
                  <Switch
                    checked={wybierzTrase}
                    onCheckedChange={setWybierzTrase}
                  />
                  <Label className="flex w-git">
                    {wybierzTrase ? <Pencil /> : <List />}
                  </Label>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="liczbaOsob"
            render={({ field }) => (
              <FormItem className="grid grid-cols-3 m-0 p-0 items-center justify-center">
                <FormLabel>Liczba osób:</FormLabel>
                <FormControl>
                  <Input className="w-auto" placeholder="2" {...field} />
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
              <FormItem className="grid grid-cols-3 m-0 p-0 items-center justify-center">
                <FormLabel>Procent za osobę:</FormLabel>
                <FormControl>
                  <Input className="w-auto" placeholder="8" {...field} />
                </FormControl>
                <FormDescription>%</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="parkingi"
            render={({ field }) => (
              <FormItem className="grid grid-cols-3 m-0 p-0 items-center justify-center">
                <FormLabel>Parkingi:</FormLabel>
                <FormControl>
                  <Input
                    className="w-auto"
                    placeholder="0"
                    {...field}
                    onChange={(e) => {
                      const value =
                        e.target.value === "" ? 0 : parseFloat(e.target.value);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormDescription>zł</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="autostrada"
            render={({ field }) => (
              <FormItem className="grid grid-cols-3 m-0 p-0 items-center justify-center">
                <FormLabel>Autostrada:</FormLabel>
                <FormControl>
                  <Input
                    className="w-auto"
                    placeholder="0"
                    {...field}
                    onChange={(e) => {
                      const value =
                        e.target.value === "" ? 0 : Number(e.target.value);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormDescription>zł</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <div id="outputy" className="mt-5 flex gap-3 w-full justify-center">
        <OutputComp
          liczba={caloscBezOsob}
          opis="Całość bez osób"
          kolor="#fca5a5"
        />
        <OutputComp
          liczba={caloscZOsobami}
          opis="Całość z osobami"
          kolor="#86efac"
        />
        <OutputComp liczba={zaOsobe} opis="Za osobę" kolor="#d8b4fe" />
      </div>
    </div>
  );
}
