"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableCategoryItem } from "./SortableCategoryItem";
import { CategoryFormDialog } from "./CategoryFormDialog";
import { Button } from "@/shared/ui/button";
import { Plus } from "lucide-react";
import { reorderCategories } from "@/features/category/server-functions/reorderCategories";
import { createCategory } from "@/features/category/server-functions/createCategory";
import { updateCategory } from "@/features/category/server-functions/updateCategory";
import { deleteCategory } from "@/features/category/server-functions/deleteCategory";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  color: string;
  isDefault: boolean;
  sortOrder: number;
}

interface CategoryManagerProps {
  initialCategories: Category[];
}

export function CategoryManager({ initialCategories }: CategoryManagerProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = categories.findIndex((c) => c.id === active.id);
      const newIndex = categories.findIndex((c) => c.id === over.id);

      const newOrder = arrayMove(categories, oldIndex, newIndex);
      setCategories(newOrder);

      try {
        await reorderCategories(newOrder.map((c) => c.id));
        toast.success("순서가 변경되었습니다");
      } catch {
        setCategories(categories);
        toast.error("순서 변경에 실패했습니다");
      }
    }
  };

  const handleAdd = async (data: { name: string; color: string }) => {
    try {
      const newCategory = await createCategory(data);
      if (newCategory) {
        setCategories([
          ...categories,
          {
            id: newCategory.id,
            name: newCategory.name,
            color: newCategory.color,
            isDefault: newCategory.isDefault,
            sortOrder: newCategory.sortOrder,
          },
        ]);
      }
      setIsFormOpen(false);
      toast.success("카테고리가 추가되었습니다");
    } catch {
      toast.error("카테고리 추가에 실패했습니다");
    }
  };

  const handleEdit = async (data: { name: string; color: string }) => {
    if (!editingCategory) return;

    try {
      const updated = await updateCategory({
        id: editingCategory.id,
        ...data,
      });
      if (updated) {
        setCategories(
          categories.map((c) =>
            c.id === updated.id
              ? {
                  ...c,
                  name: updated.name,
                  color: updated.color,
                }
              : c
          )
        );
      }
      setEditingCategory(null);
      toast.success("카테고리가 수정되었습니다");
    } catch {
      toast.error("카테고리 수정에 실패했습니다");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      setCategories(categories.filter((c) => c.id !== id));
      toast.success("카테고리가 삭제되었습니다");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "카테고리 삭제에 실패했습니다"
      );
    }
  };

  return (
    <div className="space-y-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={categories.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {categories.map((category) => (
              <SortableCategoryItem
                key={category.id}
                category={category}
                onEdit={() => setEditingCategory(category)}
                onDelete={() => handleDelete(category.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button
        onClick={() => setIsFormOpen(true)}
        variant="outline"
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        새 카테고리 추가
      </Button>

      <CategoryFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleAdd}
      />

      {editingCategory && (
        <CategoryFormDialog
          open={true}
          onOpenChange={(open) => !open && setEditingCategory(null)}
          onSubmit={handleEdit}
          defaultValues={{
            name: editingCategory.name,
            color: editingCategory.color,
          }}
          isEdit
        />
      )}
    </div>
  );
}
