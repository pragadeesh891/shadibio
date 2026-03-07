import React, { useState, useEffect } from 'react';
import '../styles/horoscope-match.css';

// Kootas definitions
const KOOTAS = [
    { name: 'Varna', max: 1, desc: 'Work compatibility' },
    { name: 'Vashya', max: 2, desc: 'Dominance compatibility' },
    { name: 'Tara', max: 3, desc: 'Destiny compatibility' },
    { name: 'Yoni', max: 4, desc: 'Intimacy compatibility' },
    { name: 'Graha Maitri', max: 5, desc: 'Mental compatibility' },
    { name: 'Gana', max: 6, desc: 'Temperament compatibility' },
    { name: 'Bhakoot', max: 7, desc: 'Love & Health compatibility' },
    { name: 'Nadi', max: 8, desc: 'Genetic compatibility' }
];

// Pseudo-random number generator string hash
const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
};

// Seeded random
const seededRandom = (target, min, max) => {
    const x = Math.sin(target++) * 10000;
    const rand = x - Math.floor(x);
    return Math.floor(rand * (max - min + 1)) + min;
};

const HoroscopeMatchPage = () => {
    const [boyName, setBoyName] = useState('');
    const [boyDob, setBoyDob] = useState('');
    const [girlName, setGirlName] = useState('');
    const [girlDob, setGirlDob] = useState('');

    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [progress, setProgress] = useState(0);

    // Calculate Match!
    const handleCalculate = (e) => {
        e.preventDefault();
        setLoading(true);
        setResults(null);
        setProgress(0);

        // Simulate network delay for dramatic effect
        setTimeout(() => {
            const combinedString = `${boyName.toLowerCase().trim()}${boyDob}${girlName.toLowerCase().trim()}${girlDob}`;
            const seed = hashString(combinedString);

            // Generate scores for each koota predictably
            let total = 0;
            const kootaScores = KOOTAS.map((k, index) => {
                // Skew slightly towards higher scores for better UX, but keep it random
                const baseProb = seededRandom(seed + index, 0, 100);
                let score = 0;

                if (baseProb > 80) score = k.max; // Perfect
                else if (baseProb > 40) score = Math.max(0, k.max - Math.ceil(k.max * 0.3)); // High
                else if (baseProb > 15) score = Math.max(0, k.max - Math.ceil(k.max * 0.6)); // Low
                else score = 0; // Poor

                total += score;
                return { ...k, score };
            });

            // If total is too low artificially bump it (nobody wants 2/36)
            if (total < 12) total += 8;
            if (total > 36) total = 36;

            let verdict = '';
            let verdictType = '';
            let verdictDesc = '';

            if (total >= 28) { verdict = 'Excellent Match'; verdictType = 'excellent'; verdictDesc = 'Highly recommended for marriage!'; }
            else if (total >= 22) { verdict = 'Good Match'; verdictType = 'good'; verdictDesc = 'A favorable match with good harmony.'; }
            else if (total >= 18) { verdict = 'Average Match'; verdictType = 'average'; verdictDesc = 'Workable match, but needs effort.'; }
            else { verdict = 'Poor Match'; verdictType = 'poor'; verdictDesc = 'Astrologically challenging match.'; }

            setResults({
                totalScore: total,
                kootas: kootaScores,
                verdict,
                verdictType,
                verdictDesc
            });

            setLoading(false);
        }, 2000);
    };

    // Animate circular progress when results arrive
    useEffect(() => {
        if (results) {
            let start = 0;
            const target = results.totalScore;
            // 36 total max, progress is 0 to 100
            const maxPercent = (target / 36) * 100;

            const interval = setInterval(() => {
                start += 2;
                if (start >= maxPercent) {
                    setProgress(maxPercent);
                    clearInterval(interval);
                } else {
                    setProgress(start);
                }
            }, 30);
            return () => clearInterval(interval);
        }
    }, [results]);

    return (
        <div className="horoscope-container">
            <div className="stars-bg"></div>

            <div className="horoscope-content">
                <header className="hm-header">
                    <h1 className="hm-title">Kundli Matching</h1>
                    <p className="hm-subtitle">Discover the cosmic compatibility of two souls.</p>
                </header>

                <form onSubmit={handleCalculate}>
                    <div className="hm-input-grid">
                        {/* Groom Card */}
                        <div className="hm-input-card boy-card">
                            <h2 className="hm-card-title">🙎‍♂️ Groom's Details</h2>
                            <div className="hm-form-group">
                                <label className="hm-label">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="hm-input"
                                    placeholder="Enter Groom's Name"
                                    value={boyName}
                                    onChange={(e) => setBoyName(e.target.value)}
                                />
                            </div>
                            <div className="hm-form-group">
                                <label className="hm-label">Date of Birth</label>
                                <input
                                    type="date"
                                    required
                                    className="hm-input"
                                    value={boyDob}
                                    onChange={(e) => setBoyDob(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Bride Card */}
                        <div className="hm-input-card girl-card">
                            <h2 className="hm-card-title">🙎‍♀️ Bride's Details</h2>
                            <div className="hm-form-group">
                                <label className="hm-label">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="hm-input"
                                    placeholder="Enter Bride's Name"
                                    value={girlName}
                                    onChange={(e) => setGirlName(e.target.value)}
                                />
                            </div>
                            <div className="hm-form-group">
                                <label className="hm-label">Date of Birth</label>
                                <input
                                    type="date"
                                    required
                                    className="hm-input"
                                    value={girlDob}
                                    onChange={(e) => setGirlDob(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="hm-action-wrap">
                        <button type="submit" className="hm-btn" disabled={loading}>
                            {loading ? 'Consulting Stars...' : 'Match Horoscope ✨'}
                        </button>
                    </div>
                </form>

                {/* Results Section */}
                {results && (
                    <div className="hm-results">
                        <div className="hm-score-board">
                            <div className="hm-flare"></div>

                            <div className="hm-radial-wrap">
                                <svg className="hm-radial-svg" viewBox="0 0 100 100">
                                    <defs>
                                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#ffd700" />
                                            <stop offset="100%" stopColor="#ff007f" />
                                        </linearGradient>
                                    </defs>
                                    <circle className="hm-radial-bg" cx="50" cy="50" r="45" />
                                    <circle
                                        className="hm-radial-progress"
                                        cx="50"
                                        cy="50"
                                        r="45"
                                        strokeDasharray="283"
                                        strokeDashoffset={283 - (283 * progress) / 100}
                                    />
                                </svg>
                                <div className="hm-score-text">
                                    <span className="hm-score-num">{results.totalScore}</span>
                                    <span className="hm-score-total">out of 36</span>
                                </div>
                            </div>

                            <h2 className={`hm-verdict ${results.verdictType}`}>{results.verdict}</h2>
                            <p className="hm-verdict-desc">{results.verdictDesc}</p>
                        </div>

                        <h3 className="hm-kootas-title">Detailed Guna Milan (Ashtakoot)</h3>
                        <div className="hm-kootas-grid">
                            {results.kootas.map((koota, idx) => {
                                const ratio = koota.score / koota.max;
                                let colorClass = 'high';
                                if (ratio < 0.4) colorClass = 'low';
                                else if (ratio < 0.8) colorClass = 'med';

                                return (
                                    <div
                                        key={koota.name}
                                        className={`hm-koota-card ${colorClass}`}
                                        style={{ animationDelay: `${idx * 0.1}s` }}
                                    >
                                        <h4 className="hm-koota-name">{koota.name}</h4>
                                        <p className="hm-koota-desc">{koota.desc}</p>
                                        <div className="hm-koota-score-wrap">
                                            <span className="hm-koota-obtained">{koota.score}</span>
                                            <span className="hm-koota-max">/ {koota.max}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {loading && (
                <div className="hm-loader">
                    <div className="hm-spinner"></div>
                    <div className="hm-loader-text">Analyzing Constellations...</div>
                </div>
            )}
        </div>
    );
};

export default HoroscopeMatchPage;
