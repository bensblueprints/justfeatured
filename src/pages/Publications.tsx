import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { PublicationCard } from "@/components/PublicationCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ShoppingCart, Filter } from "lucide-react";
import { PUBLICATIONS } from "@/data/publications";
import { Publication, CartItem } from "@/types";

export const Publications = () => {
  const [selectedPublications, setSelectedPublications] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("popularity");
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  
  const ITEMS_PER_PAGE = 18;

  const filteredPublications = useMemo(() => {
    let filtered = PUBLICATIONS;

    // Filter by tab
    if (activeTab !== "all") {
      filtered = filtered.filter(pub => pub.type === activeTab);
    }

    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter(pub =>
        pub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pub.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        case "popularity":
        default:
          return b.popularity - a.popularity;
      }
    });

    return filtered;
  }, [searchTerm, sortBy, activeTab]);

  const totalPages = Math.ceil(filteredPublications.length / ITEMS_PER_PAGE);
  const paginatedPublications = filteredPublications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const selectedTotal = useMemo(() => {
    return selectedPublications.reduce((total, id) => {
      const pub = PUBLICATIONS.find(p => p.id === id);
      return total + (pub?.price || 0);
    }, 0);
  }, [selectedPublications]);

  const handleSelectionChange = (publicationId: string, selected: boolean) => {
    setSelectedPublications(prev =>
      selected
        ? [...prev, publicationId]
        : prev.filter(id => id !== publicationId)
    );
  };

  const getTabCounts = () => {
    return {
      all: PUBLICATIONS.length,
      tier2: PUBLICATIONS.filter(p => p.type === 'tier2').length,
      premium: PUBLICATIONS.filter(p => p.type === 'premium').length,
      tier1: PUBLICATIONS.filter(p => p.type === 'tier1').length,
      exclusive: PUBLICATIONS.filter(p => p.type === 'exclusive').length,
    };
  };

  const tabCounts = getTabCounts();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Publications Marketplace
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose from 355+ premium publications to get your story featured
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search publications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all" className="text-sm">
                All ({tabCounts.all})
              </TabsTrigger>
              <TabsTrigger value="tier2" className="text-sm">
                Standard ({tabCounts.tier2})
              </TabsTrigger>
              <TabsTrigger value="premium" className="text-sm">
                Premium ({tabCounts.premium})
              </TabsTrigger>
              <TabsTrigger value="tier1" className="text-sm">
                Tier 1 ({tabCounts.tier1})
              </TabsTrigger>
              <TabsTrigger value="exclusive" className="text-sm">
                Exclusive ({tabCounts.exclusive})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Publications Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-muted-foreground">
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredPublications.length)} of {filteredPublications.length} publications
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {paginatedPublications.map((publication) => (
                <PublicationCard
                  key={publication.id}
                  publication={publication}
                  selected={selectedPublications.includes(publication.id)}
                  onSelectionChange={(selected) => handleSelectionChange(publication.id, selected)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                <div className="flex space-x-1">
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 2 && page <= currentPage + 2)
                    ) {
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      );
                    } else if (page === currentPage - 3 || page === currentPage + 3) {
                      return <span key={page} className="px-2">...</span>;
                    }
                    return null;
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>

          {/* Sticky Checkout Sidebar */}
          <div className="lg:w-80">
            <Card className="sticky top-24 bg-gradient-card">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  <h3 className="text-lg font-semibold">
                    Selected Publications ({selectedPublications.length})
                  </h3>
                </div>

                {selectedPublications.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No publications selected yet. Choose from the marketplace to get started.
                  </p>
                ) : (
                  <div className="space-y-4">
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {selectedPublications.map(id => {
                        const pub = PUBLICATIONS.find(p => p.id === id);
                        if (!pub) return null;
                        
                        return (
                          <div key={id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{pub.name}</p>
                              <p className="text-xs text-muted-foreground">{pub.category}</p>
                            </div>
                            <div className="text-sm font-semibold">
                              ${(pub.price / 100).toFixed(0)}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-2xl font-bold text-primary">
                          ${(selectedTotal / 100).toFixed(0)}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <Button variant="hero" className="w-full" size="lg">
                          Proceed to Checkout
                        </Button>
                        
                        <div className="text-center">
                          <Badge variant="secondary">
                            💡 Save with our $97 starter package
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};