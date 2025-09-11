import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { PublicationCard } from "@/components/PublicationCard";
import { PublicationListView } from "@/components/PublicationListView";
import { AIPresAgentDialog } from "@/components/AIPresAgentDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ShoppingCart, Filter, DollarSign, Building, Grid3X3, List } from "lucide-react";
import { fetchPublications } from "@/lib/publications";
import { Publication, CartItem } from "@/types";
import { ProtectedInteraction } from "@/components/ProtectedInteraction";

export const Publications = () => {
  const navigate = useNavigate();
  const [selectedPublications, setSelectedPublications] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("price-low");
  const [activeTab, setActiveTab] = useState("all");
  const [visibleCount, setVisibleCount] = useState(18);
  const [priceRange, setPriceRange] = useState<string>("all");
  const [industryFilter, setIndustryFilter] = useState<string>("all");
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards");
  
  const LOAD_MORE_COUNT = 18;

  // Fetch publications from database
  useEffect(() => {
    const loadPublications = async () => {
      try {
        const data = await fetchPublications();
        setPublications(data);
      } catch (error) {
        console.error('Error loading publications:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPublications();
  }, []);

  const filteredPublications = useMemo(() => {
    if (loading || publications.length === 0) {
      return [];
    }
    
    let filtered = publications.filter(pub => pub.is_active !== false);

    // Filter by tab
    if (activeTab !== "all") {
      filtered = filtered.filter(pub => pub.type === activeTab || pub.tier === activeTab);
    }

    // Filter by price range
    if (priceRange !== "all") {
      const ranges = {
        "under-1000": [0, 1000], // Under $1,000
        "1000-5000": [1000, 5000], // $1,000 - $5,000
        "5000-15000": [5000, 15000], // $5,000 - $15,000
        "15000-50000": [15000, 50000], // $15,000 - $50,000
        "over-50000": [50000, Infinity] // Over $50,000
      };
      
      const [min, max] = ranges[priceRange as keyof typeof ranges] || [0, Infinity];
      console.log('Price filter:', priceRange, 'Range:', [min, max]);
      
      filtered = filtered.filter(pub => {
        const price = Number(pub.price) || 0;
        const inRange = price >= min && price < max;
        console.log('Publication:', pub.name, 'Price:', price, 'In range:', inRange);
        return inRange;
      });
    }

    // Filter by industry/category
    if (industryFilter !== "all") {
      filtered = filtered.filter(pub => 
        pub.category.toLowerCase().includes(industryFilter.toLowerCase()) ||
        pub.location?.toLowerCase().includes(industryFilter.toLowerCase())
      );
    }

    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter(pub =>
        pub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pub.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pub.location?.toLowerCase().includes(searchTerm.toLowerCase())
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
  }, [searchTerm, sortBy, activeTab, priceRange, industryFilter, publications, loading]);

  // Reset visible count when filters change
  useMemo(() => {
    setVisibleCount(18);
  }, [searchTerm, sortBy, activeTab, priceRange, industryFilter]);

  const visiblePublications = filteredPublications.slice(0, visibleCount);
  const hasMorePublications = visibleCount < filteredPublications.length;

  const selectedTotal = useMemo(() => {
    return selectedPublications.reduce((total, id) => {
      const pub = publications.find(p => p.id === id);
      return total + (pub?.price || 0);
    }, 0);
  }, [selectedPublications, publications]);

  const handleSelectionChange = (publicationId: string, selected: boolean) => {
    setSelectedPublications(prev =>
      selected
        ? [...prev, publicationId]
        : prev.filter(id => id !== publicationId)
    );
  };

  const getTabCounts = useMemo(() => {
    return {
      all: publications.length,
      starter: publications.filter(p => p.type === 'starter' || p.tier === 'starter').length,
      tier2: publications.filter(p => p.type === 'tier2').length,
      premium: publications.filter(p => p.type === 'premium').length,
      tier1: publications.filter(p => p.type === 'tier1').length,
      exclusive: publications.filter(p => p.type === 'exclusive').length,
    };
  }, [publications]);

  const tabCounts = getTabCounts;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Publications Marketplace
            </h1>
            <p className="text-xl text-muted-foreground">
              Choose from {publications.length}+ premium publications to get your story featured
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex items-center border rounded-lg p-1 bg-background">
              <Button
                variant={viewMode === "cards" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("cards")}
                className="h-8 px-3"
              >
                <Grid3X3 className="h-4 w-4 mr-1" />
                Cards
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-8 px-3"
              >
                <List className="h-4 w-4 mr-1" />
                List
              </Button>
            </div>
            
            <ProtectedInteraction>
              <div>
                <AIPresAgentDialog />
              </div>
            </ProtectedInteraction>
          </div>
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
              <SelectContent className="bg-background border border-border shadow-lg z-50">
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Additional Filters Row */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-[200px]">
                <DollarSign className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border shadow-lg z-50">
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under-1000">Under $1,000</SelectItem>
                <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
                <SelectItem value="5000-15000">$5,000 - $15,000</SelectItem>
                <SelectItem value="15000-50000">$15,000 - $50,000</SelectItem>
                <SelectItem value="over-50000">Over $50,000</SelectItem>
              </SelectContent>
            </Select>

            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger className="w-[200px]">
                <Building className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Industry/Location" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border shadow-lg z-50">
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="tech">Technology</SelectItem>
                <SelectItem value="news">News & Media</SelectItem>
                <SelectItem value="business">Business & Finance</SelectItem>
                <SelectItem value="lifestyle">Lifestyle & Culture</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="music">Music</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="crypto">Cryptocurrency</SelectItem>
                <SelectItem value="fashion">Fashion</SelectItem>
                <SelectItem value="real estate">Real Estate</SelectItem>
                <SelectItem value="global">Global</SelectItem>
                <SelectItem value="united states">United States</SelectItem>
                <SelectItem value="california">California</SelectItem>
                <SelectItem value="new york">New York</SelectItem>
                <SelectItem value="texas">Texas</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="canada">Canada</SelectItem>
                <SelectItem value="australia">Australia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all" className="text-sm">
                All ({tabCounts.all})
              </TabsTrigger>
              <TabsTrigger value="starter" className="text-sm">
                Starter ({tabCounts.starter})
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
          {/* Publications Content */}
          <div className="flex-1">
            {viewMode === "list" ? (
              <PublicationListView
                publications={filteredPublications}
                loading={loading}
                selectedPublications={selectedPublications}
                onSelectionChange={handleSelectionChange}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-muted-foreground">
                    Showing {visiblePublications.length} of {filteredPublications.length} publications
                    {loading && " (Loading...)"}
                  </p>
                  {hasMorePublications && (
                    <p className="text-sm text-muted-foreground">
                      {filteredPublications.length - visibleCount} more available
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {visiblePublications.map((publication) => (
                    <ProtectedInteraction key={publication.id}>
                      <div>
                        <PublicationCard
                          publication={publication}
                          selected={selectedPublications.includes(publication.id)}
                          onSelectionChange={(selected) => handleSelectionChange(publication.id, selected)}
                        />
                      </div>
                    </ProtectedInteraction>
                  ))}
                </div>

                {/* Load More Button */}
                {hasMorePublications && (
                  <div className="flex justify-center mb-8">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setVisibleCount(prev => prev + LOAD_MORE_COUNT)}
                      className="min-w-[200px]"
                    >
                      Load More Publications ({filteredPublications.length - visibleCount} remaining)
                    </Button>
                  </div>
                )}

                {!hasMorePublications && filteredPublications.length > 18 && (
                  <div className="text-center py-4 mb-8">
                    <p className="text-muted-foreground">
                      You've viewed all {filteredPublications.length} publications. Try adjusting your filters to see different results.
                    </p>
                  </div>
                )}
              </>
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
                        const pub = publications.find(p => p.id === id);
                        if (!pub) return null;
                        
                        return (
                          <div key={id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{pub.name}</p>
                              <p className="text-xs text-muted-foreground">{pub.category}</p>
                            </div>
                            <div className="text-sm font-semibold">
                              ${pub.price.toFixed(0)}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-2xl font-bold text-primary">
                          ${selectedTotal.toFixed(0)}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <ProtectedInteraction action={() => navigate('/checkout', { 
                          state: { 
                            selectedPublications: selectedPublications.map(id => {
                              const pub = publications.find(p => p.id === id);
                              return pub ? {
                                id: pub.id,
                                name: pub.name,
                                price: pub.price,
                                category: pub.category,
                                tat_days: pub.tat_days
                              } : null;
                            }).filter(Boolean),
                            packageType: 'custom'
                          }
                        })}>
                          <Button 
                            variant="hero" 
                            className="w-full" 
                            size="lg"
                          >
                            Proceed to Checkout
                          </Button>
                        </ProtectedInteraction>
                        
                        <ProtectedInteraction action={() => navigate('/checkout', { 
                          state: { 
                            packageType: 'starter'
                          }
                        })}>
                          <Button 
                            variant="outline" 
                            className="w-full"
                          >
                            Get <span className="line-through text-gray-400">$497</span> <span className="text-green-600">$97</span> Starter Package
                          </Button>
                        </ProtectedInteraction>
                        
                        <div className="text-center">
                          <Badge variant="secondary">
                            💡 Save with our <span className="line-through text-gray-400">$497</span> <span className="text-green-600">$97</span> starter package
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