import { sameDay } from "./date-utils";

export function careRowDescription(item: {
  cycle_type: string;
  last_care_at?: string;
  interval?: number;
  interval_type?: string;
}) {
  let description = "";

  description += item.cycle_type === "Anytime" ? "수시" : "주기";

  let lastDate = item.last_care_at ? new Date(item.last_care_at) : undefined;

  if(item.cycle_type === "Regular") {
    if(item.interval && item.interval_type) {
      description += ` · ${item.interval}${item.interval_type === "AfterDays" ? "일" : item.interval_type === "Weeks" ? "주" : "개월"}`;
    }
  }
  
  if(lastDate) {
    if(sameDay(lastDate, new Date())) {
      description += " · [마지막] 오늘 " + lastDate.toTimeString().substring(0,5);
    } else {
      description += " · [마지막] " + lastDate.toLocaleDateString().substring(2,12).replaceAll(' ','');
    }
  }

  return description;
}