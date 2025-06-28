import { NextRequest, NextResponse } from 'next/server';
import { orderService } from '@/backFerre/services/order-service';
import { requireAuth } from '@/middleware/auth';
import { OrderSchema } from '@/backFerre/types/zod-schemas';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireAuth(req, ['admin', 'reseller']);
  if (user instanceof NextResponse) return user;
  try {
    const order = await orderService.getOrderById(params.id);
    return NextResponse.json(order);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireAuth(req, ['admin']);
  if (user instanceof NextResponse) return user;
  try {
    const body = await req.json();
    const parsed = OrderSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const updatedOrder = await orderService.updateOrder(params.id, parsed.data);
    return NextResponse.json(updatedOrder);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireAuth(req, ['admin']);
  if (user instanceof NextResponse) return user;
  try {
    await orderService.deleteOrder(params.id);
    return new Response(null, { status: 204 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
