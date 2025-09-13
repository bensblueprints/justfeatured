import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Search, Eye, ExternalLink, ShoppingCart, Globe } from "lucide-react";
import { Publication } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { PublicationMobileCard } from "./PublicationMobileCard";

interface PublicationListViewProps {
  publications: Publication[];
  loading: boolean;
  selectedPublications: string[];
  onSelectionChange: (publicationId: string, selected: boolean) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const PublicationListView = ({
  publications,
  loading,
  selectedPublications,
  onSelectionChange,
  searchTerm,
  onSearchChange
}: PublicationListViewProps) => {
  const isMobile = useIsMobile();
  const [sponsoredFilter, setSponsoredFilter] = useState("all");
  const [dofollowFilter, setDofollowFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  
  const ROWS_PER_PAGE = isMobile ? 20 : 50;

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) return "↕️";
    return sortOrder === "asc" ? "↑" : "↓";
  };

  const filteredPublications = useMemo(() => {
    if (loading || publications.length === 0) return [];
    
    let filtered = publications.filter(pub => pub.is_active !== false);

    // Note: Search filtering is now handled by the parent component
    // since we receive pre-filtered publications

    // Sponsored filter
    if (sponsoredFilter === "sponsored") {
      filtered = filtered.filter(pub => pub.sponsored === true);
    } else if (sponsoredFilter === "nonsponsored") {
      filtered = filtered.filter(pub => pub.sponsored === false);
    }

    // DoFollow filter
    if (dofollowFilter === "dofollow") {
      filtered = filtered.filter(pub => pub.dofollow_link === true);
    } else if (dofollowFilter === "nofollow") {
      filtered = filtered.filter(pub => pub.dofollow_link === false);
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(pub => 
        pub.category.toLowerCase().includes(categoryFilter.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Publication];
      let bValue: any = b[sortBy as keyof Publication];

      // Handle null/undefined values
      if (aValue == null) aValue = "";
      if (bValue == null) bValue = "";

      // Handle different data types
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }
      
      if (typeof aValue === "boolean" && typeof bValue === "boolean") {
        return sortOrder === "asc" 
          ? (aValue === bValue ? 0 : aValue ? 1 : -1)
          : (aValue === bValue ? 0 : aValue ? -1 : 1);
      }

      // String comparison
      const comparison = String(aValue).localeCompare(String(bValue));
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [publications, loading, searchTerm, sponsoredFilter, dofollowFilter, categoryFilter, sortBy, sortOrder]);
const totalPages = Math.max(1, Math.ceil(filteredPublications.length / ROWS_PER_PAGE));
const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
const paginatedPublications = filteredPublications.slice(startIndex, startIndex + ROWS_PER_PAGE);

// Reset to first page when filters/search or data change
useEffect(() => {
  setCurrentPage(1);
}, [searchTerm, sponsoredFilter, dofollowFilter, categoryFilter, publications, ROWS_PER_PAGE]);

// Ensure current page stays in bounds when result count changes
useEffect(() => {
  const pages = Math.max(1, Math.ceil(filteredPublications.length / ROWS_PER_PAGE));
  if (currentPage > pages) {
    setCurrentPage(1);
  }
}, [filteredPublications.length, ROWS_PER_PAGE]);
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getFeatureBadges = (publication: Publication) => {
    const badges = [];
    if (publication.sponsored) badges.push("Sponsored");
    if (publication.dofollow_link) badges.push("DoFollow");
    if (publication.indexed) badges.push("Indexed");
    if (publication.erotic) badges.push("Erotic");
    if (publication.health) badges.push("Health");
    if (publication.cbd) badges.push("CBD");
    if (publication.crypto) badges.push("Crypto");
    if (publication.gambling) badges.push("Gambling");
    return badges;
  };

  // Mobile card view for small screens
  if (isMobile) {
    return (
      <div className="space-y-4">
        {/* Mobile Filters */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3">
            <Select value={sponsoredFilter} onValueChange={setSponsoredFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Publications" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border shadow-lg z-50">
                <SelectItem value="all">All Publications</SelectItem>
                <SelectItem value="nonsponsored">NonSponsored ONLY</SelectItem>
                <SelectItem value="sponsored">Sponsored ONLY</SelectItem>
              </SelectContent>
            </Select>

            <div className="grid grid-cols-2 gap-3">
              <Select value={dofollowFilter} onValueChange={setDofollowFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="DoFollow" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border shadow-lg z-50">
                  <SelectItem value="all">All Links</SelectItem>
                  <SelectItem value="dofollow">DoFollow</SelectItem>
                  <SelectItem value="nofollow">NoFollow</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border shadow-lg z-50">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="news">News</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="lifestyle">Lifestyle</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="automotive">Automotive</SelectItem>
                  <SelectItem value="real estate">Real Estate</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm">
          <p className="text-muted-foreground">
            {paginatedPublications.length} of {filteredPublications.length}
            {loading && " (Loading...)"}
          </p>
          <div className="text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        {/* Mobile Card Grid */}
        <div className="grid grid-cols-1 gap-4">
          {paginatedPublications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No publications found matching your criteria</p>
            </div>
          ) : (
            paginatedPublications.map((publication) => (
              <PublicationMobileCard
                key={publication.id}
                publication={publication}
                selected={selectedPublications.includes(publication.id)}
                onSelectionChange={(selected) => onSelectionChange(publication.id, selected)}
              />
            ))
          )}
        </div>

        {/* Mobile Pagination */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage <= 1}
            className="flex-1 mr-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          
          <div className="flex items-center gap-1 mx-4">
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
              const page = currentPage <= 2 ? i + 1 : currentPage - 1 + i;
              if (page > totalPages) return null;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-8 h-8 p-0 text-xs"
                >
                  {page}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage >= totalPages}
            className="flex-1 ml-2"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Desktop Filters */}
      <div className="flex flex-col lg:flex-row gap-4 p-4 bg-muted/50 rounded-lg">
        
        <Select value={sponsoredFilter} onValueChange={setSponsoredFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Publications" />
          </SelectTrigger>
          <SelectContent className="bg-background border border-border shadow-lg z-50">
            <SelectItem value="all">All Publications</SelectItem>
            <SelectItem value="nonsponsored">NonSponsored ONLY</SelectItem>
            <SelectItem value="sponsored">Sponsored ONLY</SelectItem>
          </SelectContent>
        </Select>

        <Select value={dofollowFilter} onValueChange={setDofollowFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="DoFollow Filter" />
          </SelectTrigger>
          <SelectContent className="bg-background border border-border shadow-lg z-50">
            <SelectItem value="all">All Links</SelectItem>
            <SelectItem value="dofollow">DoFollow ONLY</SelectItem>
            <SelectItem value="nofollow">NoFollow ONLY</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-background border border-border shadow-lg z-50">
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="news">News</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="lifestyle">Lifestyle</SelectItem>
            <SelectItem value="entertainment">Entertainment</SelectItem>
            <SelectItem value="sports">Sports</SelectItem>
            <SelectItem value="health">Health</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="science">Science</SelectItem>
            <SelectItem value="travel">Travel</SelectItem>
            <SelectItem value="food">Food</SelectItem>
            <SelectItem value="fashion">Fashion</SelectItem>
            <SelectItem value="automotive">Automotive</SelectItem>
            <SelectItem value="real estate">Real Estate</SelectItem>
            <SelectItem value="education">Education</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Showing {paginatedPublications.length} of {filteredPublications.length} publications
          {loading && " (Loading...)"}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="cursor-pointer hover:bg-muted min-w-[250px]" onClick={() => handleSort("name")}>
                  Publication {getSortIcon("name")}
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted" onClick={() => handleSort("category")}>
                  Category {getSortIcon("category")}
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted" onClick={() => handleSort("price")}>
                  Price {getSortIcon("price")}
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted" onClick={() => handleSort("da_score")}>
                  DA {getSortIcon("da_score")}
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted" onClick={() => handleSort("dr_score")}>
                  DR {getSortIcon("dr_score")}
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted" onClick={() => handleSort("tat_days")}>
                  TAT {getSortIcon("tat_days")}
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted" onClick={() => handleSort("location")}>
                  Location {getSortIcon("location")}
                </TableHead>
                <TableHead>Features</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPublications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No publications found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                paginatedPublications.map((publication) => (
                <TableRow key={publication.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">
                    <div className="space-y-2">
                      <div className="truncate" title={publication.name}>
                        {publication.name}
                      </div>
                      <div className="flex flex-col gap-1">
                        <Button
                          variant={selectedPublications.includes(publication.id) ? "secondary" : "default"}
                          size="sm"
                          onClick={() => onSelectionChange(publication.id, !selectedPublications.includes(publication.id))}
                          className="h-7 px-3 text-xs w-full"
                        >
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          {selectedPublications.includes(publication.id) ? "Remove" : "Add to Cart"}
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{publication.category}</Badge>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {formatPrice(publication.price)}
                  </TableCell>
                  <TableCell className="text-center">
                    {publication.da_score || '-'}
                  </TableCell>
                  <TableCell className="text-center">
                    {publication.dr_score || '-'}
                  </TableCell>
                  <TableCell className="text-sm">
                    {publication.tat_days}
                  </TableCell>
                  <TableCell className="text-sm">
                    {publication.location || '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[150px]">
                      {getFeatureBadges(publication).slice(0, 3).map((badge, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {badge}
                        </Badge>
                      ))}
                      {getFeatureBadges(publication).length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{getFeatureBadges(publication).length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(startIndex + ROWS_PER_PAGE, filteredPublications.length)} of {filteredPublications.length} publications
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              );
            })}
            {totalPages > 5 && (
              <>
                <span className="text-muted-foreground">...</span>
                <Button
                  variant={currentPage === totalPages ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  className="w-8 h-8 p-0"
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage >= totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};