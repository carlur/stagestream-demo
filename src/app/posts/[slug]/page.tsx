import { prisma } from "@/lib/prisma";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  type: "BLOG" | "POST" | "PODCAST";
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

async function getPost(slug: string): Promise<Post | null> {
  return await prisma.post.findFirst({
    where: {
      slug,
      published: true,
    },
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "BLOG":
        return "bg-blue-100 text-blue-800";
      case "POST":
        return "bg-green-100 text-green-800";
      case "PODCAST":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Stage<span className="text-purple-600">Stream</span>
            </Link>
            <Link
              href="/admin"
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Article Header */}
          <div className="px-8 py-8 border-b border-gray-200">
            <div className="flex items-center mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getTypeColor(post.type)}`}
              >
                {post.type.toLowerCase()}
              </span>
              <span className="ml-4 text-gray-500">
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-xl text-gray-600 leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </div>

          {/* Article Content */}
          <div className="px-8 py-8">
            <div className="prose prose-lg prose-gray max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>
            </div>
          </div>
        </article>

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}