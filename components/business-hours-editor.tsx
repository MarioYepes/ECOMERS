"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  type BusinessHoursV2,
  DAY_LABELS,
  DAY_ORDER,
  type HoursPreset,
  applyPreset,
  defaultBusinessHours,
  getBusinessHoursState,
  inferUiPreset,
  serializeBusinessHours,
  setOpen24h,
} from "@/lib/business-hours"

const timeInputClass =
  "h-10 w-full min-w-[7.5rem] rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"

function referenceTimes(model: BusinessHoursV2): { open: string; close: string } {
  const d = model.days.mon
  if (d.enabled) return { open: d.open, close: d.close }
  return { open: "08:00", close: "18:00" }
}

type Props = {
  value: string
  onChange: (serialized: string) => void
  disabled?: boolean
}

export function BusinessHoursEditor({ value, onChange, disabled = false }: Props) {
  const model = getBusinessHoursState(value)
  const preset: HoursPreset = model.uiPreset ?? inferUiPreset(model)

  const push = (next: BusinessHoursV2) => {
    onChange(serializeBusinessHours(next))
  }

  const onPresetChange = (nextPreset: HoursPreset) => {
    if (nextPreset === "custom") {
      push({ ...model, open24h: false, uiPreset: "custom", days: { ...model.days } })
      return
    }
    const { open, close } = referenceTimes(model)
    push(applyPreset(model, nextPreset, open, close))
  }

  const applySimpleTimes = (open: string, close: string, p: Exclude<HoursPreset, "custom">) => {
    push(applyPreset(model, p, open, close))
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-muted/20 px-4 py-3">
        <div className="space-y-0.5">
          <Label htmlFor="bh-24h" className="text-foreground">
            Abierto 24 horas
          </Label>
          <p className="text-xs text-muted-foreground">Misma atención todos los días, sin cierre</p>
        </div>
        <Switch
          id="bh-24h"
          checked={model.open24h}
          disabled={disabled}
          onCheckedChange={(c) => {
            if (c) push(setOpen24h())
            else push(defaultBusinessHours())
          }}
        />
      </div>

      {!model.open24h && (
        <>
          <div className="space-y-2">
            <Label className="text-muted-foreground">¿Qué días atienden?</Label>
            <Select
              value={preset}
              disabled={disabled}
              onValueChange={(v) => onPresetChange(v as HoursPreset)}
            >
              <SelectTrigger className="h-10 w-full border-border md:w-full">
                <SelectValue placeholder="Elige una opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lun_vie">Lunes a viernes (mismo horario)</SelectItem>
                <SelectItem value="lun_sab">Lunes a sábado (mismo horario)</SelectItem>
                <SelectItem value="all">Todos los días (mismo horario)</SelectItem>
                <SelectItem value="custom">Personalizar cada día</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Igual que en la mayoría de apps de comercio: primero eliges los días y luego el rango horario.
            </p>
          </div>

          {preset !== "custom" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label className="mb-1.5 block text-muted-foreground">Desde</Label>
                <input
                  type="time"
                  disabled={disabled}
                  value={model.days.mon.open}
                  onChange={(e) => {
                    if (preset === "custom") return
                    applySimpleTimes(e.target.value, model.days.mon.close, preset)
                  }}
                  className={timeInputClass}
                />
              </div>
              <div>
                <Label className="mb-1.5 block text-muted-foreground">Hasta</Label>
                <input
                  type="time"
                  disabled={disabled}
                  value={model.days.mon.close}
                  onChange={(e) => {
                    if (preset === "custom") return
                    applySimpleTimes(model.days.mon.open, e.target.value, preset)
                  }}
                  className={timeInputClass}
                />
              </div>
            </div>
          )}

          {preset === "custom" && (
            <div className="space-y-0 divide-y divide-border rounded-lg border border-border">
              {DAY_ORDER.map((id) => {
                const d = model.days[id]
                return (
                  <div
                    key={id}
                    className="flex flex-col gap-3 p-4 first:pt-3 last:pb-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                  >
                    <div className="flex items-center justify-between gap-3 sm:min-w-[200px] sm:justify-start">
                      <span className="text-sm font-medium text-foreground">{DAY_LABELS[id]}</span>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={d.enabled}
                          disabled={disabled}
                          onCheckedChange={(c) => {
                            push({
                              ...model,
                              open24h: false,
                              uiPreset: "custom",
                              days: {
                                ...model.days,
                                [id]: { ...d, enabled: c },
                              },
                            })
                          }}
                        />
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {d.enabled ? "Abierto" : "Cerrado"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                      <input
                        type="time"
                        disabled={disabled || !d.enabled}
                        value={d.open}
                        onChange={(e) => {
                          push({
                            ...model,
                            open24h: false,
                            uiPreset: "custom",
                            days: { ...model.days, [id]: { ...d, open: e.target.value } },
                          })
                        }}
                        className={`${timeInputClass} sm:w-36`}
                      />
                      <span className="text-sm text-muted-foreground">a</span>
                      <input
                        type="time"
                        disabled={disabled || !d.enabled}
                        value={d.close}
                        onChange={(e) => {
                          push({
                            ...model,
                            open24h: false,
                            uiPreset: "custom",
                            days: { ...model.days, [id]: { ...d, close: e.target.value } },
                          })
                        }}
                        className={`${timeInputClass} sm:w-36`}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
