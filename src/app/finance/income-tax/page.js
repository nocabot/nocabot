"use client";

import React, { useState } from "react";
import { AuroraText } from "../../../components/ui/AuroraText";

// Approx state rates
const US_STATES = [
  { abbr: "AL", name: "Alabama", rate: 5.0 },
  { abbr: "AK", name: "Alaska", rate: 0.0 },
  { abbr: "AZ", name: "Arizona", rate: 4.5 },
  // ... keep the rest ...
  { abbr: "WY", name: "Wyoming", rate: 0.0 },
  { abbr: "DC", name: "District of Columbia", rate: 8.95 },
];

// Standard Deductions (2025)
function getStandardDeduction(filingStatus) {
  switch (filingStatus) {
    case "single":
      return 15000;
    case "married":
      return 30000; // married filing jointly
    case "mfs":
      return 15000; // married filing separately
    case "hoh":
      return 22500; // head of household
    default:
      return 15000;
  }
}

// Federal 2025 brackets
const FEDERAL_2025 = {
  single: [
    { upTo: 11925, rate: 0.1 },
    { upTo: 48475, rate: 0.12 },
    { upTo: 103350, rate: 0.22 },
    { upTo: 197300, rate: 0.24 },
    { upTo: 250525, rate: 0.32 },
    { upTo: 626350, rate: 0.35 },
    { upTo: Infinity, rate: 0.37 },
  ],
  married: [
    { upTo: 23850, rate: 0.1 },
    { upTo: 96950, rate: 0.12 },
    { upTo: 206700, rate: 0.22 },
    { upTo: 394600, rate: 0.24 },
    { upTo: 501050, rate: 0.32 },
    { upTo: 751600, rate: 0.35 },
    { upTo: Infinity, rate: 0.37 },
  ],
  mfs: [
    { upTo: 11925, rate: 0.1 },
    { upTo: 48475, rate: 0.12 },
    { upTo: 103350, rate: 0.22 },
    { upTo: 197300, rate: 0.24 },
    { upTo: 250525, rate: 0.32 },
    { upTo: 375800, rate: 0.35 },
    { upTo: Infinity, rate: 0.37 },
  ],
  hoh: [
    { upTo: 17000, rate: 0.1 },
    { upTo: 64850, rate: 0.12 },
    { upTo: 103350, rate: 0.22 },
    { upTo: 197300, rate: 0.24 },
    { upTo: 250500, rate: 0.32 },
    { upTo: 626350, rate: 0.35 },
    { upTo: Infinity, rate: 0.37 },
  ],
};

function computeFedTax(taxable, status) {
  const brackets = FEDERAL_2025[status] || FEDERAL_2025.single;
  let tax = 0;
  let remainder = taxable;
  let lower = 0;

  for (const { upTo, rate } of brackets) {
    if (remainder <= 0) break;
    const chunk = Math.min(remainder, upTo - lower);
    tax += chunk * rate;
    remainder -= chunk;
    lower = upTo;
    if (upTo === Infinity) break;
  }
  return tax;
}

