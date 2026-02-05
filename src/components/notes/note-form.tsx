"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createNote, updateNote } from "@/lib/actions/notes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SPACING } from "@/lib/constants/styles";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Category, Tag, Note } from "@/types";
import { CreateCategoryDialog } from "./create-category-dialog";
import { CreateTagDialog } from "./create-tag-dialog";
import { ManageCategoriesDialog } from "./manage-categories-dialog";
import { ManageTagsDialog } from "./manage-tags-dialog";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const Editor = dynamic(() => import("./editor"), { ssr: false });

interface NoteFormProps {
  categories: Category[];
  tags: Tag[];
  note?: Note;
}

import { useTranslations } from "next-intl";

export function NoteForm({ categories, tags, note }: NoteFormProps) {
  const t = useTranslations("notes.form");
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || null);
  const [categoryId, setCategoryId] = useState<string>(note?.category_id || "");
  const [selectedTags, setSelectedTags] = useState<string[]>(
    note?.tags?.map((t) => String(t.id)) || []
  );
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    console.log("📝 Submitting note with content:", {
      title: title.trim(),
      content,
      contentLength: content?.length || 0,
      categoryId: categoryId || null,
      tagIds: selectedTags,
    });

    startTransition(async () => {
      try {
        if (note) {
          const updateData = {
            title: title.trim(),
            content: content || undefined,
            categoryId: categoryId || null,
            tagIds: selectedTags,
          };
          console.log("🔄 Updating note:", updateData);
          await updateNote(String(note.id), updateData);
          router.refresh();
        } else {
          const createData = {
            title: title.trim(),
            content: content || undefined,
            categoryId: categoryId || undefined,
            tagIds: selectedTags.length > 0 ? selectedTags : undefined,
          };
          console.log("✨ Creating note:", createData);
          await createNote(createData);
          // createNote already redirects to the new note page
        }
      } catch (error) {
        console.error("❌ Failed to save note:", error);
        alert("Failed to save note. Please try again.");
      }
    });
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="form-container form-section"
    >
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            {note ? t("editTitle") : t("createTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className={SPACING.md}>
          <div className="form-grid-2">
            {/* Title */}
            <div className="form-field">
              <Label htmlFor="title">{t("fields.title")}</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("placeholders.title")}
                className="bg-gray-950/50 border-gray-700 focus:border-blue-500/50 transition-colors"
                required
              />
            </div>

            {/* Category */}
            <div className="form-field">
              <div className="flex items-center justify-between">
                <Label htmlFor="category">{t("fields.category")}</Label>
              </div>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="bg-gray-950/50 border-gray-700 focus:border-blue-500/50">
                  <SelectValue placeholder={t("placeholders.category")} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      <div className="flex-center gap-2">
                        <div
                          className="category-dot"
                          style={{ backgroundColor: category.color || '#888' }}
                        />
                        {category.name || category.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-1">
                <ManageCategoriesDialog categories={categories} />
                <CreateCategoryDialog />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="form-field">
            <div className="flex-between">
              <Label>{t("fields.tags")}</Label>
            </div>
            <div className="tag-container">
              {tags.length === 0 && (
                <p className="text-sm text-gray-500 italic">
                  {t("emptyTags")}
                </p>
              )}
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(String(tag.id))}
                  className={cn(
                    "px-3 py-1 rounded-full text-sm transition-all duration-200 border",
                    selectedTags.includes(String(tag.id))
                      ? "bg-blue-500/20 text-blue-300 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]"
                      : "bg-gray-800/40 text-gray-400 border-gray-700/50 hover:bg-gray-800 hover:border-gray-600"
                  )}
                >
                  #{tag.name || tag.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <ManageTagsDialog tags={tags} />
              <CreateTagDialog />
            </div>
          </div>

          {/* Content */}
          <div className="form-field">
            <Label htmlFor="content">{t("fields.content")}</Label>
            <div className="editor-responsive">
              <Editor initialContent={content || ""} onChange={setContent} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="card-footer-actions">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            disabled={isPending}
          >
            {t("actions.cancel")}
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border-0 shadow-lg shadow-blue-500/20"
          >
            {isPending ? (
              <span className="flex-center gap-2">
                <div className="loading-spinner" />
                {note ? t("actions.updating") : t("actions.creating")}
              </span>
            ) : note ? (
              t("actions.update")
            ) : (
              t("actions.create")
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
