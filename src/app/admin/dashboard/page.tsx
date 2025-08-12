"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  type: "BLOG" | "POST" | "PODCAST";
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    try {
      let url = "/api/posts";
      if (filter === "published") {
        url += "?published=true";
      } else if (filter === "draft") {
        url += "?published=false";
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else if (response.status === 401) {
        router.push("/admin");
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const deletePost = async (id: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchPosts(); // Refresh the list
      } else {
        alert("Failed to delete post");
      }
    } catch (error) {
      alert("Failed to delete post");
    }
  };

  const togglePublished = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ published: !currentStatus }),
      });

      if (response.ok) {
        fetchPosts(); // Refresh the list
      } else {
        alert("Failed to update post");
      }
    } catch (error) {
      alert("Failed to update post");
    }
  };

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                Stage<span className="text-purple-600">Stream</span>
              </Link>
              <span className="ml-4 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                Admin
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/dashboard/new"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                New Post
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Content Management
          </h1>

          {/* Filters */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "all"
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              All Posts ({posts.length})
            </button>
            <button
              onClick={() => setFilter("published")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "published"
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Published ({posts.filter((p) => p.published).length})
            </button>
            <button
              onClick={() => setFilter("draft")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "draft"
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Drafts ({posts.filter((p) => !p.published).length})
            </button>
          </div>
        </div>

        {/* Posts List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">No posts found</p>
            <Link
              href="/admin/dashboard/new"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {post.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          /{post.slug}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(post.type)}`}
                        >
                          {post.type.toLowerCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            post.published
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {post.published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/dashboard/edit/${post.id}`}
                            className="text-purple-600 hover:text-purple-900"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() =>
                              togglePublished(post.id, post.published)
                            }
                            className="text-blue-600 hover:text-blue-900"
                          >
                            {post.published ? "Unpublish" : "Publish"}
                          </button>
                          <button
                            onClick={() => deletePost(post.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}