import { useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

type Point = { x: number; y: number };

type PetsImageCropDialogProps = {
  file?: File;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (thumbnail: File) => void;
};

const THUMBNAIL_SIZE = 512;
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

export default function PetsImageCropDialog({
  file,
  open,
  onOpenChange,
  onApply,
}: PetsImageCropDialogProps) {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const cropAreaRef = useRef<HTMLDivElement | null>(null);
  const dragStartRef = useRef<{ pointerId: number; point: Point; offset: Point } | null>(null);
  const pointersRef = useRef(new Map<number, Point>());
  const pinchStartRef = useRef<{ distance: number; zoom: number; center: Point; offset: Point } | null>(null);
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>();
  const [cropSize, setCropSize] = useState(288);
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [error, setError] = useState<string>();
  const [processing, setProcessing] = useState(false);

  const [imageUrl, setImageUrl] = useState<string>();

  useEffect(() => {
    if (!file) {
      setImageUrl(undefined);
      return;
    }
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // blob URL을 이미지로 불러오지 못하는 환경(iOS Safari 등)에서는 data URL로 한 번 더 시도한다.
  function loadAsDataUrl(target: File) {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setImageUrl(reader.result);
    };
    reader.onerror = () => setError("이미지를 불러오지 못했습니다. 다른 파일을 선택해 주세요.");
    reader.readAsDataURL(target);
  }

  useEffect(() => {
    setImageSize(undefined);
    setZoom(MIN_ZOOM);
    setOffset({ x: 0, y: 0 });
    setError(undefined);
  }, [file]);

  const baseScale = imageSize
    ? Math.max(cropSize / imageSize.width, cropSize / imageSize.height)
    : 1;
  const renderedWidth = (imageSize?.width ?? cropSize) * baseScale * zoom;
  const renderedHeight = (imageSize?.height ?? cropSize) * baseScale * zoom;
  const imageLeft = (cropSize - renderedWidth) / 2 + offset.x;
  const imageTop = (cropSize - renderedHeight) / 2 + offset.y;

  function clampOffset(point: Point, nextZoom = zoom): Point {
    const width = (imageSize?.width ?? cropSize) * baseScale * nextZoom;
    const height = (imageSize?.height ?? cropSize) * baseScale * nextZoom;
    return {
      x: Math.min(Math.max(point.x, -(width - cropSize) / 2), (width - cropSize) / 2),
      y: Math.min(Math.max(point.y, -(height - cropSize) / 2), (height - cropSize) / 2),
    };
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!imageSize) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointersRef.current.size === 2) {
      const [first, second] = Array.from(pointersRef.current.values());
      pinchStartRef.current = {
        distance: Math.hypot(second.x - first.x, second.y - first.y),
        zoom,
        center: { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 },
        offset,
      };
      dragStartRef.current = null;
      return;
    }
    dragStartRef.current = {
      pointerId: event.pointerId,
      point: { x: event.clientX, y: event.clientY },
      offset,
    };
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!pointersRef.current.has(event.pointerId)) return;
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const pinchStart = pinchStartRef.current;
    if (pinchStart && pointersRef.current.size >= 2) {
      const [first, second] = Array.from(pointersRef.current.values());
      const distance = Math.hypot(second.x - first.x, second.y - first.y);
      const nextZoom = Math.min(MAX_ZOOM, Math.max(
        MIN_ZOOM,
        pinchStart.zoom * distance / Math.max(pinchStart.distance, 1),
      ));
      const center = { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 };
      setZoom(nextZoom);
      setOffset(clampOffset({
        x: pinchStart.offset.x + center.x - pinchStart.center.x,
        y: pinchStart.offset.y + center.y - pinchStart.center.y,
      }, nextZoom));
      return;
    }

    const dragStart = dragStartRef.current;
    if (!dragStart || dragStart.pointerId !== event.pointerId) return;
    setOffset(clampOffset({
      x: dragStart.offset.x + event.clientX - dragStart.point.x,
      y: dragStart.offset.y + event.clientY - dragStart.point.y,
    }));
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    pointersRef.current.delete(event.pointerId);
    if (dragStartRef.current?.pointerId === event.pointerId) {
      dragStartRef.current = null;
    }
    if (pinchStartRef.current) {
      pinchStartRef.current = null;
      const remaining = Array.from(pointersRef.current.entries())[0];
      if (remaining) {
        dragStartRef.current = {
          pointerId: remaining[0],
          point: remaining[1],
          offset,
        };
      }
    }
  }

  async function applyCrop() {
    const image = imageRef.current;
    if (!file || !image || !imageSize || !cropSize) return;

    setProcessing(true);
    setError(undefined);
    try {
      const scale = renderedWidth / imageSize.width;
      const sourceX = Math.max(0, (0 - imageLeft) / scale);
      const sourceY = Math.max(0, (0 - imageTop) / scale);
      const sourceSize = cropSize / scale;
      const canvas = document.createElement("canvas");
      canvas.width = THUMBNAIL_SIZE;
      canvas.height = THUMBNAIL_SIZE;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("이미지 편집을 시작할 수 없습니다.");

      context.drawImage(
        image,
        sourceX,
        sourceY,
        sourceSize,
        sourceSize,
        0,
        0,
        THUMBNAIL_SIZE,
        THUMBNAIL_SIZE,
      );
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (result) => result
            ? resolve(result)
            : reject(new Error("썸네일 이미지를 만들지 못했습니다.")),
          "image/jpeg",
          0.9,
        );
      });
      const thumbnail = new File(
        [blob],
        `${file.name.replace(/\.[^.]+$/, "")}-thumbnail.jpg`,
        { type: "image/jpeg", lastModified: Date.now() },
      );
      onApply(thumbnail);
      onOpenChange(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "이미지 편집 중 오류가 발생했습니다.");
    } finally {
      setProcessing(false);
    }
  }

  function resetCrop() {
    setZoom(MIN_ZOOM);
    setOffset({ x: 0, y: 0 });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>썸네일 편집</DialogTitle>
          <DialogDescription>
            한 손가락으로 사진을 옮기고,<br/>두 손가락으로 확대·축소할 수 있어요.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <div
            ref={cropAreaRef}
            className="relative aspect-square w-72 max-w-[80vw] touch-none overflow-hidden rounded-lg border-gray-400 border"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onLostPointerCapture={handlePointerUp}
          >
            {imageUrl && (
              <img
                ref={imageRef}
                src={imageUrl}
                alt="썸네일 자르기 미리보기"
                draggable={false}
                onLoad={(event) => {
                  if (!event.currentTarget.naturalWidth || !event.currentTarget.naturalHeight) {
                    setError("이미지 파일을 읽을 수 없습니다.");
                    return;
                  }
                  setError(undefined);
                  setImageSize({
                    width: event.currentTarget.naturalWidth,
                    height: event.currentTarget.naturalHeight,
                  });
                  const size = cropAreaRef.current?.clientWidth;
                  if (size) setCropSize(size);
                }}
                onError={() => {
                  if (file && imageUrl?.startsWith("blob:")) {
                    loadAsDataUrl(file);
                    return;
                  }
                  setError("이미지를 불러오지 못했습니다. 다른 파일을 선택해 주세요.");
                }}
                className="pointer-events-none absolute max-w-none select-none"
                style={{
                  left: imageLeft,
                  top: imageTop,
                  width: renderedWidth,
                  height: renderedHeight,
                }}
              />
            )}
          </div>
          <div className="flex w-full justify-start">
            <Button type="button" variant="outline" size="sm" onClick={resetCrop}>
              초기화
            </Button>
          </div>
          {error && <p role="alert" className="w-full text-sm text-destructive">{error}</p>}
          <div className={"flex w-full justify-end gap-2"}>
            <DialogClose render={<Button type="button" variant="outline" />}>
              취소
            </DialogClose>
            <Button type="button" disabled={!imageSize || processing} onClick={applyCrop}>
              {processing ? "처리 중..." : "적용"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
