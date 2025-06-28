import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/middleware/auth';
import { userService } from '@/backFerre/services/user-service';
import { UserSchema } from '@/backFerre/types/zod-schemas';

export async function GET(req: NextRequest) {
  const user = await requireAuth(req, ['admin']);
  if (user instanceof NextResponse) return user;
  try {
    const users = await userService.getAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await requireAuth(req, ['admin']);
  if (user instanceof NextResponse) return user;
  try {
    const body = await req.json();
    const parsed = UserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const newUser = await userService.createUser(parsed.data);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
