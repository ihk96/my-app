import { useState } from "react";
import { Row } from "~/components/app/screen";
import { Badge } from "~/components/ui/badge";

export function CareItemRowForLog({ 
  item,
  onClick
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
  },
  onClick?: () => void;
}) {
  return (
    <Row
      onClick={onClick}
      media={item.media}
      title={item.title}
      description={item.description}
      trailing={
        <Badge className={item.badge.className}>{item.badge.label}</Badge>
      }
    />
  );
}