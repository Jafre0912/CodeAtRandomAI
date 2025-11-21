import React, { useState, useEffect } from 'react';
import { 
  Zap, CheckCircle2, XCircle, TrendingUp, 
  Newspaper, ArrowRight, Loader2, Code2 
} from 'lucide-react';
import { analyzeSkills, getRoadmap, fetchTopStories } from '../services/api';

// --- Navbar Component ---
const Navbar = () => (
  <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Code2 className="text-white h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">
            CodeAtRandom AI
          </span>
        </div>
        <div className="hidden md:block">
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
                Full Stack Career Assistant
            </span>
        </div>
      </div>
    </div>
  </nav>
);

const Dashboard = () => {
  const [role, setRole] = useState('Backend Developer');
  const [skills, setSkills] = useState('Java, Git');
  const [loading, setLoading] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  
  const [skillData, setSkillData] = useState(null);
  const [roadmapData, setRoadmapData] = useState(null);
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetchTopStories().then(setNews);
  }, []);

  const handleAnalysis = async () => {
    setLoading(true);
    setHasAnalyzed(true);
    // Reset data while loading
    setSkillData(null); 
    setRoadmapData(null);

    try {
      const [skillRes, roadmapRes] = await Promise.all([
        analyzeSkills(role, skills),
        getRoadmap(role)
      ]);
      setSkillData(skillRes.data);
      setRoadmapData(roadmapRes.data.roadmap);
    } catch (error) {
      console.warn("Backend unavailable, loading demo data.");
      // Demo Data fallback
      setTimeout(() => {
        setSkillData({
            matched_skills: ["Java"],
            missing_skills: ["Spring Boot", "SQL", "Docker"],
            recommendations: "Good start. Focus on containerization.",
            suggested_learning_order: ["Spring Boot", "SQL", "Docker"]
        });
        setRoadmapData({
            phase_1: { duration: "1-2 mo", focus: "Java Advanced & OOP" },
            phase_2: { duration: "2 mo", focus: "Spring Boot & Microservices" },
            phase_3: { duration: "1 mo", focus: "Cloud & Deployment" }
        });
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* HERO SECTION */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
            Bridge your skill gap. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Accelerate your career.
            </span>
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
            Enter your target role and current stack to get a personalized, AI-driven learning roadmap.
          </p>
        </div>

        {/* INPUT CARD */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-2 max-w-3xl mx-auto mb-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 p-2">
            
            {/* Role Input */}
            <div className="md:col-span-5 bg-slate-50 rounded-xl px-4 py-2 border border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Target Role</label>
              <input 
                type="text" 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-transparent border-none p-0 text-slate-800 font-semibold placeholder-slate-400 focus:ring-0 text-sm"
                placeholder="Full Stack Developer"
              />
            </div>
            
            {/* Skills Input */}
            <div className="md:col-span-5 bg-slate-50 rounded-xl px-4 py-2 border border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Current Stack</label>
              <input 
                type="text" 
                value={skills} 
                onChange={(e) => setSkills(e.target.value)}
                className="w-full bg-transparent border-none p-0 text-slate-800 font-semibold placeholder-slate-400 focus:ring-0 text-sm"
                placeholder="React, Node.js, Git"
              />
            </div>

            {/* Button */}
            <div className="md:col-span-2">
              <button 
                onClick={handleAnalysis} 
                disabled={loading}
                className="w-full h-full min-h-[50px] bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all flex justify-center items-center shadow-lg shadow-slate-900/20 active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Analyze"}
              </button>
            </div>
          </div>
        </div>

        {/* RESULTS AREA */}
        {hasAnalyzed && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* SKILL GAP */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                    <div className="lg:col-span-4">
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-full">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                                <Zap size={18} className="text-amber-500" /> Analysis
                            </h3>
                            
                            {!skillData ? (
                                <div className="animate-pulse space-y-3">
                                    <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                                    <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs font-bold text-rose-500 uppercase mb-2">Missing Skills</p>
                                        <div className="flex flex-wrap gap-2">
                                            {skillData.missing_skills.map(s => (
                                                <span key={s} className="px-2 py-1 bg-rose-50 text-rose-600 border border-rose-100 text-xs font-semibold rounded-md flex items-center gap-1">
                                                    <XCircle size={12} /> {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-slate-100">
                                        <p className="text-xs font-bold text-emerald-600 uppercase mb-2">Matched</p>
                                        <div className="flex flex-wrap gap-2">
                                            {skillData.matched_skills.map(s => (
                                                <span key={s} className="px-2 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-semibold rounded-md flex items-center gap-1">
                                                    <CheckCircle2 size={12} /> {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ROADMAP */}
                    <div className="lg:col-span-8">
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                             <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
                                <TrendingUp size={18} className="text-blue-500" /> Learning Path
                            </h3>
                            
                            {!roadmapData ? (
                                <div className="space-y-4 animate-pulse">
                                    <div className="h-16 bg-slate-50 rounded-xl"></div>
                                    <div className="h-16 bg-slate-50 rounded-xl"></div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {Object.entries(roadmapData).map(([key, val], idx) => (
                                        <div key={key} className="flex items-center p-4 bg-slate-50 border border-slate-100 rounded-xl">
                                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                                                {idx + 1}
                                            </div>
                                            <div className="ml-4 flex-grow">
                                                <div className="flex justify-between items-center mb-1">
                                                    <h4 className="font-bold text-slate-800 text-sm uppercase">{key.replace('_', ' ')}</h4>
                                                    <span className="text-[10px] font-bold bg-white border border-slate-200 px-2 py-1 rounded text-slate-500">{val.duration}</span>
                                                </div>
                                                <p className="text-sm text-slate-600">{val.focus}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* NEWS GRID */}
        <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Newspaper size={20} /> Trending Tech
                </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {news.length > 0 ? news.map(n => (
                    <a key={n.id} href={n.url} target="_blank" className="group block p-6 bg-white rounded-2xl border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">NEWS</span>
                            <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-600 -translate-x-2 group-hover:translate-x-0 transition-all opacity-0 group-hover:opacity-100"/>
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                            {n.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-2">Recommended for you</p>
                    </a>
                )) : (
                    [1,2,3].map(i => <div key={i} className="h-40 bg-slate-100 animate-pulse rounded-2xl"></div>)
                )}
            </div>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;