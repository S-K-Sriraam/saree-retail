"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function createCategory(formData: FormData) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Check admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/account");
  }

  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const imageUrl = String(formData.get("image_url") || "").trim();
  const isActive = formData.get("is_active") === "on";

  if (!name) {
    redirect(
      `/admin/categories?error=${encodeURIComponent(
        "Category name is required."
      )}`
    );
  }

  const slug = createSlug(name);

  if (!slug) {
    redirect(
      `/admin/categories?error=${encodeURIComponent(
        "A valid category name is required."
      )}`
    );
  }

  const { error } = await supabase.from("categories").insert({
    name,
    slug,
    description: description || null,
    image_url: imageUrl || null,
    is_active: isActive,
  });

  if (error) {
    if (error.code === "23505") {
      redirect(
        `/admin/categories?error=${encodeURIComponent(
          "A category with this name or slug already exists."
        )}`
      );
    }

    console.error("Category creation error:", error);

    redirect(
      `/admin/categories?error=${encodeURIComponent(
        "Unable to create category. Please try again."
      )}`
    );
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");

  redirect(
    `/admin/categories?success=${encodeURIComponent(
      "Category created successfully."
    )}`
  );
}