import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import PageHeader from '../../components/ui/PageHeader';
import { LoadingState, ErrorState, EmptyState } from '../../components/ui/LoadingState';

export default function Blog() {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(false);

  function load() {
    setError(false);
    setPosts(null);
    api.get('/blog').then((res) => setPosts(res.data)).catch(() => setError(true));
  }
  useEffect(load, []);

  return (
    <>
      <PageHeader eyebrow="News" title="Blog" subtitle="Farming practices, community impact, and updates from Lobito Farms." />
      <section className="section">
        <div className="container">
          {error ? (
            <ErrorState onRetry={load} />
          ) : !posts ? (
            <LoadingState />
          ) : posts.length === 0 ? (
            <EmptyState message="No posts published yet." />
          ) : (
            <div className="row g-4">
              {posts.map((post) => (
                <div className="col-12 col-md-6 col-lg-4" key={post._id}>
                  <Link to={`/blog/${post.slug}`} className="text-decoration-none text-reset">
                    <div className="card h-100 card-hover">
                      {post.coverImage && (
                        <img src={post.coverImage} className="card-img-top" alt={post.title} loading="lazy" style={{ height: 190, objectFit: 'cover' }} />
                      )}
                      <div className="card-body">
                        <div className="d-flex gap-2 flex-wrap mb-2">
                          {post.category && <span className="badge bg-cream-dark text-dark">{post.category}</span>}
                        </div>
                        <h2 className="h5 card-title">{post.title}</h2>
                        <p className="card-text text-muted-warm small line-clamp-3">{post.excerpt}</p>
                        <div className="small text-muted-warm mt-2">
                          {post.publishedAt && new Date(post.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
