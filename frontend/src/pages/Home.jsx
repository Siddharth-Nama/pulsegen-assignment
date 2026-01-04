import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Play, Shield, Zap, ArrowRight, CheckCircle } from 'lucide-react';

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div className="relative">
      {/* Background Gradients */}
      <div className="absolute top-0 inset-x-0 h-screen overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-neutral-800/20 rounded-full blur-[100px]"></div>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center py-20 lg:py-32 px-4 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-red-400 text-xs font-medium uppercase tracking-wider mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          Next Gen Video Analysis
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700">
          Secure Video Hosting <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">
            Intelligent Protection
          </span>
        </h1>
        
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000">
          Upload, stream, and automatically analyze your video content for sensitive material. 
          Enterprise-grade security meets lightning-fast streaming.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
          {user ? (
            <Link 
              to="/" 
              className="group inline-flex items-center justify-center gap-2 bg-red-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:bg-red-700 hover:scale-105 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <>
              <Link 
                to="/register" 
                className="group inline-flex items-center justify-center gap-2 bg-red-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:bg-red-700 hover:scale-105 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/login" 
                className="inline-flex items-center justify-center gap-2 bg-white/5 text-white px-8 py-4 rounded-full font-semibold text-lg border border-white/10 hover:bg-white/10 transition-all hover:scale-105"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 py-20 relative z-10">
        {[
          {
            icon: Zap,
            title: "Lightning Fast",
            desc: "Global CDN powered streaming with adaptive bitrate support for seamless playback anywhere."
          },
          {
            icon: Shield,
            title: "AI Analysis",
            desc: "Automatic sensitivity detection flags unsafe content instantly upon upload using advanced AI."
          },
          {
            icon: Play,
            title: "Premium Player",
            desc: "Custom-built video player with support for extensive formats and secure token-based access."
          }
        ].map((feature, idx) => (
          <div key={idx} className="glass-card p-8 hover:bg-white/5 transition-colors group">
            <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-white/5">
              <feature.icon className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
            <p className="text-gray-400 leading-relaxed">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Tech Stack / Trust Badges */}
      <div className="border-t border-white/5 bg-neutral-950/50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-8">Powered by Modern Tech</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {['Django', 'React', 'Python', 'Tailwind', 'Render'].map((tech) => (
              <span key={tech} className="text-xl font-bold text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-red-600" /> {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
