import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <MapPin size={18} className="text-white" />
              </div>
              <span className="font-bold text-xl text-white">
                Local<span className="text-orange-500">Serve</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Connecting skilled local service providers with customers across Nepal.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/services" className="hover:text-orange-500 transition-colors">Browse Services</Link></li>
              <li><Link to="/register" className="hover:text-orange-500 transition-colors">Become a Provider</Link></li>
              <li><Link to="/login" className="hover:text-orange-500 transition-colors">Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/services?category=cleaning" className="hover:text-orange-500 transition-colors">Cleaning</Link></li>
              <li><Link to="/services?category=plumbing" className="hover:text-orange-500 transition-colors">Plumbing</Link></li>
              <li><Link to="/services?category=tutoring" className="hover:text-orange-500 transition-colors">Tutoring</Link></li>
              <li><Link to="/services?category=electrical" className="hover:text-orange-500 transition-colors">Electrical</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-sm text-center">
          © {new Date().getFullYear()} LocalServe Nepal. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;