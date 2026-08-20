import { cn } from "@/lib/cn";

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/8 bg-steel-800/80 shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}) {
  const variants = {
    primary:
      "bg-amber-500 text-zinc-950 hover:bg-amber-400 font-semibold shadow-[0_0_24px_rgba(245,158,11,0.18)]",
    outline:
      "border border-white/12 bg-white/2 text-zinc-200 hover:border-amber-500/50 hover:text-amber-300",
    ghost: "text-zinc-400 hover:text-zinc-100 hover:bg-white/5",
    danger: "text-red-400 hover:bg-red-500/10",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm transition-colors disabled:pointer-events-none disabled:opacity-40",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </span>
      {children}
      {hint ? (
        <span className="mt-1.5 block text-xs text-zinc-500">{hint}</span>
      ) : null}
    </label>
  );
}

const controlClass =
  "w-full rounded-lg border border-white/10 bg-steel-950/70 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-amber-500/70 focus:ring-2 focus:ring-amber-500/15";

export function Input({ className, ...props }) {
  return <input className={cn(controlClass, className)} {...props} />;
}

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(controlClass, "min-h-[96px] resize-y", className)}
      {...props}
    />
  );
}

export function Badge({ tone = "neutral", children }) {
  const tones = {
    neutral: "bg-white/6 text-zinc-300 ring-white/10",
    heat: "bg-amber-500/12 text-amber-300 ring-amber-500/20",
    good: "bg-emerald-500/12 text-emerald-300 ring-emerald-500/20",
    warn: "bg-orange-500/12 text-orange-300 ring-orange-500/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ring-1",
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}

export function Stat({ label, value, hint }) {
  return (
    <div className="rounded-xl border border-white/8 bg-steel-950/40 px-4 py-3">
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </div>
      <div className="mt-1 font-mono text-xl font-semibold tracking-tight text-zinc-50">
        {value}
      </div>
      {hint ? <div className="mt-1 text-xs text-zinc-500">{hint}</div> : null}
    </div>
  );
}

export function Callout({ children }) {
  return (
    <div className="rounded-lg border border-amber-500/20 bg-amber-500/8 px-4 py-3 text-sm text-amber-100/90">
      {children}
    </div>
  );
}

export function StepHeading({ icon: Icon, title, description, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3">
        {Icon ? (
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-400">
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-50">
            {title}
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-zinc-400">
            {description}
          </p>
        </div>
      </div>
      {action}
    </div>
  );
}
