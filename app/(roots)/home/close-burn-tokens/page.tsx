"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTokens } from "@/hook/useToken";

const BurnTokenPage = () => {
  const {tokens}=useTokens();

  return (
    <div className="text-white flex justify-evenly items-center">
      <div className="p-8 max-w-md w-full">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Burn Token
        </h1>

        <div className="space-y-6">
          {/* Token Selector */}
          <div>
            <label
              htmlFor="token-select"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Select a Token
            </label>
            <Select>
              <SelectTrigger className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 text-gray-300 hover:border-slate-400 focus:ring-slate-500 focus:ring-1">
                <SelectValue placeholder="Select a token to burn" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border border-gray-700 rounded-md text-gray-300">
                <SelectGroup>
                  <SelectLabel className="text-gray-500">Tokens</SelectLabel>
                  {tokens.filter(token => token.amount !== "0").length ? (
                    tokens
                      .filter(token => token.amount !== "0")
                      .map((token, index) => (
                        <SelectItem key={index} value={token.name}>
                          {token.name} ({token.amount})
                        </SelectItem>
                      ))89
                  ) : (
                    <SelectItem disabled value="None">No token</SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Burn Button */}
          <div className="mt-6">
            <button
              type="button"
              className="w-full bg-slate-600 hover:bg-slate-700 transition-all text-white font-bold py-3 px-6 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              Burn Token
            </button>
          </div>
        </div>



        {/* Open Accounts Section
      <div>
        <h2 className="text-2xl font-bold text-gray-300 mt-8 mb-4">
          Open Accounts
        </h2>
        <ul className="space-y-4">
          {accounts.map((account) => (
            <li
              key={account.address}
              className="bg-gray-800 border border-gray-700 rounded-md p-4 flex justify-between items-center"
            >
              <div>
                <p className="text-sm text-gray-400">
                  Address: {account.address}
                </p>
                <p className="text-sm text-gray-400">Mint: {account.mint}</p>
                <p className="text-sm text-gray-400">
                  Balance: {account.balance}
                </p>
              </div>
              <button
                className="text-sm text-slate-600 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-md font-bold"
                onClick={() => setSelectedAccount(account.address)}
              >
                Close Account
              </button>
            </li>
          ))}
        </ul>
      </div> */}
      </div>
    </div>
  );
};

export default BurnTokenPage;
