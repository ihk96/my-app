import { CardContent } from "~/components/ui/card";
import { Panel, Row, RowGroup, SectionTitle } from "../screen";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "~/components/ui/field";
import Fi from "zod/v4/locales/fi.cjs";
import { Input } from "~/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import CareItemForm from "./care-item-form";


const frequencyOptions = [
  { value: "daily", label: "매일" },
  { value: "weekly", label: "매주" },
  { value: "monthly", label: "매월" },
];

export default function CareItemSidePage(){
  const [name, setName] = useState("");
  const [type, setType] = useState("type1");

  const [frequency, setFrequency] = useState("daily");
  const [interval, setInterval] = useState(1);
  
  return (
    <div className="flex flex-col gap-4">
      <Panel>
				<CardContent className="flex flex-col gap-3">
          <CareItemForm />
				</CardContent>
			</Panel>
      <Button>저장</Button>
    </div>
  );
}