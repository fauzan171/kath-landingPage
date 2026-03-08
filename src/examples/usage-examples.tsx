/**
 * CONTOH PENGGUNAAN SERVICE LAYER
 *
 * File ini menunjukkan cara menggunakan service layer dan hooks
 * yang sudah dibuat untuk mengintegrasikan dengan backend API.
 */

import { usePortfolio, useNews, useCompetitions, useFeaturedEvents } from './hooks';

// ==========================================
// 1. MENGGUNAKAN HOOKS DI DALAM COMPONENT
// ==========================================

/**
 * Contoh 1: Fetch Portfolio Data
 * Gunakan ini di dalam component Portfolio.tsx
 */
export function PortfolioExample() {
  // Fetch semua portfolio
  const { data: portfolioItems, loading, error, refetch } = usePortfolio({
    category: 'Wedding',
    page: 1,
    limit: 10
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      {portfolioItems?.map((item) => (
        <div key={item.id}>
          <h3>{item.title}</h3>
          <p>{item.location}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * Contoh 2: Fetch News Data dengan Filter
 * Gunakan ini di dalam component News.tsx
 */
export function NewsExample() {
  // Fetch news dengan filter category
  const { data: newsItems, loading } = useNews({
    category: 'Competition',
    sort: 'desc',
    page: 1,
    limit: 6
  });

  // Fetch categories untuk filter buttons
  // const { data: categories } = useNewsCategories();

  return (
    <div>
      {newsItems?.map((item) => (
        <article key={item.id}>
          <h3>{item.title}</h3>
          <p>{item.excerpt}</p>
        </article>
      ))}
    </div>
  );
}

/**
 * Contoh 3: Fetch Competition Data
 * Gunakan ini di dalam component Competition.tsx
 */
export function CompetitionExample() {
  // Fetch main competition
  const { data: mainCompetition } = useMainCompetition();

  // Fetch semua kompetisi
  const { data: competitions } = useCompetitions({ status: 'Open' });

  return (
    <div>
      <h2>{mainCompetition?.name}</h2>
      <p>Deadline: {mainCompetition?.deadline}</p>

      <div>
        {competitions?.map((comp) => (
          <div key={comp.id}>
            <h4>{comp.name}</h4>
            <span>{comp.prize}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Contoh 4: Fetch Featured Events (CardStack)
 * Gunakan ini di dalam component CardStack.tsx
 */
export function FeaturedEventsExample() {
  const { data: featuredEvents } = useFeaturedEvents();

  return (
    <div>
      {featuredEvents?.map((event, index) => (
        <div key={event.id} style={{ transform: `rotate(${event.rotation}deg)` }}>
          <img src={event.image} alt={event.title} />
          <h3>{event.title}</h3>
          <p>{event.description}</p>
        </div>
      ))}
    </div>
  );
}

// ==========================================
// 2. MENGGUNAKAN HOOKS UNTUK MUTATION
// ==========================================

/**
 * Contoh 5: Create Portfolio (Admin Dashboard)
 */
export function AdminCreatePortfolioExample() {
  const { mutate: createPortfolio, loading, error } = useCreatePortfolio();

  const handleSubmit = async () => {
    try {
      await createPortfolio({
        image: '/uploads/new-event.webp',
        title: 'New Event',
        category: 'Wedding',
        location: 'Jakarta',
        year: '2025',
      });
      alert('Portfolio created!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button onClick={handleSubmit} disabled={loading}>
      {loading ? 'Creating...' : 'Create Portfolio'}
    </button>
  );
}

/**
 * Contoh 6: Create News Article (Admin Dashboard)
 */
export function AdminCreateNewsExample() {
  const { mutate: createNews, loading } = useCreateNews();

  const handlePublish = async () => {
    await createNews({
      title: 'New Announcement',
      excerpt: 'Short description',
      content: '<p>Full HTML content</p>',
      image: '/uploads/news.webp',
      category: 'Announcement',
      author: 'Admin',
      slug: 'new-announcement',
    });
  };

  return <button onClick={handlePublish}>Publish</button>;
}

// ==========================================
// 3. MENGGUNAKAN SERVICE LANGSUNG (Tanpa Hooks)
// ==========================================

/**
 * Contoh 7: Fetch data tanpa hooks
 * Cocok untuk server-side rendering atau useEffect manual
 */
import { portfolioService, newsService, competitionService } from './services';

export async function getServerSideProps() {
  // Fetch semua data yang dibutuhkan
  const [portfolio, news, competitions] = await Promise.all([
    portfolioService.getAll(),
    newsService.getAll({ limit: 5 }),
    competitionService.getMain(),
  ]);

  return {
    props: {
      portfolio: portfolio.data,
      news: news.data,
      mainCompetition: competitions.data,
    },
  };
}

/**
 * Contoh 8: Event Handler untuk Delete
 */
export function DeleteButton({ id }: { id: string }) {
  const { mutate: deletePortfolio, loading } = useDeletePortfolio();

  const handleDelete = async () => {
    if (confirm('Are you sure?')) {
      try {
        await deletePortfolio(id);
        alert('Deleted successfully');
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  return (
    <button onClick={handleDelete} disabled={loading}>
      {loading ? 'Deleting...' : 'Delete'}
    </button>
  );
}

// ==========================================
// 4. CONTOH UNTUK REGISTRASI KOMPETISI
// ==========================================

/**
 * Contoh 9: Form Registrasi Kompetisi
 */
export function RegistrationForm({ competitionId }: { competitionId: string }) {
  const { mutate: register, loading, error } = useRegisterCompetition(competitionId);

  const handleRegister = async () => {
    try {
      const result = await register({
        participantName: 'John Doe',
        email: 'john@example.com',
        phone: '+62 812 3456 7890',
        teamName: 'Creative Team',
      });

      if (result.success) {
        alert(`Registration successful! ID: ${result.data?.registrationId}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <button onClick={handleRegister} disabled={loading}>
        {loading ? 'Registering...' : 'Register Now'}
      </button>
    </div>
  );
}

// ==========================================
// 5. CONTOH AUTHENTICATION
// ==========================================

/**
 * Contoh 10: Login Form
 */
export function LoginForm() {
  const { login, loading, error } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({
      email: 'admin@kathevent.com',
      password: 'password123',
    });
  };

  return (
    <form onSubmit={handleLogin}>
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

/**
 * Contoh 11: Protected Route/Component
 */
export function ProtectedAdminPanel() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login to access admin panel</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      {/* Admin content here */}
    </div>
  );
}