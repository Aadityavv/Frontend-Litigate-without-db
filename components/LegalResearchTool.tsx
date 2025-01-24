"use client";

import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, ExternalLink, Filter, Search } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function LegalResearchTool() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [sortOption, setSortOption] = useState("relevance");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Animation variants
  const filtersVariants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: -20 },
  };

  const resultVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const fetchResults = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://dummy-backend-15jt.onrender.com/research/legal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: searchQuery,
          categories: selectedCategories,
          sort: sortOption,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch results.");
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
      toast.error("Failed to fetch search results.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchResults();
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <Toaster position="top-right" />
      <Card className="mx-auto max-w-7xl shadow-xl">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-3xl font-bold text-gray-900">
            Legal Research Hub
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search cases, statutes, or legal analyses..."
                  className="h-14 rounded-xl pl-12 text-lg shadow-sm"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                size="lg"
                className="h-14 gap-2 rounded-xl px-8 text-lg"
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                type="button"
                variant="outline"
              >
                <Filter className="h-5 w-5" />
                Filters
                {isFiltersOpen ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </Button>
              <Button
                size="lg"
                className="h-14 rounded-xl px-8 text-lg"
                type="submit"
                disabled={loading}
              >
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>
          </form>

          {/* Filters Panel */}
          <AnimatePresence>
            {isFiltersOpen && (
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={filtersVariants}
                transition={{ duration: 0.2 }}
                className="mb-8 rounded-xl border bg-white p-6 shadow-lg"
              >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {/* Categories */}
                  <div>
                    <Label className="mb-4 block text-sm font-semibold">
                      Document Type
                    </Label>
                    {["Case Law", "Statute", "Regulation", "Legal Analysis"].map(category => (
                      <div key={category} className="flex items-center space-x-3 py-2">
                        <Checkbox
                          id={category}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => handleCategoryChange(category)}
                          className="h-5 w-5 rounded-md border-2 border-gray-300 data-[state=checked]:border-blue-600"
                        />
                        <label
                          htmlFor={category}
                          className="text-sm text-gray-700"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* Jurisdiction */}
                  <div>
                    <Label className="mb-4 block text-sm font-semibold">
                      Jurisdiction
                    </Label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select jurisdiction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="federal">Federal</SelectItem>
                        <SelectItem value="state">State</SelectItem>
                        <SelectItem value="international">
                          International
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Practice Area */}
                  <div>
                    <Label className="mb-4 block text-sm font-semibold">
                      Practice Area
                    </Label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select practice area" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="corporate">Corporate</SelectItem>
                        <SelectItem value="criminal">Criminal</SelectItem>
                        <SelectItem value="family">Family</SelectItem>
                        <SelectItem value="ip">Intellectual Property</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Section */}
          <div className="flex items-center justify-between pb-6">
            <h3 className="text-lg font-semibold text-gray-700">
              {results.length} Results Found
            </h3>
            <Select onValueChange={setSortOption} value={sortOption}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="recency">Most Recent</SelectItem>
                <SelectItem value="cited">Most Cited</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results List */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex flex-col gap-4">
                {Array(3).fill(0).map((_, i) => (
                  <div
                    key={i}
                    className="h-32 w-full rounded-xl bg-gray-100 animate-pulse"
                  />
                ))}
              </div>
            ) : results.length > 0 ? (
              results.map((result, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  animate="visible"
                  variants={resultVariants}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-blue-800">
                            <a
                              href={result.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {result.title}
                            </a>
                          </h3>
                          <div className="mt-2 flex items-center gap-3">
                            <Badge className="bg-blue-100 text-blue-800">
                              {result.type}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {new Date(result.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="mt-3 text-gray-600">{result.snippet}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => window.open(result.link, "_blank")}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="py-12 text-center text-gray-500">
                No results found. Try adjusting your search terms or filters.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}