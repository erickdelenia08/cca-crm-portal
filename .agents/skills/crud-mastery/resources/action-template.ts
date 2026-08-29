import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { ItemSchema, ItemValues } from "@/schemas/your-item";

export async function createItem(values: ItemValues) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const validatedFields = ItemSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields" };

  try {
    await prisma.yourModel.create({
      data: {
        ...validatedFields.data,
        authorId: session.user.id,
      },
    });

    revalidatePath("/dashboard/your-route");
    return { success: "Created successfully!" };
  } catch (error) {
    return { error: "Something went wrong" };
  }
}

export async function deleteItem(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  try {
    await prisma.yourModel.delete({
      where: { id, authorId: session.user.id }
    });
    revalidatePath("/dashboard/your-route");
    return { success: "Deleted successfully!" };
  } catch (error) {
    return { error: "Failed to delete" };
  }
}
