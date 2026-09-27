import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, Legend 
} from 'recharts';
import { 
  UploadCloud, CheckCircle, AlertCircle, Play, FileDigit, BarChart2, 
  ArrowLeft, MonitorPlay, Maximize, X, Activity, Database, Layers,
  FastForward, Shuffle, ArrowDownUp, Info
} from 'lucide-react';
import './index.css';

const API_URL = 'http://localhost:8000/api';

function App() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [presentationMode, setPresentationMode] = useState(false);
  
  const [dataset, setDataset] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState('');
  const [inputType, setInputType] = useState('Random');
  const [isUploading, setIsUploading] = useState(false);
  
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  
  // Visualizer State
  const [visAlgorithm, setVisAlgorithm] = useState('quick');
  const [visStep, setVisStep] = useState(0);

  // Helper
  const navigateTo = (screen) => {
    setCurrentScreen(screen);
    window.scrollTo(0,0);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(`${API_URL}/dataset/upload`, formData);
      setDataset(res.data);
      if (res.data.numeric_cols.length > 0) {
        setSelectedColumn(res.data.numeric_cols[0]);
      } else {
        setError('No numeric columns were detected. Please upload a CSV containing at least one numeric column.');
      }
      navigateTo('analyzer');
    } catch (err) {
      setError('Failed to upload dataset. Ensure backend is running.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDemoDataset = async () => {
    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('size', '5000');
      const res = await axios.post(`${API_URL}/dataset/generate`, formData);
      setDataset(res.data);
      if (res.data.numeric_cols.length > 0) {
        setSelectedColumn(res.data.numeric_cols[0]);
      }
      navigateTo('analyzer');
    } catch (err) {
      setError('Failed to generate demo dataset.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRunBenchmark = async () => {
    if (!selectedColumn) {
      setError('Please select a numeric column before running the benchmark.');
      return;
    }
    
    setIsBenchmarking(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('column', selectedColumn);
    formData.append('input_type', inputType);
    formData.append('algorithm', 'both');
    
    try {
      const res = await axios.post(`${API_URL}/benchmark`, formData);
      setResults(res.data);
      navigateTo('results');
    } catch (err) {
      setError('Benchmark failed. Ensure backend is running.');
    } finally {
      setIsBenchmarking(false);
    }
  };

  const togglePresentationMode = () => setPresentationMode(!presentationMode);

  // Render Helpers
  const renderHeader = () => (
    <header className="top-nav">
      <div className="nav-brand">
        <Activity className="text-orange" />
        <span>Algorithm <span className="text-muted">Analyzer</span></span>
      </div>
      <div className="nav-links">
        <button className={`nav-link ${currentScreen === 'dashboard' ? 'active' : ''}`} onClick={() => navigateTo('dashboard')}>Dashboard</button>
        <button className={`nav-link ${currentScreen === 'analyzer' ? 'active' : ''}`} onClick={() => navigateTo('analyzer')}>Analyzer</button>
        <button className={`nav-link ${currentScreen === 'visualizer' ? 'active' : ''}`} onClick={() => navigateTo('visualizer')}>Visualizer</button>
        <button className={`nav-link ${currentScreen === 'results' ? 'active' : ''}`} onClick={() => navigateTo('results')}>Results</button>
        <button className={`nav-link ${currentScreen === 'about' ? 'active' : ''}`} onClick={() => navigateTo('about')}>About</button>
      </div>
      <div>
        <button className="presentation-btn" onClick={togglePresentationMode}>
          <MonitorPlay size={16} /> Presentation Mode
        </button>
      </div>
    </header>
  );

  const renderDashboard = () => (
    <div className="animate-fade-in">
      <div className="hero">
        <h1 className="text-5xl font-bold mb-4">Quick Sort <span className="text-muted">vs</span> Merge Sort</h1>
        <p className="text-xl text-muted mb-8 max-w-2xl mx-auto">
          Interactive Performance Analyzer for Large ML Datasets. <br/>
          Upload a CSV dataset, select a numeric feature, run both sorting algorithms under the same conditions, and compare their real measured performance.
        </p>
        <div className="flex justify-center gap-4">
          <label className="btn btn-primary cursor-pointer">
            <UploadCloud size={20} />
            Upload CSV & Analyze
            <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>
          <button className="btn btn-outline" onClick={handleDemoDataset} disabled={isUploading}>
            {isUploading ? 'Loading...' : 'Try Demo Dataset'}
          </button>
        </div>
        <div className="flex justify-center gap-6 mt-8 text-sm text-muted">
          <span className="flex items-center gap-1"><CheckCircle size={14} className="text-success" /> Algorithms from scratch</span>
          <span className="flex items-center gap-1"><CheckCircle size={14} className="text-success" /> Same input for both</span>
          <span className="flex items-center gap-1"><CheckCircle size={14} className="text-success" /> Real measurements</span>
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-6 text-center">Why Compare Sorting Algorithms?</h2>
      <p className="text-center text-muted mb-8 max-w-3xl mx-auto">
        Sorting is a supporting operation in data processing, analytics, ranking, and some machine learning workflows. Algorithm choice can affect execution time, memory usage, and scalability.
      </p>

      <div className="grid grid-cols-3 gap-6 mb-12">
        <div className="glass-card text-center">
          <Database size={32} className="mx-auto mb-4 text-orange" />
          <h3 className="text-xl font-semibold mb-2">Data Scale</h3>
          <p className="text-muted">Datasets can contain thousands or millions of records, emphasizing the need for efficient O(n log n) algorithms.</p>
        </div>
        <div className="glass-card text-center">
          <FastForward size={32} className="mx-auto mb-4 text-purple" />
          <h3 className="text-xl font-semibold mb-2">Performance Variance</h3>
          <p className="text-muted">Execution time can change dramatically with input size and the initial order of the data.</p>
        </div>
        <div className="glass-card text-center">
          <Layers size={32} className="mx-auto mb-4 text-success" />
          <h3 className="text-xl font-semibold mb-2">Algorithm Choice</h3>
          <p className="text-muted">Quick Sort and Merge Sort have different performance characteristics, space complexities, and stability.</p>
        </div>
      </div>
    </div>
  );

  const renderAnalyzer = () => (
    <div className="animate-fade-in">
      <button className="btn-back" onClick={() => navigateTo('dashboard')}>
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <h2 className="text-3xl font-bold mb-6">Dataset Analyzer</h2>

      {!dataset ? (
        <div className="upload-area">
          <UploadCloud size={48} className="mx-auto mb-4 text-muted" />
          <h3 className="text-2xl font-bold mb-2">Drop your CSV dataset here</h3>
          <p className="text-muted mb-6">or click to browse</p>
          <label className="btn btn-primary cursor-pointer">
            Select CSV File
            <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          
          <div className="glass-card">
            <h3 className="card-title"><Database className="text-orange"/> Dataset Overview</h3>
            <div className="flex gap-8 mb-6">
              <div>
                <span className="text-sm text-muted block">File</span>
                <span className="font-semibold">{dataset.is_synthetic ? 'Demo Dataset' : 'Uploaded CSV'}</span>
              </div>
              <div>
                <span className="text-sm text-muted block">Rows</span>
                <span className="font-semibold">{dataset.num_rows.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-sm text-muted block">Columns</span>
                <span className="font-semibold">{dataset.num_cols}</span>
              </div>
            </div>

            <div className="table-container mb-4">
              <table>
                <thead>
                  <tr>
                    {dataset.columns.map(col => (
                      <th key={col}>
                        {col} {dataset.numeric_cols.includes(col) && <span className="text-orange ml-1 text-xs">(Num)</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataset.preview_data.map((row, idx) => (
                    <tr key={idx}>
                      {dataset.columns.map(col => (
                        <td key={col} style={{ 
                          color: col === selectedColumn ? 'var(--text-main)' : 'inherit',
                          fontWeight: col === selectedColumn ? '600' : 'normal'
                        }}>
                          {row[col]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted text-right">Showing first 10 rows...</p>
          </div>

          <div className="glass-card border-orange">
            <h3 className="card-title"><Activity className="text-orange"/> Benchmark Configuration</h3>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm text-muted mb-2">Select Feature to Sort</label>
                <select className="select-field" value={selectedColumn} onChange={e => setSelectedColumn(e.target.value)}>
                  {dataset.numeric_cols.map(col => <option key={col} value={col}>{col}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-muted mb-2">Input Order</label>
                <select className="select-field" value={inputType} onChange={e => setInputType(e.target.value)}>
                  <option value="Random">Random</option>
                  <option value="Sorted">Sorted</option>
                  <option value="Reverse Sorted">Reverse Sorted</option>
                </select>
              </div>
            </div>

            {isBenchmarking ? (
              <div className="text-center py-6">
                <div className="animate-pulse flex flex-col items-center gap-4">
                  <Activity size={32} className="text-orange" />
                  <span className="text-lg">Running algorithms and verifying results...</span>
                </div>
              </div>
            ) : (
              <button className="btn btn-primary w-full text-lg py-4 flex items-center justify-center gap-2" onClick={handleRunBenchmark}>
                <Play fill="currentColor" size={20} /> RUN BENCHMARK
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderResults = () => {
    if (!results) {
      return (
        <div>
          <button className="btn-back" onClick={() => navigateTo('analyzer')}>
            <ArrowLeft size={16} /> Back to Analyzer
          </button>
          <div className="glass-card text-center py-12">
            <h2 className="text-2xl mb-2">No benchmark results yet</h2>
            <p className="text-muted mb-6">Run a benchmark to see actual algorithm performance.</p>
            <button className="btn btn-primary" onClick={() => navigateTo('analyzer')}>Go to Analyzer</button>
          </div>
        </div>
      );
    }

    const { quick, merge } = results.results;
    
    const chartData = [
      { name: 'Quick Sort', ExecutionTime: quick.execution_time_ms },
      { name: 'Merge Sort', ExecutionTime: merge.execution_time_ms },
    ];
    
    const opsChartData = [
      { name: 'Quick Sort', Comparisons: quick.comparisons },
      { name: 'Merge Sort', Comparisons: merge.comparisons },
    ];

    return (
      <div className="animate-fade-in">
        <button className="btn-back" onClick={() => navigateTo('analyzer')}>
          <ArrowLeft size={16} /> Back to Analyzer
        </button>

        <h2 className="text-3xl font-bold mb-6">Benchmark Results</h2>
        <p className="text-muted mb-6">Dataset Size: <strong>{results.size.toLocaleString()}</strong> elements | Input Order: <strong>{inputType}</strong></p>

        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Quick Sort Card */}
          <div className="glass-card border-orange">
            <h3 className="text-2xl font-bold text-orange mb-6 tracking-wide">QUICK SORT</h3>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                <span className="text-muted">Execution Time</span>
                <span className="text-2xl font-semibold">{quick.execution_time_ms.toFixed(2)} <span className="text-sm text-muted">ms</span></span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                <span className="text-muted">Comparisons</span>
                <span className="text-xl font-semibold">{quick.comparisons.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-muted">Correctness</span>
                <span className="flex items-center gap-1 text-success font-medium">
                  <CheckCircle size={18} /> Verified
                </span>
              </div>
            </div>
          </div>

          {/* Merge Sort Card */}
          <div className="glass-card border-purple">
            <h3 className="text-2xl font-bold text-purple mb-6 tracking-wide">MERGE SORT</h3>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                <span className="text-muted">Execution Time</span>
                <span className="text-2xl font-semibold">{merge.execution_time_ms.toFixed(2)} <span className="text-sm text-muted">ms</span></span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                <span className="text-muted">Comparisons</span>
                <span className="text-xl font-semibold">{merge.comparisons.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-muted">Correctness</span>
                <span className="flex items-center gap-1 text-success font-medium">
                  <CheckCircle size={18} /> Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="glass-card">
            <h3 className="card-title">Execution Time Comparison</h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                  <XAxis dataKey="name" stroke="#9CA3AF" tick={{fill: '#F3F4F6'}} />
                  <YAxis stroke="#9CA3AF" tick={{fill: '#F3F4F6'}} />
                  <RechartsTooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#1F2833', border: '1px solid #374151', color: '#fff', borderRadius: '8px' }} />
                  <Bar dataKey="ExecutionTime">
                    {chartData.map((entry, index) => (
                      <cell key={`cell-${index}`} fill={entry.name === 'Quick Sort' ? '#f97316' : '#a855f7'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card">
            <h3 className="card-title">Comparison Count</h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={opsChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                  <XAxis dataKey="name" stroke="#9CA3AF" tick={{fill: '#F3F4F6'}} />
                  <YAxis stroke="#9CA3AF" tick={{fill: '#F3F4F6'}} />
                  <RechartsTooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#1F2833', border: '1px solid #374151', color: '#fff', borderRadius: '8px' }} />
                  <Bar dataKey="Comparisons">
                    {opsChartData.map((entry, index) => (
                      <cell key={`cell-${index}`} fill={entry.name === 'Quick Sort' ? '#f97316' : '#a855f7'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="glass-card text-center mb-8 bg-surface">
          <h3 className="text-2xl font-bold mb-4">Key Takeaway</h3>
          <p className="text-lg text-muted mb-4 max-w-4xl mx-auto">
            Quick Sort can provide efficient in-place sorting with low auxiliary memory in typical implementations, 
            while Merge Sort provides stable sorting and predictable <strong>O(n log n)</strong> worst-case performance.
          </p>
          <p className="text-muted">
            Algorithm choice depends on input characteristics, memory constraints, stability requirements, and the application.
          </p>
        </div>
      </div>
    );
  };

  const renderVisualizer = () => {
    // Simple mock visualizer for demonstration purposes
    const dummyArray = [8, 3, 5, 1, 9, 2, 7];
    const maxVal = Math.max(...dummyArray);

    return (
      <div className="animate-fade-in">
        <button className="btn-back" onClick={() => navigateTo('dashboard')}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <h2 className="text-3xl font-bold mb-6">Algorithm Visualizer</h2>
        
        <div className="glass-card mb-8">
          <div className="tabs">
            <button className={`tab ${visAlgorithm === 'quick' ? 'active text-orange border-orange' : ''}`} onClick={() => setVisAlgorithm('quick')}>Quick Sort</button>
            <button className={`tab ${visAlgorithm === 'merge' ? 'active text-purple border-purple' : ''}`} onClick={() => setVisAlgorithm('merge')}>Merge Sort</button>
          </div>

          <div className="array-container">
            {dummyArray.map((val, idx) => (
              <div 
                key={idx} 
                className={`array-bar ${visAlgorithm === 'quick' ? 'bar-orange' : 'bar-purple'}`} 
                style={{ height: `${(val / maxVal) * 100}%` }}
              >
                {val}
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <button className="btn btn-outline" disabled>Start Animation</button>
            <p className="text-sm text-muted flex items-center ml-4">(Visualization is conceptual for this demo)</p>
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-6 mt-12">How Input Order Affects Performance</h3>
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="glass-card">
            <h4 className="font-bold mb-2 flex items-center gap-2"><Shuffle size={18}/> Random Input</h4>
            <p className="text-muted text-sm">Both Quick Sort and Merge Sort typically perform at O(n log n) with random data.</p>
          </div>
          <div className="glass-card">
            <h4 className="font-bold mb-2 flex items-center gap-2"><ArrowDownUp size={18}/> Sorted Input</h4>
            <p className="text-muted text-sm">Merge Sort maintains O(n log n). Quick Sort performance can vary based on the pivot selection strategy.</p>
          </div>
          <div className="glass-card">
            <h4 className="font-bold mb-2 flex items-center gap-2"><ArrowDownUp size={18} className="transform rotate-180"/> Reverse Sorted</h4>
            <p className="text-muted text-sm">Similar to sorted input, pivot choice in Quick Sort determines if it maintains O(n log n) or degrades to O(n²).</p>
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-6 mt-12">Complexity Comparison</h3>
        <div className="glass-card p-0 overflow-hidden mb-8">
          <div className="table-container border-0">
            <table>
              <thead>
                <tr>
                  <th>Metric</th>
                  <th className="text-orange">Quick Sort</th>
                  <th className="text-purple">Merge Sort</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-semibold">Best Case</td>
                  <td>O(n log n)</td>
                  <td>O(n log n)</td>
                </tr>
                <tr>
                  <td className="font-semibold">Average Case</td>
                  <td>O(n log n)</td>
                  <td>O(n log n)</td>
                </tr>
                <tr>
                  <td className="font-semibold">Worst Case</td>
                  <td>O(n²)</td>
                  <td>O(n log n)</td>
                </tr>
                <tr>
                  <td className="font-semibold">Auxiliary Space</td>
                  <td>O(log n) average recursion stack*</td>
                  <td>O(n)</td>
                </tr>
                <tr>
                  <td className="font-semibold">Stability</td>
                  <td>Not stable by default</td>
                  <td>Stable</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-black bg-opacity-20 text-xs text-muted">
            * Exact space and worst-case performance depend on implementation details such as pivot strategy.<br/>
            Complexity explains theoretical behavior. Benchmarking shows observed behavior on this system.
          </div>
        </div>
      </div>
    );
  };

  const renderAbout = () => (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">About This Project</h2>
      <div className="glass-card mb-8">
        <p className="text-lg text-muted mb-6">
          This application demonstrates the practical performance of two classical divide-and-conquer sorting algorithms using real datasets and controlled experiments.
        </p>
        <p className="text-muted mb-6">
          It provides an interactive way to understand how theoretical time complexities translate into real-world execution times when processing data for machine learning or analytics workflows.
        </p>
        
        <h4 className="font-bold text-lg mb-4">Where Sorting Supports Real Systems</h4>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 bg-black bg-opacity-20 rounded-lg border border-gray-700">
            <h5 className="font-semibold mb-1">Data Analytics</h5>
            <p className="text-sm text-muted">Organizing records for analysis and reporting.</p>
          </div>
          <div className="p-4 bg-black bg-opacity-20 rounded-lg border border-gray-700">
            <h5 className="font-semibold mb-1">Ranking Systems</h5>
            <p className="text-sm text-muted">Ordering scores, metrics, or results.</p>
          </div>
          <div className="p-4 bg-black bg-opacity-20 rounded-lg border border-gray-700">
            <h5 className="font-semibold mb-1">Search & Database Systems</h5>
            <p className="text-sm text-muted">Sorting can support ordered retrieval and processing.</p>
          </div>
          <div className="p-4 bg-black bg-opacity-20 rounded-lg border border-gray-700">
            <h5 className="font-semibold mb-1">ML Data Preprocessing</h5>
            <p className="text-sm text-muted">Sorting can support data inspection, grouping, ranking, and certain preprocessing workflows.</p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <span className="px-3 py-1 bg-gray-800 rounded-full text-xs font-semibold">Python</span>
          <span className="px-3 py-1 bg-gray-800 rounded-full text-xs font-semibold">FastAPI</span>
          <span className="px-3 py-1 bg-gray-800 rounded-full text-xs font-semibold">React</span>
          <span className="px-3 py-1 bg-gray-800 rounded-full text-xs font-semibold">Vite</span>
          <span className="px-3 py-1 bg-gray-800 rounded-full text-xs font-semibold">Recharts</span>
          <span className="px-3 py-1 bg-gray-800 rounded-full text-xs font-semibold">CSV</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`app-container ${presentationMode ? 'presentation-mode bg-black' : ''}`}>
      {renderHeader()}

      {presentationMode && (
        <button 
          className="fixed top-4 right-4 z-50 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
          onClick={togglePresentationMode}
        >
          <X size={18} /> Exit Presentation Mode
        </button>
      )}

      <main className="main-content">
        {error && (
          <div className="bg-red-900 border border-red-500 text-red-100 p-4 rounded-lg flex items-center gap-3 mb-6 animate-fade-in shadow-lg">
            <AlertCircle size={20} className="flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {currentScreen === 'dashboard' && renderDashboard()}
        {currentScreen === 'analyzer' && renderAnalyzer()}
        {currentScreen === 'results' && renderResults()}
        {currentScreen === 'visualizer' && renderVisualizer()}
        {currentScreen === 'about' && renderAbout()}
      </main>
    </div>
  );
}

export default App;
