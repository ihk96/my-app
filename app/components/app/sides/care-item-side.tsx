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
          {/* <FieldGroup>

            <Field>
              <FieldLabel>항목 이름</FieldLabel>
              <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </Field>

            <Field>
              <FieldLabel>유형</FieldLabel>
              <ToggleGroup variant={"outline"} value={[type]} onValueChange={(value) => setType(value[0])}>
                <ToggleGroupItem value="type1">수시</ToggleGroupItem>
                <ToggleGroupItem value="type2">주기</ToggleGroupItem>
              </ToggleGroup>
            </Field>

            {
              type === "type2" && (
              <Field>
                <FieldLabel>주기</FieldLabel>
                <div className="flex gap-2">
                  <Input type="number" value={interval} onChange={(e) => setInterval(Number(e.target.value))} />
                  <Select items={frequencyOptions} value={frequency} onValueChange={(value) => setFrequency(value!)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {frequencyOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </Field>
              )
            }
          </FieldGroup> */}
				</CardContent>
			</Panel>
      <Button>저장</Button>
    </div>
  );
}