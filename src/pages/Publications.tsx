import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { PublicationCard } from "@/components/PublicationCard";
import { PublicationListView } from "@/components/PublicationListView";
import { SpreadsheetSync } from "@/components/SpreadsheetSync";

import { AIPresAgentDialog } from "@/components/AIPresAgentDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Search, ShoppingCart, Filter, DollarSign, Building, Grid3X3, List } from "lucide-react";
import { fetchPublications } from "@/lib/publications";
import { usePublicationsSync } from "@/hooks/usePublicationsSync";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useCart } from "@/hooks/useCart";
import { Publication, CartItem } from "@/types";
import { ProtectedInteraction } from "@/components/ProtectedInteraction";

export const Publications = () => {
  const navigate = useNavigate();
  const { selectedPublications, toggleCart } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("price-low");
  const [activeTab, setActiveTab] = useState("all");
  const [visibleCount, setVisibleCount] = useState(18);
  const [priceRange, setPriceRange] = useState<string>("all");
  const [industryFilter, setIndustryFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"cards" | "list">("list");
  
  const LOAD_MORE_COUNT = 18;

  // Use real-time publications sync and admin check
  const { publications, loading, refreshPublications } = usePublicationsSync();
  const { isAdmin } = useAdminCheck();

  const filteredPublications = useMemo(() => {
    if (loading || publications.length === 0) {
      return [];
    }
    
    let filtered = publications.filter(pub => pub.is_active !== false);

    // Filter by tab
    if (activeTab !== "all") {
      switch (activeTab) {
        case "nonsponsored":
          filtered = filtered.filter(pub => pub.sponsored === false);
          break;
        case "dofollow":
          filtered = filtered.filter(pub => pub.dofollow_link === true);
          break;
        case "bestsellers":
          filtered = filtered.filter(pub => pub.popularity > 70);
          break;
        case "listicles":
          filtered = filtered.filter(pub => pub.category?.toLowerCase().includes('listicle'));
          break;
        case "bundles":
          filtered = filtered.filter(pub => pub.category?.toLowerCase().includes('bundle'));
          break;
        case "print":
          filtered = filtered.filter(pub => pub.category?.toLowerCase().includes('print'));
          break;
        case "digitaltv":
          filtered = filtered.filter(pub => pub.category?.toLowerCase().includes('digital') || pub.category?.toLowerCase().includes('tv'));
          break;
        case "broadcasttv":
          filtered = filtered.filter(pub => pub.category?.toLowerCase().includes('broadcast'));
          break;
        case "socialpost":
          filtered = filtered.filter(pub => pub.category?.toLowerCase().includes('social'));
          break;
        case "starter":
          filtered = filtered.filter(pub => pub.tier?.toLowerCase() === 'starter' || pub.price === 97);
          break;
        default:
          filtered = filtered.filter(pub => pub.type === activeTab || pub.tier === activeTab);
      }
    }

    // Filter by price range
    if (priceRange !== "all") {
      const ranges = {
        "under-200": [0, 200], // Under $200
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

    // Enhanced search matching
    if (searchTerm) {
      const normalizedSearch = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(pub =>
        pub.name.toLowerCase().includes(normalizedSearch) ||
        pub.category.toLowerCase().includes(normalizedSearch) ||
        pub.location?.toLowerCase().includes(normalizedSearch) ||
        pub.type?.toLowerCase().includes(normalizedSearch) ||
        pub.tier?.toLowerCase().includes(normalizedSearch) ||
        (pub.features && pub.features.some(f => f.toLowerCase().includes(normalizedSearch))) ||
        pub.price.toString().includes(normalizedSearch) ||
        pub.website_url?.toLowerCase().includes(normalizedSearch)
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

  const visiblePublications = searchTerm ? filteredPublications : filteredPublications.slice(0, visibleCount);
  const hasMorePublications = searchTerm ? false : visibleCount < filteredPublications.length;

  const selectedTotal = useMemo(() => {
    return selectedPublications.reduce((total, id) => {
      const pub = publications.find(p => p.id === id);
      return total + (pub?.price || 0);
    }, 0);
  }, [selectedPublications, publications]);

  const handleSelectionChange = (publicationId: string, selected: boolean) => {
    console.log('handleSelectionChange called:', publicationId, selected);
    toggleCart(publicationId);
  };

  const getTabCounts = useMemo(() => {
    return {
      all: publications.length,
      nonsponsored: publications.filter(p => p.sponsored === false).length,
      dofollow: publications.filter(p => p.dofollow_link === true).length,
      bestsellers: publications.filter(p => p.popularity > 70).length,
      listicles: publications.filter(p => p.category?.toLowerCase().includes('listicle')).length,
      bundles: publications.filter(p => p.category?.toLowerCase().includes('bundle')).length,
      print: publications.filter(p => p.category?.toLowerCase().includes('print')).length,
      digitaltv: publications.filter(p => p.category?.toLowerCase().includes('digital') || p.category?.toLowerCase().includes('tv')).length,
      broadcasttv: publications.filter(p => p.category?.toLowerCase().includes('broadcast')).length,
      socialpost: publications.filter(p => p.category?.toLowerCase().includes('social')).length,
      starter: publications.filter(p => p.tier?.toLowerCase() === 'starter' || p.price === 97).length,
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
              Choose from 1,241+ premium publications to get your story featured
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

        {/* Mobile-Optimized Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search publications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Sort and View Toggle Row */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
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

            {/* Mobile View Toggle */}
            <div className="flex items-center border rounded-lg p-1 bg-background sm:hidden w-full">
              <Button
                variant={viewMode === "cards" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("cards")}
                className="h-8 px-3 flex-1"
              >
                <Grid3X3 className="h-4 w-4 mr-1" />
                Cards
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-8 px-3 flex-1"
              >
                <List className="h-4 w-4 mr-1" />
                List
              </Button>
            </div>
          </div>

          {/* Price and Industry Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <DollarSign className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border shadow-lg z-50">
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under-1000">Under $1,000</SelectItem>
                <SelectItem value="under-200">Under $200</SelectItem>
                <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
                <SelectItem value="5000-15000">$5,000 - $15,000</SelectItem>
                <SelectItem value="15000-50000">$15,000 - $50,000</SelectItem>
                <SelectItem value="over-50000">Over $50,000</SelectItem>
              </SelectContent>
            </Select>

            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger>
                <Building className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Industry" />
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

          {/* Category Filter */}
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="z-50 bg-background border border-border shadow-lg">
              <SelectItem value="all">All (1,241)</SelectItem>
              <SelectItem value="nonsponsored">NonSponsored ({tabCounts.nonsponsored})</SelectItem>
              <SelectItem value="dofollow">DoFollow ({tabCounts.dofollow})</SelectItem>
              <SelectItem value="bestsellers">Best Sellers ({tabCounts.bestsellers})</SelectItem>
              <SelectItem value="listicles">Listicles ({tabCounts.listicles})</SelectItem>
              <SelectItem value="bundles">PR Bundles ({tabCounts.bundles})</SelectItem>
              <SelectItem value="print">Print ({tabCounts.print})</SelectItem>
              <SelectItem value="digitaltv">Digital TV ({tabCounts.digitaltv})</SelectItem>
              <SelectItem value="broadcasttv">Broadcast TV ({tabCounts.broadcasttv})</SelectItem>
              <SelectItem value="socialpost">Social Post ({tabCounts.socialpost})</SelectItem>
              <SelectItem value="starter">Starter ($97) ({tabCounts.starter})</SelectItem>
            </SelectContent>
          </Select>
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
                          onUpdate={refreshPublications}
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

            {/* No results found message */}
            {filteredPublications.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground mb-4">
                  No publications found matching your criteria
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setActiveTab('all');
                    setPriceRange('all');
                    setIndustryFilter('all');
                    setSortBy('popularity');
                  }}
                  variant="outline"
                  className="min-w-[200px]"
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>

          {/* Mobile-Optimized Checkout Sidebar */}
          <div className="lg:w-80">
            <Card className="sticky top-4 lg:top-24 bg-gradient-card">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center mb-4">
                  <ShoppingCart className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
                  <h3 className="text-base lg:text-lg font-semibold">
                    Selected ({selectedPublications.length})
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