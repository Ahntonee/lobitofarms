import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/client';
import { LoadingState, ErrorState } from '../../components/ui/LoadingState';
import useDocumentMeta from '../../hooks/useDocumentMeta';

export default function BlogPostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(false);

  function load() {
    setError(false);
    setPost(null);
    api
      .get(`/blog/slug/${slug}`)
      .then((res) => setPost(res.data))
      .catch(() => setError(true));
  }
  useEffect(load, [slug]);

  useDocumentMeta(
    post && (post.seo?.metaTitle || `${post.title} | Lobito Farms`),
    post && (post.seo?.metaDescription || post.excerpt)
  );

  if (error) return <ErrorState message="Post not found." onRetry={load} />;
  if (!post) return <LoadingState />;

  return (
    <article className="section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <nav className="small mb-3">
              <Link to="/blog" className="text-muted-warm">← Back to Blog</Link>
            </nav>
            {post.category && <span className="eyebrow">{post.category}</span>}
            <h1 className="display-6 fw-bold mt-1 mb-3">{post.title}</h1>
            <div className="small text-muted-warm mb-4">
              {post.publishedAt && new Date(post.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            {post.coverImage && <img src={post.coverImage} alt={post.title} className="rounded-4 w-100 mb-4" style={{ maxHeight: 420, objectFit: 'cover' }} />}
            <div className="fs-6" dangerouslySetInnerHTML={{ __html: post.body }} />
            {post.tags?.length > 0 && (
              <div className="d-flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag) => (
                  <span key={tag} className="badge bg-cream-dark text-dark">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
