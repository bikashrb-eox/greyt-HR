import React, { useState, useEffect } from "react";
import "./Home.css";

export default function Home() {
  const [signedIn, setSignedIn] = useState(false);
  const [hours, setHours] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [location, setLocation] = useState("Office - Bangalore");
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );

  useEffect(() => {
    let interval;

    if (signedIn) {
      interval = setInterval(() => {
        const diff = new Date() - startTime;
        setHours((diff / 3600000).toFixed(2));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [signedIn, startTime]);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  const handleSign = () => {
    if (!signedIn) {
      setStartTime(new Date());
      setSignedIn(true);
    } else {
      setSignedIn(false);
    }
  };

  return (
    <div className="app-layout">
      <div className="content-area">
        <div className="page-body">
          <div className="home-navbar">
            <h2>Dashboard</h2>
          </div>

          <div className="hero">
            <h1>Welcome Back!</h1>
            <p>Manage your work life smarter with greytHR</p>
          </div>

          <div className="dashboard-grid">
            {/* Attendance Card - Final Layout */}
            {/* Attendance Card - Aligned Layout */}
            <div className="dashboard-card attendance-card">
              {/* ROW 1 - HEADER */}
              <div className="card-header">
                <div className="card-title">
                  <i className="fa-solid fa-user-check card-icon"></i>
                  <h3>Attendance Sign In</h3>
                </div>

                <div className="card-actions">
                  <button className="action-btn">View</button>
                </div>
              </div>

              {/* ROW 2 - LOCATION SELECT */}
              <div className="modern-select-wrapper">
                <i className="fa-solid fa-location-dot select-icon"></i>

                <select
                  className="modern-select"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option>Office - Bangalore</option>
                  <option>Office - Mumbai</option>
                  <option>Work From Home</option>
                </select>
              </div>

              {/* ROW 3 - TIME INFO (LEFT & RIGHT) */}
              <div className="attendance-time-row">
                <div className="time-box">
                  <span className="time-label">
                    <i className="fa-solid fa-clock"></i> Current Time
                  </span>
                  <span className="time-value">{currentTime}</span>
                </div>

                <div className="worked-hours-box">
                  <span className="time-label">
                    {" "}
                    <i className="fa-solid fa-hourglass-half"></i> Worked Hours
                  </span>
                  <span className="time-value">
                    {signedIn ? hours : "0.00"} hrs
                  </span>
                </div>
              </div>

              {/* ROW 4 - GRAPH LEFT & BUTTON RIGHT */}
              <div className="attendance-action-row">
                <div className="graph-box">
                  {/* <h4>Activity Graph</h4> */}
                  <div className="mini-chart animated-chart large-chart">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="chart-bar animated-bar"></div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSign}
                  className={`btn modern-sign-btn ${
                    signedIn ? "btn-danger" : "btn-success"
                  }`}
                >
                  <i className="fa-solid fa-power-off"></i>
                  {signedIn ? "Sign Out" : "Sign In"}
                </button>
              </div>
            </div>

            {/* Payslip Card - Modern Layout */}
            <div className="dashboard-card payslip-card">
              {/* HEADER - Title + Details */}
              <div className="card-header">
                <div className="card-title">
                  <i className="fa-solid fa-wallet card-icon"></i>
                  <h3>Payslip Dashboard</h3>
                </div>

                <div className="card-actions">
                  <button className="action-btn">Details</button>
                </div>
              </div>

              {/* SALARY INFO + DONUT CHART */}
              <div className="card-content-wrapper">
                {/* LEFT SIDE - Salary Info + Mini Graph */}
                <div className="card-left">
                  <div className="salary-info">
                    <p>Gross Pay: ₹ 75,000</p>
                    <p>Deductions: ₹ 8,000</p>
                    <p>Net Pay: ₹ 67,000</p>
                  </div>

                  <div className="mini-chart-wrapper">
                   <div className="mini-chart animated-chart large-chart">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="chart-bar animated-bar"></div>
                    ))}
                  </div>
                  </div>
                </div>

                {/* RIGHT SIDE - Donut Chart + Download Button */}
                <div className="card-right">
                  <div className="donut-chart-wrapper">
                    <div className="donut-chart"></div>
                    <div className="chart-legend">
                      <div className="legend-item" title="Income"></div>
                      <div className="legend-item" title="Tax"></div>
                      <div className="legend-item" title="Other"></div>
                    </div>
                  </div>

                  <button className="btn modern-download-btn">
                    <i className="fa-solid fa-download"></i> Download
                  </button>
                </div>
              </div>
            </div>
{/* Quick Access Card */}
<div className="dashboard-card quickaccess-card">

  {/* HEADER - Title + Open button */}
  <div className="card-header">
    <div className="card-title">
      <i className="fa-solid fa-bolt card-icon"></i>
      <h3>Quick Access</h3>
    </div>

    <div className="card-actions">
      <button className="action-btn">Open</button>
    </div>
  </div>

  {/* MAIN CONTENT */}
  <div className="quickaccess-wrapper">

    {/* LEFT SIDE - List of actions */}
    <div className="quickaccess-left">
      <p>
        <i className="fa-solid fa-calendar-check"></i> Apply Leave
      </p>
      <p>
        <i className="fa-solid fa-clock"></i> View Attendance
      </p>
      <p>
        <i className="fa-solid fa-headset"></i> Raise Helpdesk Ticket
      </p>
    </div>

    {/* RIGHT SIDE - Chart / placeholder */}
  <div className="quickaccess-right">
  <div className="leave-stats-chart">
    {[ 
      { label: "Pending", value: 3, color: "#f59e0b" },
      { label: "Taken", value: 5, color: "#ef4444" },
      { label: "Balance", value: 7, color: "#22c55e" }
    ].map((item, index) => (
      <div key={index} className="leave-bar-wrapper">
        <div
          className="leave-bar"
          style={{ height: `${item.value * 12}px`, background: item.color }}
          title={`${item.label}: ${item.value}`} // shows info on hover
        ></div>
        <span className="leave-label">{item.label}</span>
      </div>
    ))}
  </div>
</div>


  </div>

  {/* BOTTOM ROW - Mini Chart + Go To Portal Button */}
  <div className="quickaccess-bottom">
    <div className="mini-chart animated-chart large-chart">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="chart-bar animated-bar"></div>
      ))}
    </div>

    <button className="btn go-to-Portal">
      <i className="fa-solid fa-arrow-right"></i> Go to Portal
    </button>
  </div>
