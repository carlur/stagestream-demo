import { prisma } from "@/lib/prisma";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

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

async function getPosts(): Promise<Post[]> {
  return await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });
}

const PricingPlans = () => {
  const plans = [
    {
      name: "Stay Tuned",
      price: "Free",
      description: "Get started with basic access",
      features: [
        "Access to public content",
        "Weekly newsletter",
        "Community access",
      ],
      gradient: "from-blue-400 to-blue-600",
    },
    {
      name: "Inside the Stream",
      price: "$9.99/month",
      description: "Dive deeper into exclusive content",
      features: [
        "All Stay Tuned features",
        "Exclusive articles",
        "Early access to podcasts",
        "Member-only discussions",
      ],
      gradient: "from-purple-400 to-purple-600",
      popular: true,
    },
    {
      name: "Little Producer",
      price: "$19.99/month",
      description: "For serious content creators",
      features: [
        "All Inside the Stream features",
        "Direct access to creators",
        "Behind-the-scenes content",
        "Monthly Q&A sessions",
        "Producer credits",
      ],
      gradient: "from-rose-400 to-rose-600",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of subscribers and unlock exclusive content
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 ${
                plan.popular ? "ring-4 ring-purple-500 ring-opacity-50" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white px-4 py-1 rounded-b-lg text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className={`h-2 bg-gradient-to-r ${plan.gradient}`}></div>

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price.split("/")[0]}
                  </span>
                  {plan.price.includes("/") && (
                    <span className="text-gray-600">
                      /{plan.price.split("/")[1]}
                    </span>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-white bg-gradient-to-r ${plan.gradient} hover:opacity-90 transition-opacity`}
                >
                  {plan.price === "Free" ? "Get Started" : "Subscribe Now"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PostCard = ({ post }: { post: Post }) => {
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
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-center mb-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(post.type)}`}
          >
            {post.type.toLowerCase()}
          </span>
          <span className="ml-3 text-sm text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>

        {post.excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
        )}

        <Link
          href={`/posts/${post.slug}`}
          className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center"
        >
          Read more
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </article>
  );
};

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-800/30 to-blue-800/30 backdrop-blur-sm"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Stage
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Stream
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Dive into exclusive content, behind-the-scenes stories, and
              connect with creators like never before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105">
                Start Exploring
              </button>
              <Link
                href="/admin"
                className="px-8 py-4 border-2 border-white/20 text-white font-semibold rounded-lg hover:bg-white/10 transition-all"
              >
                Admin Panel
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Pricing Section */}
      <PricingPlans />

      {/* Content Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Latest Content
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our latest blogs, posts, and podcast episodes
            </p>
          </div>

          {posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">
                No content available yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">
              Stage<span className="text-purple-400">Stream</span>
            </h3>
            <p className="text-gray-400 mb-6">
              Your gateway to exclusive content and creator connections.
            </p>
            <div className="flex justify-center space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Instagram
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                YouTube
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}