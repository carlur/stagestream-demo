import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminByStageKey } from "@/lib/auth";

async function isAuthenticated(request: NextRequest) {
  const sessionCookie = request.cookies.get("admin-session");
  if (!sessionCookie) return false;

  const admin = await getAdminByStageKey(sessionCookie.value);
  return !!admin;
}

// GET - Listar posts
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type");
  const published = searchParams.get("published");

  const where: any = {};

  if (type) {
    where.type = type.toUpperCase();
  }

  if (published !== null) {
    where.published = published === "true";
  }

  try {
    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 },
    );
  }
}

// POST - Crear nuevo post
export async function POST(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, slug, content, excerpt, type, published } =
      await request.json();

    if (!title || !slug || !content || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        type: type.toUpperCase(),
        published: published || false,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 },
    );
  }
}
