import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminByStageKey } from "@/lib/auth";

async function isAuthenticated(request: NextRequest) {
  const sessionCookie = request.cookies.get("admin-session");
  if (!sessionCookie) return false;

  const admin = await getAdminByStageKey(sessionCookie.value);
  return !!admin;
}

// GET - Obtener post por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 },
    );
  }
}

// PUT - Actualizar post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, slug, content, excerpt, type, published } =
      await request.json();

    const post = await prisma.post.update({
      where: { id: parseInt(params.id) },
      data: {
        title,
        slug,
        content,
        excerpt,
        type: type?.toUpperCase(),
        published,
      },
    });

    return NextResponse.json(post);
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 },
    );
  }
}

// DELETE - Eliminar post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.post.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 },
    );
  }
}
