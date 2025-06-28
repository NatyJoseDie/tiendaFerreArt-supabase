import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

// Zod schema for product updates (all fields optional)
const productUpdateSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(2),
  cost_price: z.coerce.number().min(0),
  stock: z.coerce.number().int().min(0),
  category: z.string().min(2),
  sku: z.string().min(2),
  images: z.array(z.string().url()).max(5).optional(),
}).partial();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getUserAndRole(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;

  try {
    // Use the admin client to verify the JWT token
    const { data: { user }, error } = await supabase.auth.admin.verifyJwt(token);
    
    if (error || !user) {
      console.error('Error verifying JWT:', error?.message);
      return null;
    }

    // Get the user's role from the database
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    return { 
      user, 
      role: profile?.role || 'cliente' 
    };
  } catch (error) {
    console.error('Error in getUserAndRole:', error);
    return null;
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await getUserAndRole(req);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const formData = await req.formData();
  
  const newImageFiles = formData.getAll("images").filter((f): f is File => f instanceof File);
  const existingImageUrls = formData.get("existing_images_urls")?.toString().split(',').filter(url => url) || [];
  
  const rawData: { [key: string]: any } = Object.fromEntries(formData.entries());
  delete rawData.images;
  delete rawData.existing_images_urls;

  const uploadedImageUrls: string[] = [];

  // Upload new images
  const availableSlots = 5 - existingImageUrls.length;
  for (const file of newImageFiles.slice(0, availableSlots)) {
    const arrayBuffer = await file.arrayBuffer();
    const fileExt = file.name.split(".").pop();
    const fileName = `${rawData.sku || 'product'}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(fileName, arrayBuffer, { contentType: file.type, upsert: true });

    if (uploadError) {
      console.error("Upload error:", uploadError.message);
      continue;
    }

    const { data: publicUrlData } = supabase.storage.from("products").getPublicUrl(fileName);
    if (publicUrlData?.publicUrl) {
      uploadedImageUrls.push(publicUrlData.publicUrl);
    }
  }

  const finalImageUrls = [...existingImageUrls, ...uploadedImageUrls];
  const productData = {
    ...rawData,
    images: finalImageUrls,
  };

  const parsed = productUpdateSchema.safeParse(productData);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { data: updateData, error: updateError } = await supabase
    .from("products")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json(updateData[0], { status: 200 });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await getUserAndRole(req);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = params;

  // Get image URLs to delete from storage
  const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('images')
      .eq('id', id)
      .single();
  
  if (fetchError) {
      console.error("Could not fetch product to delete images:", fetchError.message);
  }

  if (product?.images && product.images.length > 0) {
      const fileNames = product.images.map((url: string) => url.split('/').pop()).filter(Boolean);
      if (fileNames.length > 0) {
        const { error: storageError } = await supabase.storage.from('products').remove(fileNames as string[]);
        if (storageError) {
            console.error("Error deleting images from storage:", storageError.message);
        }
      }
  }

  const { data, error } = await supabase.from("products").delete().eq("id", id).select();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, deleted: data }, { status: 200 });
}
