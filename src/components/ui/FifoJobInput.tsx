import type { PayType, FifoSwing } from "@/types/fifo.types";
import type { Control } from "react-hook-form";
import { useWatch } from "react-hook-form";
import type { FifoFormValues } from "@/schemas/fifo.schema";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { fifoSwingOptions } from "@/constants/fifo.constants";

interface FifoJobInputProps {
  jobNumber: 1 | 2;
  payType: PayType;
  setPayType: (payType: PayType) => void;
  control: Control<FifoFormValues>;
}

export function FifoJobInput({
  jobNumber,
  payType,
  setPayType,
  control,
}: FifoJobInputProps) {
  const suffix = jobNumber === 2 ? "Two" : "";
  const label = jobNumber === 2 ? " (Job 2)" : "";

  const superEnabled = useWatch({ control, name: `superannuation${suffix}` });
  return (
    <div className="flex-1 flex flex-col gap-6">
      <div className="flex gap-4 mb-4">
        <div className="flex flex-col">
          <span className="font-semibold mb-1">Job {jobNumber} Pay Type</span>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={payType === "hourly"}
              onChange={() => setPayType("hourly")}
            />
            Hourly
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={payType === "salary"}
              onChange={() => setPayType("salary")}
            />
            Salary
          </label>
        </div>
      </div>

      {payType === "hourly" ? (
        <FormField
          control={control}
          name={`hourlypay${suffix}` as keyof FifoFormValues}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hourly Pay{label}</FormLabel>
              <FormControl>
                <Input
                  placeholder="20"
                  type="number"
                  value={
                    typeof field.value === "number" && field.value !== 0
                      ? field.value
                      : ""
                  }
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? 0 : Number(e.target.value)
                    )
                  }
                  onBlur={field.onBlur}
                  name={field.name}
                />
              </FormControl>
              <FormDescription>
                {jobNumber === 1
                  ? "This is your hourly pay rate."
                  : "Second job hourly pay rate."}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : (
        <FormField
          control={control}
          name={`salary${suffix}` as keyof FifoFormValues}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Yearly Salary{label}</FormLabel>
              <FormControl>
                <Input
                  placeholder="100000"
                  type="number"
                  value={
                    typeof field.value === "number" && field.value !== 0
                      ? field.value
                      : ""
                  }
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? 0 : Number(e.target.value)
                    )
                  }
                  onBlur={field.onBlur}
                  name={field.name}
                />
              </FormControl>
              <FormDescription>
                {jobNumber === 1
                  ? "This is your gross annual salary."
                  : "Second job gross annual salary."}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Superannuation Toggle and Rate */}
      <FormField
        control={control}
        name={`superannuation${suffix}` as keyof FifoFormValues}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Superannuation{label}</FormLabel>
            <FormControl>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={Boolean(field.value)}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="mr-2"
                />
                <span>Include superannuation</span>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {superEnabled ? (
        <>
          <FormField
            control={control}
            name={`superRate${suffix}` as keyof FifoFormValues}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Superannuation Rate (%) {label}</FormLabel>
                <FormControl>
                  <Input
                    placeholder="12"
                    type="number"
                    min={0}
                    max={100}
                    value={
                      typeof field.value === "number" && field.value !== 0
                        ? field.value
                        : ""
                    }
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? 0 : Number(e.target.value)
                      )
                    }
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                </FormControl>
                <FormDescription>
                  You can change the superannuation rate if needed. Default is
                  12%.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {payType === "hourly" && (
            <FormField
              control={control}
              name={`superHoursPerDay${suffix}` as keyof FifoFormValues}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Super Hours Per Day{label}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="8"
                      type="number"
                      min={1}
                      max={12}
                      value={
                        typeof field.value === "number" && field.value !== 0
                          ? field.value
                          : ""
                      }
                      onChange={(e) => {
                        let val = Number(e.target.value);
                        if (val > 12) val = 12;
                        if (val < 1) val = 1;
                        field.onChange(e.target.value === "" ? 8 : val);
                      }}
                      onBlur={field.onBlur}
                      name={field.name}
                    />
                  </FormControl>
                  <FormDescription>
                    Number of hours per day that super is paid on (default 8,
                    max 12).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </>
      ) : null}

      <FormField
        control={control}
        name={`backpacker${suffix}` as keyof FifoFormValues}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Backpacker{label}</FormLabel>
            <FormControl>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={Boolean(field.value)}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="mr-2"
                />
                <span>Apply backpacker tax rates</span>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`swings${suffix}` as keyof FifoFormValues}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Swings{label}</FormLabel>
            <FormControl>
              <select
                {...field}
                value={String(field.value ?? "")}
                className="border rounded px-2 py-1 w-full"
              >
                {jobNumber === 2 && <option value="">Select swing</option>}
                {fifoSwingOptions.map((swing: FifoSwing) => (
                  <option key={swing.name} value={swing.name}>
                    {swing.name}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
