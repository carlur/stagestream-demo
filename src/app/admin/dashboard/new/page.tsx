"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

export default function NewPost() {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    type: "BLOG" as "BLOG" | "POST" | "PODCAST",
    published: false,
  });
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/admin/dashboard");
      } else {
        setError(data.error || "Failed to create post");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link
                href="/admin/dashboard"
                className="text-2xl font-bold text-gray-900"
              >
                Stage<span className="text-purple-600">Stream</span>
              </Link>
              <span className="ml-4 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                New Post
              </span>
            </div>
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* form Section */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Post Details
                </h2>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleTitleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter post title"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="slug"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Slug *
                    </label>
                    <input
                      type="text"
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="post-url-slug"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="type"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Type *
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    >
                      <option value="BLOG">Blog</option>
                      <option value="POST">Post</option>
                      <option value="PODCAST">Podcast</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="excerpt"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Excerpt
                    </label>
                    <textarea
                      id="excerpt"
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Brief description of the post"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="published"
                      name="published"
                      checked={formData.published}
                      onChange={handleChange}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="published"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Publish immediately
                    </label>
                  </div>
                </div>
              </div>

              {/* content Editor */}
              <div className="bg-white rounded-lg shadow">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex">
                    <button
                      type="button"
                      onClick={() => setActiveTab("edit")}
                      className={`py-3 px-6 text-sm font-medium border-b-2 ${
                        activeTab === "edit"
                          ? "border-purple-500 text-purple-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("preview")}
                      className={`py-3 px-6 text-sm font-medium border-b-2 ${
                        activeTab === "preview"
                          ? "border-purple-500 text-purple-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Preview
                    </button>
                  </nav>
                </div>

                <div className="p-6">
                  {activeTab === "edit" ? (
                    <div>
                      <label
                        htmlFor="content"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Content * (Markdown)
                      </label>
                      <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        rows={20}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono"
                        placeholder="Write your content in Markdown..."
                        required
                      />
                      <div className="mt-2 text-xs text-gray-500">
                        Use Markdown formatting. Supports headers, links, lists,
                        code blocks, and more.
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-4">
                        Preview
                      </h3>
                      <div className="prose max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {formData.content ||
                            "*Start typing in the Edit tab to see your content here...*"}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              {/* submit Button */}
              <div className="flex justify-between">
                <Link
                  href="/admin/dashboard"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating...
                    </div>
                  ) : formData.published ? (
                    "Publish Post"
                  ) : (
                    "Save Draft"
                  )}
                </button>
              </div>
            </div>

            {/* live Preview Section */}
            <div className="lg:block hidden">
              <div className="bg-white rounded-lg shadow p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Live Preview
                </h3>
                <div className="border rounded-lg p-4">
                  {formData.title && (
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {formData.title}
                    </h1>
                  )}
                  {formData.excerpt && (
                    <p className="text-gray-600 mb-4">{formData.excerpt}</p>
                  )}
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {formData.content || "*No content yet...*"}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}