function commaFormat(num) {
  return num.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export default function IncomeTaxPage() {
  const [income, setIncome] = useState("");
  const [filingStatus, setFilingStatus] = useState("single");
  const [stateAbbr, setStateAbbr] = useState("");
  const [localRate, setLocalRate] = useState("0");

  // Show/hide advanced deductions
  const [showDeductions, setShowDeductions] = useState(false);
  const [ded401k, setDed401k] = useState("");
  const [dedHsa, setDedHsa] = useState("");
  const [dedOther, setDedOther] = useState("");

  const [results, setResults] = useState(null);

  // Format typed money
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

  // For local % input
  const formatPercentInput = (e) => {
    let raw = e.target.value.replace(/[^\d.]/g, "");
    if (!raw) raw = "";
    setLocalRate(raw);
  };

  const handleCalculate = () => {
    // If required fields not filled, do nothing
    if (!income || !stateAbbr) return;

    const incVal = parseFloat(income.replace(/,/g, "")) || 0;
    const locVal = parseFloat(localRate.replace(/,/g, "")) || 0;

    // sum advanced ded
    const adv =
      (parseFloat(ded401k.replace(/,/g, "")) || 0) +
      (parseFloat(dedHsa.replace(/,/g, "")) || 0) +
      (parseFloat(dedOther.replace(/,/g, "")) || 0);

    const stdDed = getStandardDeduction(filingStatus);
    const totalDeductions = stdDed + adv;

    const taxable = Math.max(incVal - totalDeductions, 0);

    // Fed
    const fedTax = computeFedTax(taxable, filingStatus);
    // average fed rate
    let fedAvg = 0;
    if (taxable > 0) fedAvg = (fedTax / taxable) * 100;

    // FICA
    const fica = taxable * 0.0765;

    // State
    const stObj = US_STATES.find((s) => s.abbr === stateAbbr) || { rate: 5.0 };
    const stTax = (taxable * stObj.rate) / 100;

    // local
    const locTax = (taxable * locVal) / 100;

    const totalTax = fedTax + fica + stTax + locTax;
    const net = incVal - totalTax;

    setResults({
      incVal,
      fedTax,
      fedAvg,
      fica,
      stRate: stObj.rate,
      stTax,
      locRate: locVal,
      locTax,
      totalTax,
      net,
    });
  };

  const handleClear = () => {
    setIncome("");
    setFilingStatus("single");
    setStateAbbr("");
    setLocalRate("0");
    setDed401k("");
    setDedHsa("");
    setDedOther("");
    setShowDeductions(false);
    setResults(null);
  };

  // The button is disabled if we have no “income” or no “state”
  const isCalcDisabled = !income || !stateAbbr;

  return (
    <div className="mx-auto mt-10 mb-10 w-full sm:w-[95%] md:w-[85%]
      bg-white dark:bg-gray-800 p-12 rounded-md shadow font-sans"
    >
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
        2025 Income Tax Calculator
      </h1>
      <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
        Uses official 2025 tax brackets &amp; standard deductions, plus approximate state/local rates.
      </p>

      {/* Fields */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Income */}
        <div className="flex flex-col text-sm text-gray-700 dark:text-gray-200 relative">
          <label className="font-medium">Household Income:</label>
          <div className="mt-1 relative">
            <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="text"
              value={income}
              onChange={formatMoneyInput(setIncome)}
              className="pl-7 w-full rounded-md border border-gray-300 dark:border-gray-600
                bg-white dark:bg-gray-700 px-2 py-1 shadow-sm"
              placeholder="50,000"
            />
          </div>
        </div>

        {/* Filing */}
        <div className="flex flex-col text-sm text-gray-700 dark:text-gray-200">
          <label className="font-medium">Filing Status:</label>
          <select
            value={filingStatus}
            onChange={(e) => setFilingStatus(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600
              bg-white dark:bg-gray-700 px-2 py-1 shadow-sm"
          >
            <option value="single">Single</option>
            <option value="married">Married Filing Jointly</option>
            <option value="mfs">Married Filing Separately</option>
            <option value="hoh">Head of Household</option>
          </select>
        </div>

        {/* State */}
        <div className="flex flex-col text-sm text-gray-700 dark:text-gray-200">
          <label className="font-medium">State:</label>
          <select
            value={stateAbbr}
            onChange={(e) => setStateAbbr(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600
              bg-white dark:bg-gray-700 px-2 py-1 shadow-sm"
          >
            <option value="">-- Choose State --</option>
            {US_STATES.map((s) => (
              <option key={s.abbr} value={s.abbr}>
                {s.abbr} - {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Local Rate */}
        <div className="flex flex-col text-sm text-gray-700 dark:text-gray-200">
          <label className="font-medium">Local Tax Rate:</label>
          <small className="text-gray-500 dark:text-gray-400">
            (Often 0% in many places, but enter if you have one)
          </small>
          <div className="mt-1 relative">
            <input
              type="text"
              value={localRate}
              onChange={formatPercentInput}
              className="pr-7 w-full rounded-md border border-gray-300 dark:border-gray-600
                bg-white dark:bg-gray-700 px-2 py-1 shadow-sm"
              placeholder="0"
            />
            <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">%</span>
          </div>
        </div>
      </div>

      {/* Toggle advanced deductions */}
      <div className="mt-4">
        <button
          onClick={() => setShowDeductions((prev) => !prev)}
          className="flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400
            hover:underline"
        >
          <span>{showDeductions ? "Hide" : "Show"} Advanced Deductions</span>
          <span className="text-xs">{showDeductions ? "▲" : "▼"}</span>
        </button>
      </div>
      {showDeductions && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-gray-700 dark:text-gray-200">
          {/* 401k */}
          <div className="relative">
            <label className="font-medium">401k Contribution:</label>
            <div className="mt-1 relative">
              <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="text"
                value={ded401k}
                onChange={formatMoneyInput(setDed401k)}
                className="pl-7 w-full rounded-md border border-gray-300 dark:border-gray-600
                  bg-white dark:bg-gray-700 px-2 py-1 shadow-sm"
                placeholder="6,000"
              />
            </div>
          </div>

          {/* HSA */}
          <div className="relative">
            <label className="font-medium">HSA Contribution:</label>
            <div className="mt-1 relative">
              <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="text"
                value={dedHsa}
                onChange={formatMoneyInput(setDedHsa)}
                className="pl-7 w-full rounded-md border border-gray-300 dark:border-gray-600
                  bg-white dark:bg-gray-700 px-2 py-1 shadow-sm"
                placeholder="3,500"
              />
            </div>
          </div>

          {/* Other */}
          <div className="relative">
            <label className="font-medium">Other Pretax:</label>
            <div className="mt-1 relative">
              <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="text"
                value={dedOther}
                onChange={formatMoneyInput(setDedOther)}
                className="pl-7 w-full rounded-md border border-gray-300 dark:border-gray-600
                  bg-white dark:bg-gray-700 px-2 py-1 shadow-sm"
                placeholder="2,000"
              />
            </div>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={handleCalculate}
          disabled={!income || !stateAbbr} // disable if no income or no state
          className={`
            rounded-md px-6 py-2 text-sm font-semibold text-white
            ${!income || !stateAbbr
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-500"
            }
          `}
        >
          Calculate
        </button>
        <button
          onClick={handleClear}
          className="rounded-md bg-gray-300 dark:bg-gray-700 px-6 py-2 text-sm font-semibold
            text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600"
        >
          Clear
        </button>
      </div>

      {/* RESULTS */}
      {results && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Your Income Taxes Breakdown
          </h2>
          <table className="min-w-full overflow-x-auto border border-gray-200 dark:border-gray-600 text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Tax Type</th>
                <th className="px-4 py-2 text-left">Rate</th>
                <th className="px-4 py-2 text-left">2025 Taxes*</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 dark:text-gray-200">
              {/* Federal row */}
              <tr>
                <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                  Federal
                </td>
                <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                  2025 Brackets (Avg ~ {results.incVal > 0 ? results.fedAvg.toFixed(2) : 0}%)
                </td>
                <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                  ${commaFormat(results.fedTax)}
                </td>
              </tr>

              {/* FICA */}
              <tr>
                <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">FICA</td>
                <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">7.65%</td>
                <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                  ${commaFormat(results.fica)}
                </td>
              </tr>

              {/* State */}
              <tr>
                <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">State</td>
                <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                  {results.stRate.toFixed(2)}%
                </td>
                <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                  ${commaFormat(results.stTax)}
                </td>
              </tr>

              {/* Local */}
              <tr>
                <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">Local</td>
                <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                  {results.locRate.toFixed(2)}%
                </td>
                <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                  ${commaFormat(results.locTax)}
                </td>
              </tr>

              {/* total row */}
              <tr className="font-semibold">
                <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                  Total Income Taxes
                </td>
                <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                  {results.incVal > 0
                    ? ((results.totalTax / results.incVal) * 100).toFixed(2)
                    : "0"
                  }%
                </td>
                <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                  ${commaFormat(results.totalTax)}
                </td>
              </tr>

              {/* net */}
              <tr>
                <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                  Income After Taxes
                </td>
                <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-600"></td>
                <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                  ${commaFormat(results.net)}
                </td>
              </tr>
            </tbody>
          </table>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            * 2025 brackets & standard deductions. State rates approx. If advanced deductions used, they reduce taxable. 
          </p>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">Your take-home pay is:</p>
            <AuroraText className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              ${commaFormat(results.net)}
            </AuroraText>
          </div>
        </div>
      )}
    </div>
  );
}