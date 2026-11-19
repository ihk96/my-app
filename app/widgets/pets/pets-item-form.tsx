import { useEffect, useRef, useState } from "react";
import { Field, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { Panel } from "~/components/app/screen";
import { CardContent } from "~/components/ui/card";
import { Attachment, AttachmentAction, AttachmentActions, AttachmentMedia, AttachmentTrigger } from "~/components/ui/attachment";
import { Crop, X, XIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import PetsImageCropDialog from "./pets-image-crop-dialog";

const SPECIES = [
  {label: "종을 선택해주세요.", value: ""}, { label: "도마뱀", value: "Lizard" }, 
  { label: "거북이", value: "Turtle" }, { label: "뱀", value: "Snake" }, { label: "고양이", value: "Cat" }, 
  { label: "강아지", value: "Dog" }, { label: "햄스터", value: "Hamster" }, { label: "기타", value: "Other" }];
const GENDERS = [
  {label: "성별을 선택해주세요.", value: ""}, { label: "수컷", value: "Male" }, { label: "암컷", value: "Female" }
  ,{ label: "알 수 없음", value: "Unknown" }
];

export type PetsItemFormValue = {
  name: string;
  species: string;
  gender: string;
  familyDate: Date;
  birthday: Date;
  additionalInfo: string[];
  originalImage?: File;
  thumbnailImage?: File;
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
  const selectedFile = value.originalImage;
  const thumbnailFile = value.thumbnailImage;
  const [cropOpen, setCropOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>();

  // iOS Safari는 input 값을 비우면 선택한 파일의 임시 사본을 지울 수 있어서,
  // 선택 직후가 아니라 다음 선택을 시작할 때 비운다.
  const openFilePicker = () => {
    const input = fileInputRef.current;
    if (!input) return;
    input.value = "";
    input.click();
  };

  useEffect(() => {
    if (!thumbnailFile) {
      setPreviewUrl(undefined);
      return;
    }

    // 배포 환경의 iOS Safari에서 blob URL 이미지가 표시되지 않아 data URL을 쓴다.
    // 썸네일은 512px JPEG라 data URL로 들고 있어도 부담이 적다.
    let cancelled = false;
    const reader = new FileReader();
    reader.onload = () => {
      if (!cancelled && typeof reader.result === "string") setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(thumbnailFile);
    return () => {
      cancelled = true;
      reader.abort();
    };
  }, [thumbnailFile]);

  return (
    <FieldGroup>
      <Field>
        <div className="flex justify-center">
          <Attachment orientation="vertical" className="size-40">
            <AttachmentMedia variant="image">
              {previewUrl && <img src={previewUrl} alt="반려동물 미리보기" />}
            </AttachmentMedia>
            {selectedFile && <AttachmentActions>
              <AttachmentAction
                aria-label="반려동물 사진 삭제"
                onClick={() => update({ originalImage: undefined, thumbnailImage: undefined })}
              >
                <XIcon />
              </AttachmentAction>
            </AttachmentActions>}
            {
              thumbnailFile && (
                <Dialog>
                  <DialogTrigger>
                    <AttachmentTrigger/>
                  </DialogTrigger>
                  <DialogContent className="w-screen h-screen max-w-none! rounded-none">
                    {previewUrl && <img src={previewUrl} alt="반려동물 썸네일" className="max-h-full max-w-full object-contain" />}
                  </DialogContent>
                </Dialog>
              )
            }
            {
              !thumbnailFile && (
                <AttachmentTrigger
                  render={
                      <button
                        type="button"
                        aria-label="반려동물 사진 선택"
                        onClick={openFilePicker}
                      />
                  }
                />
              )
            }
          </Attachment>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              update({ originalImage: file, thumbnailImage: undefined });
              setCropOpen(true);
            }}
          />
        </div>
        {selectedFile && (
          <div className="flex justify-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setCropOpen(true)}>
              <Crop />
              썸네일 조정
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={openFilePicker}>
              사진 변경
            </Button>
          </div>
        )}
        <PetsImageCropDialog
          file={selectedFile}
          open={cropOpen}
          onOpenChange={setCropOpen}
          onApply={(thumbnailImage) => update({ thumbnailImage })}
        />
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
          <Field orientation={"horizontal"}>
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
            <Button size={"icon"} 
                    variant={"destructive"}
                    onClick={() => {
                      const newAdditionalInfo = [...value.additionalInfo];
                      newAdditionalInfo.splice(index, 1);
                      update({ additionalInfo: newAdditionalInfo });
                    }}
            >
              <X/>
            </Button>
          </Field>
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
  );
}
