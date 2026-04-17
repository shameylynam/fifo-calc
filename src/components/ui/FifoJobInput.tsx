import type { PayType, FifoSwing } from "@/types/fifo.types";
import type { Control } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { cn } from "@/lib/utils";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fifoSwingOptions } from "@/constants/fifo.constants";

interface FifoJobInputProps {
  jobNumber: 1 | 2;
  payType: PayType;
  setPayType: (payType: PayType) => void;
  control: Control<FifoFormValues>;
}

interface ToggleCardProps {
  checked: boolean;
  title: string;
  description: string;
  onPressedChange: (checked: boolean) => void;
}

function ToggleCard({
  checked,
  title,
  description,
  onPressedChange,
}: ToggleCardProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onPressedChange(!checked)}
      className={cn(
        "flex w-full items-start justify-between gap-4 rounded-xl border px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        checked
          ? "border-border bg-background shadow-sm ring-1 ring-border"
          : "bg-muted/30 hover:bg-background/70",
      )}
    >
      <div className="space-y-1">
        <span className="block text-sm font-medium text-foreground">
          {title}
        </span>
        <span className="block text-xs text-muted-foreground">
          {description}
        </span>
      </div>
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex min-w-[3.25rem] items-center justify-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]",
          checked
            ? "bg-foreground text-background"
            : "bg-muted text-muted-foreground",
        )}
      >
        {checked ? "On" : "Off"}
      </span>
    </button>
  );
}

export function FifoJobInput({
  jobNumber,
  payType,
  setPayType,
  control,
}: FifoJobInputProps) {
  const suffix = jobNumber === 2 ? "Two" : "";
  const label = jobNumber === 2 ? " (Job 2)" : "";
  const payTypeGroupId = `job-${jobNumber}-pay-type`;

  const superEnabled = useWatch({ control, name: `superannuation${suffix}` });
  return (
    <div className="flex-1 flex flex-col gap-6">
      <fieldset className="space-y-3">
        <div className="space-y-1">
          <legend className="text-sm font-semibold tracking-tight">
            Job {jobNumber} Pay Type
          </legend>
          <p className="text-sm text-muted-foreground">
            Choose whether this role is entered as an hourly rate or annual
            salary.
          </p>
        </div>

        <RadioGroup
          id={payTypeGroupId}
          aria-label={`Job ${jobNumber} pay type`}
          value={payType}
          onValueChange={(value) => setPayType(value as PayType)}
          className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-muted/30 p-1"
        >
          <label
            htmlFor={`${payTypeGroupId}-hourly`}
            className="block cursor-pointer"
          >
            <RadioGroupItem
              id={`${payTypeGroupId}-hourly`}
              value="hourly"
              className="peer sr-only"
            />
            <div className="rounded-lg px-4 py-3 text-left transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-data-[state=checked]:bg-background peer-data-[state=checked]:shadow-sm peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-border hover:bg-background/70">
              <span className="block text-sm font-medium text-foreground">
                Hourly
              </span>
              <span className="mt-1 block text-xs text-muted-foreground">
                Enter a pay rate per hour worked.
              </span>
            </div>
          </label>

          <label
            htmlFor={`${payTypeGroupId}-salary`}
            className="block cursor-pointer"
          >
            <RadioGroupItem
              id={`${payTypeGroupId}-salary`}
              value="salary"
              className="peer sr-only"
            />
            <div className="rounded-lg px-4 py-3 text-left transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-data-[state=checked]:bg-background peer-data-[state=checked]:shadow-sm peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-border hover:bg-background/70">
              <span className="block text-sm font-medium text-foreground">
                Salary
              </span>
              <span className="mt-1 block text-xs text-muted-foreground">
                Enter a gross annual salary figure.
              </span>
            </div>
          </label>
        </RadioGroup>
      </fieldset>

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
                      e.target.value === "" ? 0 : Number(e.target.value),
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
                      e.target.value === "" ? 0 : Number(e.target.value),
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
          <FormItem className="space-y-3">
            <FormLabel>Superannuation{label}</FormLabel>
            <FormControl>
              <ToggleCard
                checked={Boolean(field.value)}
                onPressedChange={field.onChange}
                title="Include superannuation"
                description="Factor employer super into the annual and monthly results."
              />
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
                        e.target.value === "" ? 0 : Number(e.target.value),
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
          <FormItem className="space-y-3">
            <FormLabel>Backpacker{label}</FormLabel>
            <FormControl>
              <ToggleCard
                checked={Boolean(field.value)}
                onPressedChange={field.onChange}
                title="Apply backpacker tax rates"
                description="Use backpacker tax brackets instead of standard Australian resident rates."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`hecsDebt${suffix}` as keyof FifoFormValues}
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>HECS-HELP Debt{label}</FormLabel>
            <FormControl>
              <ToggleCard
                checked={Boolean(field.value)}
                onPressedChange={field.onChange}
                title="Apply HECS-HELP repayments"
                description="Include compulsory HELP repayments in the estimated take-home pay."
              />
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
              <Select
                name={field.name}
                value={String(field.value ?? "")}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue placeholder="Select swing" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  {fifoSwingOptions.map((swing: FifoSwing) => (
                    <SelectItem key={swing.name} value={swing.name}>
                      {swing.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription>
              Choose the FIFO roster pattern for this job.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
