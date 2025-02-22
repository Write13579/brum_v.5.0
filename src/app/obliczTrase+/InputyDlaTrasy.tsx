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
import { Circle, List, LoaderPinwheel, Pencil } from "lucide-react";
import { Odleglosc } from "@/lib/database/schema";
import DodajTrase from "./dodajTrase";
import {
  getRouteLength,
  getRoutePath,
  getRouteValue,
  RouteValue,
} from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

const FormSchema = z.object({
  srednieSpalanie: z.coerce.number(),
  cenaPaliwa: z.coerce.number(),
  odleglosc: z.number(),
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
    shorterLabel: `${trasa.startTrasy} -> ${trasa.koniecTrasy}`,
    label: `${trasa.startTrasy} -> ${
      trasa.koniecTrasy
    } (${trasa.odleglosc.toFixed(1)}km)`,
    value: getRouteValue(trasa),
    id: trasa.id,
  }));

  useEffect(() => {
    if (wybraneTrasy.length > 0) {
      const totalDistance = wybraneTrasy.reduce(
        (acc, curr) => acc + getRouteLength(curr as RouteValue),
        0
      );
      form.setValue("odleglosc", totalDistance);
    }

    setCheckedBoxes(
      [...Array(wybraneTrasy.length)].map(() => [
        false,
        false,
        false,
        false,
        false,
      ])
    );
  }, [wybraneTrasy, form]);

  //ADVANCED
  const [advancedDlaOsob, setAdvancedDlaOsob] = useState(false);
  const [checkedBoxes, setCheckedBoxes] = useState<boolean[][]>([]); //wszystkie boxy
  const [sumyCenOsobAdv, setSumyCenOsobAdv] = useState<number[]>([
    0, 0, 0, 0, 0,
  ]);

  useEffect(() => {
    const sumyOsobAdv = checkedBoxes.map((row) =>
      row ? row.filter(Boolean).length : 0
    );

    const sumyCenZaOsobeInEveryRowAdv = wybraneTrasy.map((trasa, idx) => {
      const odlegloscTrasy = getRouteLength(trasa as RouteValue);
      return sumyOsobAdv[idx] === 0
        ? 0
        : parseFloat(
            (
              (data.srednieSpalanie / 100) *
              odlegloscTrasy *
              data.cenaPaliwa *
              (1 + (sumyOsobAdv[idx] * data.procentZaOsobe) / 100)
            ).toFixed(2)
          ) / sumyOsobAdv[idx];
    });

    const newSumyCenOsobAdv = checkedBoxes.reduce((acc, rowOfBoxes, idx) => {
      rowOfBoxes.forEach((box, rowIdx) => {
        if (box) acc[rowIdx] += sumyCenZaOsobeInEveryRowAdv[idx];
      });
      return acc;
    }, Array(5).fill(0));

    setSumyCenOsobAdv(newSumyCenOsobAdv);
  }, [
    checkedBoxes,
    wybraneTrasy,
    data.cenaPaliwa,
    data.srednieSpalanie,
    data.procentZaOsobe,
  ]);

  return (
    <div className="px-5 m-3 flex flex-col gap-3">
      <Button className="flex justify-center items-center w-full">
        Pobierz dane z ostatniego zapisu
      </Button>
      <Form {...form}>
        <form className="text-nowrap flex flex-col items-center mx-3 md:mx-auto gap-1 justify-center md:max-w-[700px] md:[&>div]:w-full">
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
                    <div className="flex items-center gap-2">
                      <MultiSelect
                        options={convertedTrasy}
                        onValueChange={setWybraneTrasy}
                        defaultValue={wybraneTrasy}
                        className="bg-white text-black hover:bg-white"
                      />
                      <DodajTrase />
                    </div>
                  ) : (
                    <Input className="w-auto" placeholder="100" {...field} />
                  )}
                </FormControl>
                {wybierzTrase ? (
                  <div></div>
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
      <div
        id="advancedDlaOsob"
        className="flex justify-center items-center gap-2"
      >
        <Switch
          checked={advancedDlaOsob}
          onCheckedChange={setAdvancedDlaOsob}
        />
        <Label className="flex w-git">
          {!advancedDlaOsob ? <Circle /> : <LoaderPinwheel />}
        </Label>
      </div>
      {advancedDlaOsob && (
        <div className="flex flex-col gap-2 items-center">
          <div className="flex flex-row gap-6 justify-center items-center font-bold sticky top-0 left-0 bg-white/80 p-2 rounded-lg">
            <div className="w-8 text-center">1</div>
            <div className="w-8 text-center">2</div>
            <div className="w-8 text-center">3</div>
            <div className="w-8 text-center">4</div>
            <div className="w-8 text-center">5</div>
            <div className="w-24 text-center">kierunek</div>
          </div>
          <div className="flex flex-row gap-6 justify-center items-center font-bold mb-3 sticky top-0 left-0 bg-white/80 p-2 rounded-lg">
            {[0, 1, 2, 3, 4].map((idx) => (
              <div key={idx} className="w-8 text-center">
                {sumyCenOsobAdv[idx].toFixed(2)}zł
              </div>
            ))}
            <div className="w-24 text-center">
              suma:{" "}
              {sumyCenOsobAdv.reduce((acc, num) => acc + num, 0).toFixed(2)}zł
            </div>
          </div>
          {wybraneTrasy.map((trasa, idx) => (
            <div
              key={trasa}
              className="flex flex-row gap-6 justify-center items-center my-1 p-0.5 border bg-slate-200 rounded-sm"
            >
              {[0, 1, 2, 3, 4].map((rowIdx) => (
                <div
                  key={rowIdx}
                  className="w-8 flex justify-center items-center"
                >
                  <Checkbox
                    checked={checkedBoxes[idx][rowIdx]}
                    onCheckedChange={(e) => {
                      setCheckedBoxes((old) => {
                        const newCheckedBoxes = [...old]; // Tworzymy nową tablicę
                        newCheckedBoxes[idx] = [...newCheckedBoxes[idx]]; // Tworzymy nową tablicę dla wiersza
                        newCheckedBoxes[idx][rowIdx] = e as boolean; // Aktualizujemy wartość checkboxa
                        return newCheckedBoxes;
                      });
                    }}
                  />
                </div>
              ))}

              <div className="w-24 text-center">{`${getRoutePath(
                trasa as RouteValue
              )} (${getRouteLength(trasa as RouteValue)} km)`}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
