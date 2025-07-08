"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, Star, StarOff, Search, Edit, Trash2, Plus, Filter, X } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import AddNewCaseModal from "@/components/AddNewCase";
import { fetchCases, deleteCase } from "@/lib/api/cases";
import { Badge } from "@/components/ui/badge";
import { format, isWithinInterval } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { CustomModal } from "@/components/CustomModal";
import BackButton from "@/components/BackButton";

interface Case {
  id: number;
  title: string;
  status: string;
  deadline: string;
  isPinned: boolean;
}

interface CaseManagementProps {
  onCaseSelect: (id: number) => void;
}

const statusOptions = ["pending", "active", "closed"];

function getLawyerId() {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    if (user) return JSON.parse(user).id;
  }
  return '';
}

export default function CaseManagement({ onCaseSelect }: CaseManagementProps) {
  const router = useRouter();
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddCaseModalOpen, setIsAddCaseModalOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [deadlineRange, setDeadlineRange] = useState<DateRange | undefined>();
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [caseToDelete, setCaseToDelete] = useState<number | null>(null);

  // Fetch cases on component mount
  useEffect(() => {
    const loadCases = async () => {
      try {
        const data: Case[] = await fetchCases();
        console.log("Fetched cases:", data); // Log fetched data for debugging
        setCases(data.reverse());
      } catch (error) {
        console.error("Error fetching cases:", error);
        toast.error("Failed to fetch cases. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    loadCases();
  }, []);

  // Handle pinning/unpinning a case
  const handlePinCase = (caseId: number) => {
    setCases(prevCases =>
      prevCases.map(c =>
        c.id === caseId ? { ...c, isPinned: !c.isPinned } : c
      )
    );
    const case_ = cases.find(c => c.id === caseId);
    toast.success(case_?.isPinned ? "Case unpinned!" : "Case pinned!");
  };

  // Handle deleting a case
  const handleDeleteCase = async (caseId: number) => {
    try {
      const response = await deleteCase(caseId); // lawyerId is now handled inside deleteCase

      if (response) {
        setCases(prev => prev.filter(c => c.id !== caseId));
        toast.success("Case deleted successfully!");
      } else {
        toast.error("Failed to delete the case.");
      }
    } catch (error) {
      console.error("Error deleting case:", error);
      toast.error("An error occurred while deleting the case.");
    } finally {
      setIsDeleteConfirmationOpen(false);
      setCaseToDelete(null);
    }
  };

  // Handle opening the delete confirmation modal
  const openDeleteConfirmation = (caseId: number) => {
    setCaseToDelete(caseId);
    setIsDeleteConfirmationOpen(true);
  };

  // Handle editing a case
  const handleEditCase = (caseId: number) => {
    toast.success("Edit case functionality coming soon!");
  };

  // Handle status filter changes
  const handleStatusFilter = (status: string) => {
    setSelectedStatuses(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedStatuses([]);
    setDeadlineRange(undefined);
  };

  // Filter cases based on search query, status, and deadline range
  const filteredCases = cases
    .filter(c => {
      if (!c || !c.title) return false; // Skip cases with missing titles
      return (
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedStatuses.length === 0 || selectedStatuses.includes(c.status)) &&
        (!deadlineRange?.from || !deadlineRange?.to || 
          isWithinInterval(new Date(c.deadline), {
            start: deadlineRange.from,
            end: deadlineRange.to,
          }))
      );
    })
    .sort((a, b) => (a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1));

  const activeFilterCount = 
    selectedStatuses.length + (deadlineRange?.from ? 1 : 0);

  return (
    <div>
      <BackButton label="Back" />
      <div className="px-4 sm:p-4 bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <div className="max-w-7xl mx-auto space-y-6">
          <Toaster position="top-right" />
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Case Management
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                Manage all your legal cases in one place
              </p>
            </div>
            
            {/* Desktop Add Button */}
            <Button
              onClick={() => setIsAddCaseModalOpen(true)}
              className="hidden sm:flex gap-2 bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <PlusCircle className="w-5 h-5" />
              Add New Case
            </Button>
            
            {/* Mobile Add FAB */}
            <Button
              size="icon"
              className="sm:hidden fixed bottom-8 right-8 rounded-full shadow-lg h-14 w-14 bg-blue-600 hover:bg-blue-700 z-10"
              onClick={() => setIsAddCaseModalOpen(true)}
            >
              <Plus className="w-6 h-6" />
            </Button>
          </div>

          {/* Search and Filter Section */}
          <Card className="shadow-sm border-gray-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Search cases..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 py-5 text-base rounded-lg border-gray-300"
                  />
                </div>
                
                {/* Filter Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="py-5 px-6 border-gray-300 text-gray-600 flex gap-2"
                    >
                      <Filter className="w-5 h-5" />
                      Filter
                      {activeFilterCount > 0 && (
                        <Badge className="px-2 py-1 text-xs">
                          {activeFilterCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-auto p-4" align="end">
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium text-sm">Filters</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="text-xs h-6 px-2"
                            disabled={activeFilterCount === 0}
                          >
                            Clear all
                          </Button>
                        </div>

                        {/* Status Filters */}
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Case Status</h4>
                          <div className="flex flex-wrap gap-4">
                            {statusOptions.map(status => (
                              <div 
                                key={status}
                                className="flex items-center gap-2"
                              >
                                <Checkbox
                                  id={status}
                                  checked={selectedStatuses.includes(status)}
                                  onCheckedChange={() => handleStatusFilter(status)}
                                />
                                <Label 
                                  htmlFor={status}
                                  className="text-sm capitalize cursor-pointer"
                                >
                                  {status}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Deadline Filter */}
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Deadline Range</h4>
                          <Calendar
                            mode="range"
                            selected={deadlineRange}
                            onSelect={setDeadlineRange}
                            numberOfMonths={1}
                            className="rounded-md border"
                          />
                          {deadlineRange && (
                            <div className="flex gap-2 text-sm text-gray-600">
                              {deadlineRange.from && (
                                <Badge variant="outline">
                                  Start: {format(deadlineRange.from, "MMM dd yyyy")}
                                </Badge>
                              )}
                              {deadlineRange.to && (
                                <Badge variant="outline">
                                  End: {format(deadlineRange.to, "MMM dd yyyy")}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Active Filters */}
                        {activeFilterCount > 0 && (
                          <div className="flex flex-wrap gap-2 pt-4">
                            {selectedStatuses.map(status => (
                              <Badge
                                key={status}
                                variant="outline"
                                className="capitalize"
                              >
                                {status}
                                <X
                                  className="w-3 h-3 ml-1 cursor-pointer"
                                  onClick={() => handleStatusFilter(status)}
                                />
                              </Badge>
                            ))}
                            {deadlineRange?.from && (
                              <Badge variant="outline">
                                {format(deadlineRange.from, "MMM dd")}
                                {deadlineRange.to && ` - ${format(deadlineRange.to, "MMM dd")}`}
                                <X
                                  className="w-3 h-3 ml-1 cursor-pointer"
                                  onClick={() => setDeadlineRange(undefined)}
                                />
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>

          {/* Cases List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
              </div>
            ) : filteredCases.length > 0 ? (
              filteredCases.map(case_ => (
                <Card
                  key={case_.id}
                  className="group relative bg-white rounded-lg border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-200 ease-in-out"
                >
                  <CardContent className="p-6 space-y-4">
                    {/* Case Header */}
                    <div
                      onClick={() => onCaseSelect(case_.id)}
                      className="cursor-pointer space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {case_.title}
                        </h3>
                        {case_.isPinned && (
                          <Star className="w-5 h-5 text-yellow-500 fill-current shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            case_.status === 'active' ? 'default' : 
                            case_.status === 'closed' ? 'secondary' : 'outline'
                          }
                          className="text-xs capitalize"
                        >
                          {case_.status}
                        </Badge>
                        <span className="text-sm text-gray-500">ID: {case_.id}</span>
                      </div>
                    </div>

                    {/* Case Details */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">Deadline:</span>
                        <span>
                          {case_.deadline && !isNaN(new Date(case_.deadline).getTime())
                            ? format(new Date(case_.deadline), "MMM dd, yyyy")
                            : "No deadline"}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePinCase(case_.id);
                        }}
                        className="text-gray-500 hover:bg-gray-100 rounded-lg"
                      >
                        {case_.isPinned ? (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        ) : (
                          <StarOff className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditCase(case_.id);
                        }}
                        className="text-gray-500 hover:bg-gray-100 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteConfirmation(case_.id);
                        }}
                        className="text-red-500 hover:bg-red-100 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="space-y-4">
                  <p className="text-gray-500">
                    No cases found. Start by adding a new case.
                  </p>
                  <Button
                    onClick={() => setIsAddCaseModalOpen(true)}
                    className="gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <PlusCircle className="w-5 h-5" />
                    Add New Case
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add New Case Modal */}
        {isAddCaseModalOpen && (
          <AddNewCaseModal
            onClose={() => setIsAddCaseModalOpen(false)}
            onAddCase={(newCase) => {
              console.log("New Case Data from API:", newCase); // Log the newCase object
            
              // Map the newCase object to the expected fields
              const mappedCase = {
                id: newCase.caseId, // Use newCase.caseId directly
                title: newCase.caseTitle,
                status: newCase.status,
                deadline: newCase.dateOfFile || "No deadline",
                isPinned: false,
              };
            
              // Validate required fields
              if (mappedCase.title && mappedCase.id && mappedCase.status) {
                // Add the new case to the state
                setCases((prev) => [mappedCase, ...prev]);
                toast.success("New case added successfully!");
              } else {
                // Show error if required fields are missing
                console.error("Missing required fields in new case:", newCase);
                toast.error("Failed to add case. Required fields are missing.");
              }
            }}
          />
        )}

        {/* Delete Confirmation Modal */}
        <CustomModal
          isOpen={isDeleteConfirmationOpen}
          onClose={() => setIsDeleteConfirmationOpen(false)}
          onConfirm={() => {
            if (caseToDelete !== null) {
              handleDeleteCase(caseToDelete);
            }
          }}
          title="Confirm Deletion"
          description="Are you sure you want to delete this case? This action is irreversible."
        />
      </div>
    </div>
  );
}