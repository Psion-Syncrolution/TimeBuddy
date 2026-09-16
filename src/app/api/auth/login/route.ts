import { NextResponse } from 'next/server';
import { LoginSchema } from '@/validators/auth-schema';
import { userRepository } from '@/lib/repositories/user-repository';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { email, password } = parsed.data;
    const user = await userRepository.verifyPassword(email, password);

    if (!user) {
      return NextResponse.json({ error: 'E-Mail oder Passwort falsch' }, { status: 401 });
    }

    const session = await getSession();
    session.userId = user.id;
    session.email = user.email;
    await session.save();

    return NextResponse.json({
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Login fehlgeschlagen' }, { status: 500 });
  }
}