</div>

            {/* Upcoming Holidays Card */}
            <div className="dashboard-card holiday-card">

  {/* HEADER */}
  <div className="card-header">
    <div className="card-title">
      <i className="fa-solid fa-calendar-days card-icon"></i>
      <h3>Upcoming Holidays</h3>
    </div>

    <div className="card-actions">
      <button className="action-btn">View All</button>
    </div>
  </div>

  {/* MAIN CONTENT ROW */}
  <div className="holiday-wrapper">

    {/* LEFT - LIST OF HOLIDAYS */}
    <div className="holiday-left">
      <p>
        <i className="fa-solid fa-flag"></i>
        Republic Day – 26 Jan
      </p>

      <p>
        <i className="fa-solid fa-palette"></i>
        Holi – 25 Mar
      </p>

      <p>
        <i className="fa-solid fa-star"></i>
        Independence Day – 15 Aug
      </p>
    </div>

    {/* RIGHT - IMAGE OF FIRST HOLIDAY */}
    <div className="holiday-right">
      <div className="holiday-image-box">
        <img
          src="https://wallpapercave.com/wp/wp5324209.jpg"
          alt="Upcoming Holiday"
        />
        <span className="holiday-caption">Republic Day</span>
      </div>
    </div>

  </div>

  {/* BOTTOM ROW */}
  <div className="holiday-bottom">

    {/* LEFT - MINI GRAPH */}
    <div className="mini-chart animated-chart large-chart">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="chart-bar animated-bar"></div>
      ))}
    </div>

    {/* RIGHT - BUTTON */}
    <button className="btn go-to-Portal">
      <i className="fa-solid fa-arrow-right"></i>
      Open All
    </button>

  </div>

</div>

          </div>
        </div>
      </div>
    </div>
  );
}
