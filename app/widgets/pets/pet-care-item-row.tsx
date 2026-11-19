import { useState } from "react";
import { Row } from "~/components/app/screen";
import { Badge } from "~/components/ui/badge";
import { CareLogDrawer } from "./care-log-form";
import pets, { CreatePetCareLogRequestData } from "~/lib/api/pets";
import type { z } from "zod/v4";

export function CareItemRowForLog({ 
  item
}:{ 
  item: {
    id: string;
    media: string;
    title: string;
    description: string;
    badge: {
      className: string;
      label: string;
    };
  }
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Row
        onClick={() => setOpen(true)}
        media={item.media}
        title={item.title}
        description={item.description}
        trailing={
          <Badge className={item.badge.className}>{item.badge.label}</Badge>
        }
      />
      <CareLogDrawer
        title={`돌봄 기록 · ${item.title}`}
        description={item.description}
        open={open}
        onOpenChange={setOpen}
        onSubmit={(value)=>{
          const body: z.infer<typeof CreatePetCareLogRequestData> = {
            memo: value.memo,
            performed_at: value.date+"T"+value.time
          }
          console.log(body);
          // pets.createPetCareLog(item.id, body);
        }}
      />
    </>
  );
}