"use client";

import React, { useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import { AuroraText } from "../../../components/ui/AuroraText";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function CompoundInterestPage() {
  // Form inputs
  const [principal, setPrincipal] = useState("");
  const [annualAdd, setAnnualAdd] = useState("");
  const [years, setYears] = useState("");
  const [rate, setRate] = useState("");
  const [times, setTimes] = useState(""); // number of contributions per year
  const [addAtStart, setAddAtStart] = useState(true); // radio

  const [futureValue, setFutureValue] = useState(null);
  const [chartData, setChartData] = useState(null);

  // Validate numeric input
  const handleNumericChange = (setter) => (e) => {
    const val = e.target.value.replace(/[^\d.]/g, ""); // keep only digits & dot
    setter(val);
  };

  const handleCalculate = () => {
    const p = parseFloat(principal) || 0;
    const a = parseFloat(annualAdd) || 0;
    const y = parseInt(years) || 0;
    const r = parseFloat(rate) || 0;
    const c = parseInt(times) || 0;

    if (y <= 0 || r < 0 || c <= 0) {
      alert("Please enter valid numbers (years > 0, rate >= 0, contributions >= 1).");
      return;
    }

    let current = p;
    const labels = [];
    const balances = [];

    for (let year = 0; year <= y; year++) {
      // record at start of year
      labels.push(`Year ${year}`);
      balances.push(current);

      if (year === y) break;

      // c times per year
      for (let i = 0; i < c; i++) {
        if (addAtStart) {
          current += a;
        }
        // interest portion
        current *= 1 + (r / 100) / c;

        if (!addAtStart) {
          current += a;
        }
      }
    }

    setFutureValue(Math.round(current * 100) / 100);

    setChartData({
      labels,
      datasets: [
        {
          label: "Balance Over Time",
          data: balances,
          borderColor: "#4f46e5", // Indigo-600
          backgroundColor: "rgba(79,70,229,0.1)",
          pointRadius: 3,
        },
      ],
    });
  };

  const handleClear = () => {
    setPrincipal("");
    setAnnualAdd("");
    setYears("");
    setRate("");
    setTimes("");
    setAddAtStart(true);
    setFutureValue(null);
    setChartData(null);
  };

  return (
    <div className="mx-auto mt-10 mb-10 w-full sm:w-[95%] md:w-[85%] bg-white dark:bg-gray-800 p-12 rounded-md shadow font-sans">
      {/* Title & subtitle */}
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
        Compound Interest
      </h1>
      <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
        Calculate your future value with regular contributions and compounding.  
      </p>

      {/* FORM */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Principal */}
        <div className="flex flex-col text-sm text-gray-700 dark:text-gray-200 relative">
          <label className="font-medium">Current Principal:</label>
          <div className="mt-1 relative">
            <span className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500">$</span>
            <input
              type="text"
              value={principal}
              onChange={handleNumericChange(setPrincipal)}
              className="pl-7 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1 shadow-sm"
              placeholder="10000"
            />
          </div>
        </div>

        {/* Annual Addition */}
        <div className="flex flex-col text-sm text-gray-700 dark:text-gray-200 relative">
          <label className="font-medium">Annual Addition:</label>
          <div className="mt-1 relative">
            <span className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500">$</span>
            <input
              type="text"
              value={annualAdd}
              onChange={handleNumericChange(setAnnualAdd)}
              className="pl-7 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1 shadow-sm"
              placeholder="5000"
            />
          </div>
        </div>

        {/* Years */}
        <div className="flex flex-col text-sm text-gray-700 dark:text-gray-200">
          <label className="font-medium">Years to Grow:</label>
          <input
            type="text"
            value={years}
            onChange={handleNumericChange(setYears)}
            className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1 shadow-sm"
            placeholder="30"
          />
        </div>

        {/* Interest Rate */}
        <div className="flex flex-col text-sm text-gray-700 dark:text-gray-200 relative">
          <label className="font-medium">Interest Rate (%):</label>
          <div className="mt-1 relative">
            <span className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500">%</span>
            <input
              type="text"
              value={rate}
              onChange={handleNumericChange(setRate)}
              className="pl-7 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1 shadow-sm"
              placeholder="7"
            />
          </div>
        </div>

        {/* Number of contributions per year */}
        <div className="flex flex-col text-sm text-gray-700 dark:text-gray-200">
          <label className="font-medium">Number of contributions a year:</label>
          <input
            type="text"
            value={times}
            onChange={handleNumericChange(setTimes)}
            className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1 shadow-sm"
            placeholder="1"
          />
        </div>

        {/* Additions at start/end, prettified */}
        <div className="flex flex-col text-sm text-gray-700 dark:text-gray-200">
          <label className="font-medium mb-1">Make additions at:</label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setAddAtStart(true)}
              className={`
                px-4 py-1 rounded-md
                ${
                  addAtStart
                    ? "bg-indigo-600 text-white font-semibold"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-500"
                }
              `}
            >
              Start
            </button>
            <button
              onClick={() => setAddAtStart(false)}
              className={`
                px-4 py-1 rounded-md
                ${
                  !addAtStart
                    ? "bg-indigo-600 text-white font-semibold"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-500"
                }
              `}
            >
              End
            </button>
          </div>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={handleCalculate}
          className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Calculate
        </button>
        <button
          onClick={handleClear}
          className="rounded-md bg-gray-300 dark:bg-gray-700 px-6 py-2 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600"
        >
          Clear
        </button>
      </div>

      {/* RESULT */}
      {futureValue !== null && (
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">Future Value:</p>
          <AuroraText className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            ${futureValue.toLocaleString()}
          </AuroraText>
        </div>
      )}

      {/* CHART: fully responsive with dynamic resizing */}
      {chartData && (
        <div className="mt-8 w-full" style={{ minHeight: "400px" }}>
          <div className="relative h-[400px] w-full">
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                  mode: "index",
                  intersect: false,
                },
                plugins: {
                  legend: { display: true },
                  tooltip: { mode: "index", intersect: false },
                },
                scales: {
                  y: {
                    beginAtZero: false,
                    ticks: {
                      callback: (val) => "$" + val,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}