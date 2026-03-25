"use client";

import { useState, useMemo } from "react";
import { MortgageCalculatorInputs } from "@/lib/types";
import { calculateMortgage } from "@/lib/mortgage";

interface MortgageCalculatorProps {
  defaultHomePrice?: number;
}

export default function MortgageCalculator({
  defaultHomePrice = 500000,
}: MortgageCalculatorProps) {
  const [inputs, setInputs] = useState<MortgageCalculatorInputs>({
    homePrice: defaultHomePrice,
    downPayment: 20,
    loanTerm: 30,
    interestRate: 7.0,
    propertyTax: 1.1,
    homeInsurance: 1500,
    pmiRate: 0.5,
  });

  const results = useMemo(() => calculateMortgage(inputs), [inputs]);

  function update<K extends keyof MortgageCalculatorInputs>(
    key: K,
    value: number
  ) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <div className="space-y-5">
      {/* Inputs */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Loan Details
        </h3>

        <InputField
          label="Home Price"
          value={inputs.homePrice}
          prefix="$"
          min={50000}
          max={20000000}
          step={5000}
          onChange={(v) => update("homePrice", v)}
        />

        <InputField
          label={`Down Payment (${inputs.downPayment}%)`}
          value={inputs.downPayment}
          suffix="%"
          min={3}
          max={100}
          step={1}
          onChange={(v) => update("downPayment", v)}
        />

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Loan Term
          </label>
          <div className="flex gap-2">
            {[10, 15, 20, 30].map((term) => (
              <button
                key={term}
                onClick={() => update("loanTerm", term)}
                className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors ${
                  inputs.loanTerm === term
                    ? "bg-emerald-500 text-white border-emerald-500"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {term} yr
              </button>
            ))}
          </div>
        </div>

        <InputField
          label="Interest Rate"
          value={inputs.interestRate}
          suffix="%"
          min={1}
          max={20}
          step={0.05}
          onChange={(v) => update("interestRate", v)}
        />

        <InputField
          label="Property Tax Rate"
          value={inputs.propertyTax}
          suffix="% / yr"
          min={0}
          max={5}
          step={0.1}
          onChange={(v) => update("propertyTax", v)}
        />

        <InputField
          label="Home Insurance"
          value={inputs.homeInsurance}
          prefix="$"
          suffix="/ yr"
          min={0}
          max={20000}
          step={100}
          onChange={(v) => update("homeInsurance", v)}
        />
      </div>

      {/* Summary */}
      <div className="bg-emerald-50 rounded-xl p-4 space-y-3">
        <div className="flex items-end justify-between">
          <span className="text-sm font-medium text-gray-600">
            Monthly Payment
          </span>
          <span className="text-2xl font-bold text-emerald-700">
            ${fmt(results.totalMonthlyPayment)}
          </span>
        </div>

        <div className="border-t border-emerald-200 pt-3 space-y-1.5">
          <BreakdownRow
            label="Principal & Interest"
            value={`$${fmt(results.monthlyPrincipalInterest)}`}
          />
          <BreakdownRow
            label="Property Tax"
            value={`$${fmt(results.monthlyPropertyTax)}`}
          />
          <BreakdownRow
            label="Home Insurance"
            value={`$${fmt(results.monthlyInsurance)}`}
          />
          {results.monthlyPMI > 0 && (
            <BreakdownRow
              label="PMI"
              value={`$${fmt(results.monthlyPMI)}`}
              highlight
            />
          )}
        </div>
      </div>

      {/* Loan Summary */}
      <div className="grid grid-cols-2 gap-3 text-center">
        <SummaryBox
          label="Loan Amount"
          value={`$${fmt(results.loanAmount)}`}
        />
        <SummaryBox
          label="Down Payment"
          value={`$${fmt(results.downPaymentAmount)}`}
        />
        <SummaryBox
          label="Total Interest"
          value={`$${fmt(results.totalInterest)}`}
        />
        <SummaryBox
          label="Total Cost"
          value={`$${fmt(results.totalPayment + results.downPaymentAmount)}`}
        />
      </div>

      {results.monthlyPMI > 0 && (
        <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
          💡 Consider a 20% down payment to eliminate PMI and save $
          {fmt(results.monthlyPMI)}/month.
        </p>
      )}
    </div>
  );
}

interface InputFieldProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

function InputField({
  label,
  value,
  prefix,
  suffix,
  min,
  max,
  step,
  onChange,
}: InputFieldProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          {prefix && (
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-gray-400">
              {prefix}
            </span>
          )}
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onChange(Number(e.target.value))}
            className={`w-full border border-gray-200 rounded-lg py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
              prefix ? "pl-6" : "pl-3"
            } ${suffix ? "pr-14" : "pr-3"}`}
          />
          {suffix && (
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              {suffix}
            </span>
          )}
        </div>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full mt-1 accent-emerald-500"
      />
    </div>
  );
}

function BreakdownRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between text-xs">
      <span className={highlight ? "text-amber-600" : "text-gray-500"}>
        {label}
      </span>
      <span className={highlight ? "font-medium text-amber-700" : "text-gray-700"}>
        {value}
      </span>
    </div>
  );
}

function SummaryBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-2.5">
      <div className="text-xs text-gray-500 mb-0.5">{label}</div>
      <div className="text-sm font-semibold text-gray-800">{value}</div>
    </div>
  );
}
