import React, { useState, useMemo } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // OPTIMIZATION: Prevent heavy mapping on every single state rerender
  const chartData = useMemo(() => {
    if (!result?.missing_values) return [];
    return Object.entries(result.missing_values).map(([column, count]) => ({
      column,
      count,
    }));
  }, [result]);

  const uploadFile = async () => {
    if (!file) {
      setError("Please select a CSV file first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("https://cleaniq-hlz3.onrender.com/upload", formData);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Upload failed. Please check your backend connection.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="hero">
        <h1 className="logo">CleanIQ</h1>

        <div className="upload-section">
          {/* FIX: Set value to clear input field programmatically if needed */}
          <input
            type="file"
            accept=".csv"
            onChange={(e) => {
              setFile(e.target.files[0] || null);
              setError(null);
            }}
          />
          <br /><br />
          <button onClick={uploadFile} disabled={isLoading}>
            {isLoading ? "Processing..." : "Upload CSV"}
          </button>
          
          <div className="tagline" style={{ marginTop: "15px", color: "#666", fontSize: "0.9rem" }}>
            <p className="subtitle">✨ AI Powered Data Cleaning Platform ✨</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message" style={{ color: "red", marginTop: "10px" }}>
            <b>Error:</b> {error}
          </div>
        )}

        {result && (
          <div className="result-card">
            <div className="score-card">
              <h2>Data Quality Score</h2>
              <h1>{result.quality_score}%</h1>
            </div>

            <div className="comparison-card">
              <h2>📊 Before vs After Cleaning</h2>
              <p>Duplicate Rows: <b>{result.before_duplicates ?? 0}</b> ➜ <b>{result.after_duplicates ?? 0}</b></p>
              <p>Missing Values: <b>{result.before_missing ?? 0}</b> ➜ <b>{result.after_missing ?? 0}</b></p>
            </div>

            <div className="success-card">
              <h3>Cleaning Summary</h3>
              <p>✅ {result.duplicate_rows ?? 0} duplicate rows detected</p>
              <p>✅ {result.fixed_missing ?? 0} missing values fixed</p>
              <p>✅ Dataset cleaned successfully</p>
            </div>

            {/* FIX: Handled scenario if suggestions list is completely empty or undefined */}
            {result.suggestions && result.suggestions.length > 0 && (
              <>
                <h3>🤖 AI Suggestions</h3>
                <ul>
                  {result.suggestions.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </>
            )}

            <h2>Metadata Summary</h2>
            <p><b>Filename:</b> {result.filename}</p>
            <p><b>Rows:</b> {result.rows}</p>
            <p><b>Columns:</b> {result.columns}</p>
            <p><b>Duplicate Rows Found:</b> {result.duplicate_rows}</p>

            <div className="chart-card">
              <h2>📊 Missing Values Chart</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="column" stroke="#888888" />
                  <YAxis stroke="#888888" />
                  <Tooltip cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
                  {/* FIX: Added fill color so bars are visually rendered on the frontend UI */}
                  <Bar dataKey="count" fill="#F44336" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <h3>Missing Values Details</h3>
            <ul>
              {Object.entries(result.missing_values || {}).map(([column, count]) => (
                <li key={column}>
                  {column}: {count}
                </li>
              ))}
            </ul>

            <h3>Preview</h3>
            <div className="table-wrapper">
              <table border="1">
                <thead>
                  <tr>
                    {result.preview && result.preview.length > 0 &&
                      Object.keys(result.preview[0]).map((column) => (
                        <th key={column}>{column}</th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {result.preview?.map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value, i) => (
                        <td key={i}>{value !== null && value !== undefined ? String(value) : ""}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3>Data Types</h3>
            <ul>
              {Object.entries(result.data_types || {}).map(([column, type]) => (
                <li key={column}>
                  {column}: {type}
                </li>
              ))}
            </ul>

            <h3>Download Cleaned CSV</h3>
            {/* SECURITY/STABILITY FIX: Replaced risky hardcoded <a> tags with explicit tokenized clicks */}
            <button 
              className="download-btn"
              onClick={() => {
                window.open(`http://127.0.0.1:8000/download/${result.download_file}`, "_blank");
              }}
            >
              Download Cleaned CSV
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
