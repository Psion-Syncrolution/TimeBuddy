import { NextResponse } from 'next/server';
import { RegisterSchema } from '@/validators/auth-schema';
import { userRepository } from '@/lib/repositories/user-repository';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { email, password } = parsed.data;

    const existing = await userRepository.getByEmail(email);
    if (existing) {
      return NextResponse.json({ error: 'E-Mail bereits registriert' }, { status: 409 });
    }

    const user = await userRepository.create({ email, password });

    const session = await getSession();
    session.userId = user.id;
    session.email = user.email;
    await session.save();

    return NextResponse.json({
      user: { id: user.id, email: user.email, createdAt: user.createdAt },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Registrierung fehlgeschlagen' }, { status: 500 });
  }
}
