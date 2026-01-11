"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";

interface Category {
  id: string;
  name: string;
  color: string;
  isDefault: boolean;
}

interface SortableCategoryItemProps {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
  disabled?: boolean;
}

export function SortableCategoryItem({
  category,
  onEdit,
  onDelete,
  disabled,
}: SortableCategoryItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-lg border bg-white p-3 ${
        isDragging ? "opacity-50 shadow-lg" : ""
      }`}
    >
      <button
        className="cursor-grab touch-none text-slate-400 hover:text-slate-600"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>

      <div
        className="h-6 w-6 rounded-full border"
        style={{ backgroundColor: category.color }}
      />

      <span className="flex-1 font-medium">{category.name}</span>

      {category.isDefault && (
        <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
          기본
        </span>
      )}

      <div className="flex gap-1">
        <Button size="sm" variant="ghost" onClick={onEdit} disabled={disabled}>
          <Pencil className="h-4 w-4" />
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="ghost" disabled={category.isDefault || disabled}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>카테고리 삭제</AlertDialogTitle>
              <AlertDialogDescription>
                {category.name} 카테고리를 삭제하시겠습니까? 이 작업은 되돌릴 수
                없습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>삭제</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
