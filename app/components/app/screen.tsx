import type * as React from "react";

import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";

/**
 * 화면을 구성하는 큰 면. 전역 --radius는 버튼·배지 기준으로 작게 두고,
 * 카드처럼 넓은 면만 여기서 한 단계 더 둥글게 올린다.
 */
function Panel({ className, ...props }: React.ComponentProps<typeof Card>) {
  return <Card className={cn("rounded-3xl", className)} {...props} />;
}

/** 각 탭 화면의 바깥 껍데기. 세로 간격과 좌우 여백을 한 곳에서 잡는다. */
function Screen({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-4 px-4 pt-3 pb-6", className)}
      {...props}
    />
  );
}

function ScreenHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h1 className="font-heading text-xl font-semibold tracking-tight">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

const toneText = {
  default: "text-muted-foreground",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
} as const;

type Tone = keyof typeof toneText;

/** 수치 3개를 나란히 놓는 타일. 값은 tabular-nums로 자릿수를 맞춘다. */
function StatTile({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  tone?: Tone;
}) {
  return (
    <div className="flex flex-col gap-0.5 rounded-lg bg-muted px-3 py-2.5">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className="text-base font-semibold tracking-tight tabular-nums">
        {value}
      </span>
      {hint ? (
        <span className={cn("text-[11px] font-medium", toneText[tone])}>
          {hint}
        </span>
      ) : null}
    </div>
  );
}

function RowGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("divide-y divide-border", className)} {...props} />;
}

/** 리스트 한 줄. media는 이모지(품목·반려동물)나 lucide 아이콘 모두 받는다. */
function Row({
  media,
  title,
  description,
  trailing,
}: {
  media?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
      {media ? (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-base text-muted-foreground">
          {media}
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{title}</p>
        {description ? (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {trailing ? <div className="shrink-0">{trailing}</div> : null}
    </div>
  );
}

/** 카드 안 소제목 + 우측 보조 정보. */
function SectionTitle({
  children,
  aside,
}: {
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <h2 className="text-xs font-medium text-muted-foreground">{children}</h2>
      {aside ? (
        <span className="text-xs text-muted-foreground">{aside}</span>
      ) : null}
    </div>
  );
}

/** 남은 예산·습도처럼 "채워진 정도"를 보여주는 막대. */
function Meter({
  value,
  tone = "default",
  className,
}: {
  value: number;
  tone?: "default" | "warning";
  className?: string;
}) {
  return (
    <div className={cn("h-1.5 w-full rounded-full bg-muted", className)}>
      <div
        className={cn(
          "h-full rounded-full",
          tone === "warning" ? "bg-warning" : "bg-primary"
        )}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export {
  Screen,
  ScreenHeader,
  Panel,
  StatTile,
  RowGroup,
  Row,
  SectionTitle,
  Meter,
};
