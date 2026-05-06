import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { Search, Star, Shield, Clock, ChevronRight } from 'lucide-react';

const categories = [
  { name: 'Cleaning', icon: '🧹', slug: 'cleaning' },
  { name: 'Plumbing', icon: '🔧', slug: 'plumbing' },
  { name: 'Electrical', icon: '⚡', slug: 'electrical' },
  { name: 'Tutoring', icon: '📚', slug: 'tutoring' },
  { name: 'Beauty', icon: '💄', slug: 'beauty' },
  { name: 'Moving', icon: '📦', slug: 'moving' },
  { name: 'Repair', icon: '🛠️', slug: 'repair' },
  { name: 'Gardening', icon: '🌿', slug: 'gardening' },
];

const HomePage = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Local Services,<br />
            <span className="text-orange-500">Delivered to Your Door</span>
          </h1>
          <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto">
            Find trusted local service providers across Nepal | from cleaning to tutoring, plumbing to beauty.
          </p>

          {/* Search bar */}
          <div className="flex items-center gap-2 max-w-lg mx-auto bg-white rounded-xl shadow-md p-2 border border-gray-200">
            <Search size={20} className="text-gray-400 ml-2" />
            <input
              type="text"
              placeholder="What service do you need?"
              className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400"
            />
            <Link
              to="/services"
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
            >
              Search
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Browse by Category</h2>
            <Link to="/services" className="text-orange-500 hover:text-orange-600 text-sm font-semibold flex items-center gap-1">
              View all <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/services?category=${cat.slug}`}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-orange-200 hover:shadow-md transition-all group"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-xs font-semibold text-gray-600 group-hover:text-orange-500 transition-colors text-center">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why LocalServe */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">Why LocalServe Nepal?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Shield size={28} className="text-orange-500" />, title: 'Verified Providers', desc: 'Every provider is reviewed and approved by our admin team before listing.' },
              { icon: <Star size={28} className="text-orange-500" />, title: 'Rated & Reviewed', desc: 'Read real reviews from real customers before booking any service.' },
              { icon: <Clock size={28} className="text-orange-500" />, title: 'Book Instantly', desc: 'Choose your date and time slot and confirm your booking in seconds.' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-orange-500 rounded-2xl p-10 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Are you a service provider?</h2>
            <p className="text-orange-100 mb-8 max-w-md mx-auto">
              Join LocalServe Nepal and start earning by offering your skills to customers near you.
            </p>
            <Link
              to="/register"
              className="bg-white text-orange-500 hover:bg-orange-50 font-bold px-8 py-3 rounded-xl transition-colors inline-block"
            >
              Register as Provider
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;