import { useRef, useState } from "react";
import { Field, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { Panel } from "../screen";
import { CardContent } from "~/components/ui/card";
import { Attachment, AttachmentAction, AttachmentActions, AttachmentContent, AttachmentDescription, AttachmentMedia, AttachmentTitle, AttachmentTrigger } from "~/components/ui/attachment";
import { XIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";

const SPECIES = [{label: "종을 선택해주세요.", value: ""}, { label: "도마뱀", value: "도마뱀" }, { label: "거북이", value: "거북이" }, { label: "뱀", value: "뱀" }, { label: "고양이", value: "고양이" }, { label: "강아지", value: "강아지" }, { label: "햄스터", value: "햄스터" }, { label: "기타", value: "기타" }];
const GENDERS = [{label: "성별을 선택해주세요.", value: ""}, { label: "수컷", value: "수컷" }, { label: "암컷", value: "암컷" }];

export type PetsItemFormValue = {
  name: string;
  species: string;
  gender: string;
  familyDate: Date;
  birthday: Date;
  additionalInfo: string[];
};

type PetsItemFormProps = {
  value?: PetsItemFormValue;
  onChange?: (value: PetsItemFormValue) => void;
};

export default function PetsItemForm({ value: controlled, onChange }: PetsItemFormProps) {
  const [internal, setInternal] = useState<PetsItemFormValue>(controlled ?? { name: "", species: "", gender: "", familyDate: new Date(), birthday: new Date(), additionalInfo: [""] });
  const value = controlled ?? internal;


  const update = (patch: Partial<PetsItemFormValue>) => {
    const next = { ...value, ...patch };
    setInternal(next);
    onChange?.(next);
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);



  return (
    <div className="flex flex-col gap-4">
      <Panel>
				<CardContent className="flex flex-col gap-3">
          <FieldGroup>
            <Field>
              <div className="flex justify-center">
                <Attachment orientation="vertical" className="size-40">
                  <AttachmentMedia variant="image">
                    <img src={selectedFile ? URL.createObjectURL(selectedFile) : ""} />
                  </AttachmentMedia>
                  <AttachmentActions>
                    <AttachmentAction>
                      <XIcon />
                    </AttachmentAction>
                  </AttachmentActions>
                  {
                    selectedFile && (
                      <Dialog>
                        <DialogTrigger>
                          <AttachmentTrigger/>
                        </DialogTrigger>
                        <DialogContent className="w-screen h-screen max-w-none! rounded-none">
                          <img src={selectedFile ? URL.createObjectURL(selectedFile) : ""} />
                        </DialogContent>
                      </Dialog>
                    )
                  }
                  {
                    !selectedFile && (
                      <AttachmentTrigger
                        render={
                            <button
                              onClick={() => {fileInputRef.current?.click()}}
                            />
                        }
                      />
                    )
                  }
                </Attachment>
                <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => { setSelectedFile(e.target.files?.[0] ?? undefined); }} />
              </div>
            </Field>
            <Field>
              <FieldLabel htmlFor="care-item-name">이름</FieldLabel>
              <Input
                id="care-item-name"
                type="text"
                value={value.name}
                onChange={(e) => update({ name: e.target.value })}
                placeholder="예) 도봉이, 오월"
              />
            </Field>
            <Field>
              <FieldLabel>종</FieldLabel>
              <Select
                  items={SPECIES}
                  value={value.species}
                  onValueChange={(next) => {
                    if(next){
                      update({ species: next });
                    }
                  }}
                >
                  <SelectTrigger className="flex-1 max-w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {SPECIES.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
            </Field>
            <Field>
              <FieldLabel>성별</FieldLabel>
              <Select
                  items={GENDERS}
                  value={value.gender}
                  onValueChange={(next) => {
                    if(next){
                      update({ gender: next });
                    }
                  }}
                >
                  <SelectTrigger className="flex-1 max-w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {GENDERS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
            </Field>

            <Field className="w-40">
              <FieldLabel>생일</FieldLabel>
              <Input
                id="care-item-birthday"
                type="date"
                value={value.birthday.toISOString().split("T")[0]}
                onChange={(e) => update({ birthday: new Date(e.target.value) })}
              />
            </Field>
            <Field className="w-40">
              <FieldLabel>가족이 된 날</FieldLabel>
              <Input
                id="care-item-family-date"
                type="date"
                value={value.familyDate.toISOString().split("T")[0]}
                onChange={(e) => update({ familyDate: new Date(e.target.value) })}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="care-item-name">추가 정보</FieldLabel>
              {value.additionalInfo.map((info, index) => (
                <Input
                  key={index}
                  type="text"
                  value={info}
                  onChange={(e) => {
                    const newAdditionalInfo = [...value.additionalInfo];
                    newAdditionalInfo[index] = e.target.value;
                    update({ additionalInfo: newAdditionalInfo });
                  }}
                  placeholder="예) 상세 종, 특징 등"
                />
              ))}
              <div className="w-20">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    update({ additionalInfo: [...value.additionalInfo, ""] });
                  }}
                >
                  추가
                </Button>
              </div>
            </Field>

          </FieldGroup>
        </CardContent>
			</Panel>
      <Button>저장</Button>
    </div>
  );
}
