import { useState } from "react";
import { Row } from "~/components/app/screen";
import { Badge } from "~/components/ui/badge";

export function CareItemRowForLog({ 
  item,
  onClick
}:{ 
  item: {
    id: string;
    media: React.ReactNode;
    title: React.ReactNode;
    description: React.ReactNode;
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