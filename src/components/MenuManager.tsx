import { useState } from "react";
import { produce } from "immer";
import { PlusCircle, GripVertical, Trash2, Edit } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { MenuCategory, MenuItem } from "@shared/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { MenuItemForm } from "./MenuItemForm";
interface MenuManagerProps {
  menu: MenuCategory[];
  onMenuChange: (menu: MenuCategory[]) => void;
}
function SortableMenuItem({ categoryId, item, onEdit, onDelete }: { categoryId: string; item: MenuItem; onEdit: (item: MenuItem) => void; onDelete: (itemId: string) => void; }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: `${categoryId}-${item.id}` });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 bg-background p-2 rounded-md border">
      <div {...attributes} {...listeners} className="cursor-grab touch-none p-1">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      <img src={item.imageUrl} alt={item.name} className="h-12 w-12 rounded-sm object-cover" />
      <div className="flex-grow">
        <p className="font-medium">{item.name}</p>
        <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
      </div>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" onClick={() => onEdit(item)}><Edit className="h-4 w-4" /></Button>
      </SheetTrigger>
      <Button variant="ghost" size="icon" onClick={() => onDelete(item.id!)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
    </div>
  );
}
export function MenuManager({ menu, onMenuChange }: MenuManagerProps) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingItem, setEditingItem] = useState<{ categoryId: string; item?: MenuItem } | null>(null);
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const handleAddCategory = () => {
    if (newCategoryName.trim() === "") return;
    const newCategory: MenuCategory = {
      id: `temp-cat-${Date.now()}`,
      name: newCategoryName.trim(),
      items: [],
    };
    onMenuChange([...menu, newCategory]);
    setNewCategoryName("");
  };
  const handleDeleteCategory = (categoryId: string) => {
    onMenuChange(menu.filter(c => c.id !== categoryId));
  };
  const handleItemSubmit = (categoryId: string, item: MenuItem) => {
    const updatedMenu = produce(menu, draft => {
      const category = draft.find(c => c.id === categoryId);
      if (category) {
        const itemIndex = category.items.findIndex(i => i.id === item.id);
        if (itemIndex > -1) {
          category.items[itemIndex] = item;
        } else {
          category.items.push(item);
        }
      }
    });
    onMenuChange(updatedMenu);
    setEditingItem(null);
  };
  const handleDeleteItem = (categoryId: string, itemId: string) => {
    const updatedMenu = produce(menu, draft => {
      const category = draft.find(c => c.id === categoryId);
      if (category) {
        category.items = category.items.filter(i => i.id !== itemId);
      }
    });
    onMenuChange(updatedMenu);
  };
  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active.id !== over.id) {
      const [activeCategoryId, activeItemId] = active.id.split('-');
      const [overCategoryId, overItemId] = over.id.split('-');
      const updatedMenu = produce(menu, draft => {
        const activeCategory = draft.find(c => c.id === activeCategoryId);
        const overCategory = draft.find(c => c.id === overCategoryId);
        if (!activeCategory || !overCategory) return;
        const activeIndex = activeCategory.items.findIndex(i => i.id === activeItemId);
        const overIndex = overCategory.items.findIndex(i => i.id === overItemId);
        if (activeIndex === -1 || overIndex === -1) return;
        if (activeCategoryId === overCategoryId) {
          overCategory.items = arrayMove(overCategory.items, activeIndex, overIndex);
        } else {
          const [movedItem] = activeCategory.items.splice(activeIndex, 1);
          overCategory.items.splice(overIndex, 0, movedItem);
        }
      });
      onMenuChange(updatedMenu);
    }
  }
  const allItemIds = menu.flatMap(c => c.items.map(i => `${c.id}-${i.id}`));
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Menu Management</h3>
        <Sheet open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
          <Accordion type="multiple" className="w-full" defaultValue={menu.map(c => c.id!)}>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={allItemIds} strategy={verticalListSortingStrategy}>
                {menu.map(category => (
                  <AccordionItem value={category.id!} key={category.id}>
                    <div className="flex items-center">
                      <AccordionTrigger className="flex-grow">{category.name}</AccordionTrigger>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(category.id!)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <AccordionContent>
                      <div className="space-y-2 p-2">
                        {category.items.length > 0 ? (
                          category.items.map(item => (
                            <SortableMenuItem
                              key={item.id}
                              categoryId={category.id!}
                              item={item}
                              onEdit={(itemToEdit) => setEditingItem({ categoryId: category.id!, item: itemToEdit })}
                              onDelete={(itemId) => handleDeleteItem(category.id!, itemId)}
                            />
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground text-center py-4">No items in this category yet.</p>
                        )}
                        <SheetTrigger asChild>
                          <Button variant="outline" className="w-full mt-2" onClick={() => setEditingItem({ categoryId: category.id! })}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Menu Item
                          </Button>
                        </SheetTrigger>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </SortableContext>
            </DndContext>
          </Accordion>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{editingItem?.item ? 'Edit' : 'Add'} Menu Item</SheetTitle>
              <SheetDescription>
                {editingItem?.item ? 'Update the details for this menu item.' : 'Add a new item to this menu category.'}
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
              {editingItem && (
                <MenuItemForm
                  id="menu-item-form"
                  menuItem={editingItem.item}
                  onSubmit={(item) => handleItemSubmit(editingItem.categoryId, item)}
                />
              )}
            </div>
            <SheetFooter>
              <Button variant="outline" onClick={() => setEditingItem(null)}>Cancel</Button>
              <Button type="submit" form="menu-item-form">Save Item</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        <div className="mt-6 flex gap-2">
          <Input
            placeholder="New category name..."
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
          />
          <Button onClick={handleAddCategory}>Add Category</Button>
        </div>
      </CardContent>
    </Card>
  );
}