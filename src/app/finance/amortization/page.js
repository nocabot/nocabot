"use client";

import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { AuroraText } from "../../../components/ui/AuroraText";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function AmortizationPage() {
  // Form inputs
  const [homePrice, setHomePrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [termYears, setTermYears] = useState("");
  const [annualRate, setAnnualRate] = useState("");

  // Results
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [chartData, setChartData] = useState(null);

  const [errorMsg, setErrorMsg] = useState(null);

  // Helper: format money input
  const formatMoneyInput = (setter) => (e) => {
    let raw = e.target.value.replace(/[^\d.]/g, "");
    if (!raw) {
      setter("");
      return;
    }
    const parts = raw.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setter(parts.join("."));
  };

  // Helper: format percent input
  const formatPercentInput = (setter) => (e) => {
    let raw = e.target.value.replace(/[^\d.]/g, "");
    if (!raw) raw = "";
    setter(raw);
  };

  const handleCalculate = () => {
    setErrorMsg(null);
    setMonthlyPayment(null);
    setChartData(null);

    // parse
    const hp = parseFloat(homePrice.replace(/,/g, "")) || 0;
    const dp = parseFloat(downPayment.replace(/,/g, "")) || 0;
    const loanYrs = parseInt(termYears, 10) || 0;
    const rate = parseFloat(annualRate) || 0;

    if (hp <= 0 || loanYrs <= 0 || rate < 0) {
      setErrorMsg("Please enter valid numbers for home price, term, and interest rate.");
      return;
    }
    if (dp < 0) {
      setErrorMsg("Down payment can't be negative.");
      return;
    }
    if (dp >= hp) {
      setErrorMsg("Down payment must be less than home price.");
      return;
    }

    const loanAmount = hp - dp;
    const monthlyRate = rate / 100 / 12;
    const totalMonths = loanYrs * 12;

    // standard mortgage formula
    let payment = 0;
    if (monthlyRate === 0) {
      // no interest corner case
      payment = loanAmount / totalMonths;
    } else {
      payment =
        (loanAmount * monthlyRate) /
        (1 - Math.pow(1 + monthlyRate, -totalMonths));
    }

    setMonthlyPayment(payment);

    // Build arrays for monthly principal/interest, plus cumulative
    let balance = loanAmount;
    let cumulativePrincipal = 0;
    let cumulativeInterest = 0;

    const xLabels = [];
    const monthlyPrincipalArr = [];
    const monthlyInterestArr = [];
    const cumPrincipalArr = [];
    const cumInterestArr = [];

    for (let m = 1; m <= totalMonths; m++) {
      // interest portion
      const interestPortion = balance * monthlyRate;
      // principal portion
      const principalPortion = payment - interestPortion;
      if (principalPortion < 0) {
        // in case floating calc leads to negativity at end
        balance = 0;
        break;
      }

      // update accumulators
      cumulativePrincipal += principalPortion;
      cumulativeInterest += interestPortion;

      // push monthly data
      monthlyPrincipalArr.push(principalPortion);
      monthlyInterestArr.push(interestPortion);
      cumPrincipalArr.push(cumulativePrincipal);
      cumInterestArr.push(cumulativeInterest);

      // reduce balance
      balance -= principalPortion;
      if (balance < 0) balance = 0;

      // label for x-axis
      // We'll show "Year X" at each multiple of 12, else empty
      const isMultipleOf12 = (m % 12 === 0);
      const yearIndex = Math.floor((m - 1) / 12) + 1;
      xLabels.push(isMultipleOf12 ? `Year ${yearIndex}` : "");
    }

    // build chart data with 4 lines
    const newChartData = {
      labels: xLabels,
      datasets: [
        {
          label: "Monthly Principal",
          data: monthlyPrincipalArr,
          borderColor: "#34d399", // green
          backgroundColor: "rgba(52,211,153,0.1)",
          pointRadius: 2,
          yAxisID: "y",
        },
        {
          label: "Monthly Interest",
          data: monthlyInterestArr,
          borderColor: "#f87171", // red
          backgroundColor: "rgba(248,113,113,0.1)",
          pointRadius: 2,
          yAxisID: "y",
        },
        {
          label: "Cumulative Principal",
          data: cumPrincipalArr,
          borderColor: "#3b82f6", // blue
          backgroundColor: "rgba(59,130,246,0.1)",
          pointRadius: 2,
          yAxisID: "y1", // separate scale if desired
        },
        {
          label: "Cumulative Interest",
          data: cumInterestArr,
          borderColor: "#eab308", // yellow
          backgroundColor: "rgba(234,179,8,0.1)",
          pointRadius: 2,
          yAxisID: "y1",
        },
      ],
    };

    setChartData(newChartData);
  };

  const handleClear = () => {
    setHomePrice("");
    setDownPayment("");
    setTermYears("");
    setAnnualRate("");
    setMonthlyPayment(null);
    setChartData(null);
    setErrorMsg(null);
  };

  return (
    <div
      className="
        mx-auto mt-10 mb-10 w-full
        sm:w-[95%] md:w-[85%]
        bg-white dark:bg-gray-800
        p-12
        rounded-md shadow
        font-sans
      "
    >
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
        Amortization Calculator
      </h1>
      <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
        Track monthly principal &amp; interest, plus cumulative totals. 
      </p>

      {errorMsg && (
        <div className="mt-4 text-center text-sm text-red-600 dark:text-red-400">
          {errorMsg}
        </div>
      )}

      {/* FORM */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Home Price */}
        <div className="flex flex-col text-sm text-gray-700 dark:text-gray-200 relative">
          <label className="font-medium">Home Price:</label>
          <div className="mt-1 relative">
            <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="text"
              value={homePrice}
              onChange={formatMoneyInput(setHomePrice)}
              className="pl-7 w-full rounded-md border border-gray-300 dark:border-gray-600
                bg-white dark:bg-gray-700 px-2 py-1 shadow-sm"
              placeholder="300,000"
            />
          </div>
        </div>

        {/* Down Payment */}
        <div className="flex flex-col text-sm text-gray-700 dark:text-gray-200 relative">
          <label className="font-medium">Down Payment:</label>
          <div className="mt-1 relative">
            <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="text"
              value={downPayment}
              onChange={formatMoneyInput(setDownPayment)}
              className="pl-7 w-full rounded-md border border-gray-300 dark:border-gray-600
                bg-white dark:bg-gray-700 px-2 py-1 shadow-sm"
              placeholder="60,000"
            />
          </div>
        </div>

        {/* Term in Years */}
        <div className="flex flex-col text-sm text-gray-700 dark:text-gray-200">
          <label className="font-medium">Term (Years):</label>
          <input
            type="number"
            value={termYears}
            onChange={(e) => setTermYears(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600
              bg-white dark:bg-gray-700 px-2 py-1 shadow-sm"
            placeholder="30"
          />
        </div>

        {/* Interest Rate */}
        <div className="flex flex-col text-sm text-gray-700 dark:text-gray-200 relative">
          <label className="font-medium">Annual Interest Rate:</label>
          <div className="mt-1 relative">
            <input
              type="text"
              value={annualRate}
              onChange={formatPercentInput(setAnnualRate)}
              className="pr-7 w-full rounded-md border border-gray-300 dark:border-gray-600
                bg-white dark:bg-gray-700 px-2 py-1 shadow-sm"
              placeholder="4"
            />
            <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">%</span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={handleCalculate}
          className="
            rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white
            hover:bg-indigo-500
          "
        >
          Calculate
        </button>
        <button
          onClick={handleClear}
          className="
            rounded-md bg-gray-300 dark:bg-gray-700 px-6 py-2 text-sm font-semibold
            text-gray-800 dark:text-gray-200
            hover:bg-gray-400 dark:hover:bg-gray-600
          "
        >
          Clear
        </button>
      </div>

      {/* Monthly Payment */}
      {monthlyPayment !== null && (
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">Monthly Payment:</p>
          <AuroraText className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            ${monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </AuroraText>
        </div>
      )}

      {/* Chart with 4 lines */}
      {chartData && (
        <div className="mt-8 w-full" style={{ minHeight: "450px" }}>
          <div className="relative h-[450px] w-full">
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
                      callback: (val) => "$" + val.toFixed(0),
                    },
                  },
                  y1: {
                    beginAtZero: false,
                    position: "right",
                    grid: { drawOnChartArea: false },
                    ticks: {
                      callback: (val) => "$" + val.toFixed(0),
                    },
                  },
                  x: {
                    // We'll have xLabels for each month, but many are empty
                    // so we rely on the user hovering to see actual monthly data
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