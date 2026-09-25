import { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = { Critical: '#ef4444', High: '#f97316', Medium: '#eab308', Low: '#3b82f6' };

export default function App() {
  const [liveUrl, setLiveUrl] = useState('');
  const [scan, setScan] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const fetchHistory = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/history');
      setHistory(data);
    } catch (e) {
      console.log('Could not fetch history');
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [scan]);

  const handleScan = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/scan', { liveUrl });
      setScan(data);
      fetchHistory();
    } catch (err) {
      alert('Scan failed. Ensure backend server is running on port 5000.');
    }
    setLoading(false);
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const chartData = scan?.findings.reduce((acc, f) => {
    const existing = acc.find(item => item.name === f.severity);
    if (existing) existing.value += 1;
    else acc.push({ name: f.severity, value: 1 });
    return acc;
  }, []) || [];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8 font-sans">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Main Content */}
        <div className="md:col-span-3 space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-indigo-400 mb-1">StackGuard</h1>
            <p className="text-gray-400">MERN Security Posture Scanner & Fix Advisor</p>
          </div>

          <form onSubmit={handleScan} className="flex gap-4">
            <input 
              type="url" 
              placeholder="https://your-production-app.com" 
              value={liveUrl} 
              onChange={(e) => setLiveUrl(e.target.value)}
              required
              className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Scanning...' : 'Run Audit'}
            </button>
          </form>

          {scan && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-900 border border-gray-800 p-6 rounded-xl">
                <div>
                  <h3 className="text-gray-400 uppercase text-xs font-bold tracking-wider mb-2">Security Score</h3>
                  <div className={`text-6xl font-black ${scan.score > 75 ? 'text-green-400' : scan.score > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {scan.score}/100
                  </div>
                  <p className="text-gray-400 mt-4 text-sm">Evaluated against OWASP guidelines and header best practices.</p>
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={60} label>
                        {chartData.map((entry) => <Cell key={entry.name} fill={COLORS[entry.name] || '#ffffff'} />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-bold">Detected Vulnerabilities & Fixes</h2>
                {scan.findings.map((f, i) => (
                  <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-white">{f.description}</span>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${f.severity === 'Critical' ? 'bg-red-950 text-red-400 border border-red-800' : f.severity === 'High' ? 'bg-orange-950 text-orange-400 border border-orange-800' : 'bg-yellow-950 text-yellow-400 border border-yellow-800'}`}>
                        {f.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">{f.category.toUpperCase()} — Remediation Strategy</p>
                    <div className="relative bg-black/50 border border-gray-800 rounded-lg p-4 font-mono text-xs text-indigo-300 overflow-x-auto whitespace-pre">
                      <button 
                        onClick={() => handleCopy(f.fix?.code || f.remediation, i)}
                        className="absolute top-2 right-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-2.5 py-1 rounded text-[11px] font-sans transition cursor-pointer"
                      >
                        {copiedIndex === i ? 'Copied!' : 'Copy Fix'}
                      </button>
                      {f.fix?.code || f.remediation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar for Recent Scans */}
        <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl h-fit space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Recent Audits</h3>
          {history.length === 0 ? (
            <p className="text-xs text-gray-500">No scans performed yet.</p>
          ) : (
            <div className="space-y-3">
              {history.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setScan(item)}
                  className="bg-black/40 border border-gray-800 hover:border-indigo-500 p-3 rounded-lg cursor-pointer transition"
                >
                  <p className="text-xs font-semibold text-white truncate">{item.liveUrl}</p>
                  <div className="flex justify-between items-center mt-2 text-[11px]">
                    <span className={item.score > 75 ? 'text-green-400' : item.score > 40 ? 'text-yellow-400' : 'text-red-400'}>
                      Score: {item.score}/100
                    </span>
                    <span className="text-gray-500">{item.findings.length} issues</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}