import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '../../components/layout/Layout';
import api from '../../api/axios';
import { Search, SlidersHorizontal, Star, MapPin } from 'lucide-react';

const categories = ['cleaning', 'plumbing', 'electrical', 'tutoring', 'beauty', 'moving', 'repair', 'gardening', 'other'];

const fetchServices = async ({ keyword, category, minPrice, maxPrice, page }) => {
  const params = new URLSearchParams();
  if (keyword) params.append('keyword', keyword);
  if (category) params.append('category', category);
  if (minPrice) params.append('minPrice', minPrice);
  if (maxPrice) params.append('maxPrice', maxPrice);
  params.append('page', page);
  params.append('limit', 12);
  const { data } = await api.get(`/services?${params.toString()}`);
  return data;
};

const ServicesPage = () => {
  const [searchParams] = useSearchParams();
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['services', keyword, category, minPrice, maxPrice, page],
    queryFn: () => fetchServices({ keyword, category, minPrice, maxPrice, page }),
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Services</h1>
        <p className="text-gray-500 mb-8">Find trusted local service providers near you</p>

        {/* Search + Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search services..."
              value={keyword}
              onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
              className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 hover:border-orange-400 transition-colors shadow-sm"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-400"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Min Price (Rs.)</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                placeholder="0"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Max Price (Rs.)</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                placeholder="10000"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-400"
              />
            </div>
          </div>
        )}

        {/* Category Pills */}
        <div className="flex gap-2 flex-wrap mb-8">
          <button
            onClick={() => { setCategory(''); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              category === '' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => { setCategory(c); setPage(1); }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                category === c ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
              }`}
            >
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="text-center py-20 text-gray-400">Loading services...</div>
        ) : data?.services?.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-semibold">No services found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">{data?.total} services found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.services?.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>

            {/* Pagination */}
            {data?.pages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: data.pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                      page === p ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

const ServiceCard = ({ service }) => (
  <Link
    to={`/services/${service._id}`}
    className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden group"
  >
    {/* Image */}
    <div className="h-44 bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center overflow-hidden">
      {service.images?.[0] ? (
        <img src={service.images[0]} alt={service.title} className="w-full h-full object-cover" />
      ) : (
        <span className="text-5xl">
          {service.category === 'cleaning' ? '🧹' :
           service.category === 'plumbing' ? '🔧' :
           service.category === 'electrical' ? '⚡' :
           service.category === 'tutoring' ? '📚' :
           service.category === 'beauty' ? '💄' :
           service.category === 'moving' ? '📦' :
           service.category === 'repair' ? '🛠️' :
           service.category === 'gardening' ? '🌿' : '🔨'}
        </span>
      )}
    </div>

    <div className="p-4">
      <span className="text-xs font-semibold text-orange-500 uppercase tracking-wide">
        {service.category}
      </span>
      <h3 className="font-bold text-gray-900 mt-1 mb-1 group-hover:text-orange-500 transition-colors line-clamp-1">
        {service.title}
      </h3>
      <p className="text-xs text-gray-500 line-clamp-2 mb-3">{service.description}</p>

      <div className="flex items-center justify-between">
        <div>
          <span className="font-bold text-gray-900">Rs. {service.price}</span>
          <span className="text-xs text-gray-400 ml-1">/ {service.priceType}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Star size={12} className="text-yellow-400 fill-yellow-400" />
          <span>{service.rating || '0'}</span>
          <span>({service.reviewCount || 0})</span>
        </div>
      </div>

      {service.provider && (
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-100">
          <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
            <span className="text-orange-600 font-bold text-xs">
              {service.provider.name?.charAt(0)}
            </span>
          </div>
          <span className="text-xs text-gray-500">{service.provider.name}</span>
          {service.provider.location?.district && (
            <span className="text-xs text-gray-400 flex items-center gap-0.5 ml-auto">
              <MapPin size={10} /> {service.provider.location.district}
            </span>
          )}
        </div>
      )}
    </div>
  </Link>
);

export default ServicesPage;