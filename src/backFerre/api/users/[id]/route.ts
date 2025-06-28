import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/middleware/auth';
import { userService } from '@/backFerre/services/user-service';
import { UserSchema } from '@/backFerre/types/zod-schemas';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireAuth(req, ['admin']);
  if (user instanceof NextResponse) return user;
  try {
    const body = await req.json();
    const parsed = UserSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const updatedUser = await userService.updateUser(params.id, parsed.data);
    return NextResponse.json(updatedUser);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireAuth(req, ['admin']);
  if (user instanceof NextResponse) return user;
  try {
    await userService.deleteUser(params.id);
    return new Response(null, { status: 204 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
