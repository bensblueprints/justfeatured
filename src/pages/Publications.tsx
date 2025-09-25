import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Slider } from "@/components/ui/slider";
import { Search, Star, ExternalLink, Image, FileText, Heart, Clock, MapPin, ShoppingCart } from "lucide-react";
import { fetchPublications } from "@/lib/publications";
import { usePublicationsSync } from "@/hooks/usePublicationsSync";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useCart } from "@/hooks/useCart";
import { Publication, CartItem } from "@/types";
import { ProtectedInteraction } from "@/components/ProtectedInteraction";
import { SpreadsheetSync } from "@/components/SpreadsheetSync";

export const Publications = () => {
  const navigate = useNavigate();
  const { selectedPublications, toggleCart } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("price-asc");
  const [activeTab, setActiveTab] = useState("publications");
  const [priceRange, setPriceRange] = useState<number[]>([85000]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [typeFilters, setTypeFilters] = useState<string[]>([]);
  const [sponsoredFilter, setSponsoredFilter] = useState<string>("all");
  const [dofollowFilter, setDofollowFilter] = useState<string>("all");
  const [indexedFilter, setIndexedFilter] = useState<string>("all");

  // Use real-time publications sync and admin check
  const { publications, loading, refreshPublications } = usePublicationsSync();
  const { isAdmin } = useAdminCheck();

  const filteredPublications = useMemo(() => {
    if (loading || publications.length === 0) {
      return [];
    }
    
    let filtered = publications.filter(pub => pub.is_active !== false);

    // Filter by tab category
    if (activeTab !== "publications") {
      switch (activeTab) {
        case "broadcasttv":
          filtered = filtered.filter(pub => pub.category?.toLowerCase().includes('broadcast'));
          break;
        case "digitaltv":
          filtered = filtered.filter(pub => pub.category?.toLowerCase().includes('digital') || pub.category?.toLowerCase().includes('tv'));
          break;
        case "listicles":
          filtered = filtered.filter(pub => pub.category?.toLowerCase().includes('listicle'));
          break;
        case "bestsellers":
          filtered = filtered.filter(pub => pub.popularity > 70);
          break;
        case "bundles":
          filtered = filtered.filter(pub => pub.category?.toLowerCase().includes('bundle'));
          break;
        case "print":
          filtered = filtered.filter(pub => pub.category?.toLowerCase().includes('print'));
          break;
        case "socialpost":
          filtered = filtered.filter(pub => pub.category?.toLowerCase().includes('social'));
          break;
      }
    }

    // Filter by price range
    const maxPrice = priceRange[0];
    filtered = filtered.filter(pub => Number(pub.price) <= maxPrice);

    // Filter by genres
    if (selectedGenres.length > 0) {
      filtered = filtered.filter(pub => 
        selectedGenres.some(genre => 
          pub.category.toLowerCase().includes(genre.toLowerCase()) ||
          pub.type?.toLowerCase().includes(genre.toLowerCase())
        )
      );
    }

    // Filter by regions
    if (selectedRegions.length > 0) {
      filtered = filtered.filter(pub => 
        selectedRegions.some(region => 
          pub.location?.toLowerCase().includes(region.toLowerCase())
        )
      );
    }

    // Filter by sponsored
    if (sponsoredFilter !== "all") {
      const isSponsored = sponsoredFilter === "yes";
      filtered = filtered.filter(pub => pub.sponsored === isSponsored);
    }

    // Filter by dofollow
    if (dofollowFilter !== "all") {
      const isDofollow = dofollowFilter === "yes";
      filtered = filtered.filter(pub => pub.dofollow_link === isDofollow);
    }

    // Filter by indexed
    if (indexedFilter !== "all") {
      const isIndexed = indexedFilter === "yes";
      filtered = filtered.filter(pub => pub.indexed === isIndexed);
    }

    // Search filter
    if (searchTerm) {
      const normalizedSearch = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(pub =>
        pub.name.toLowerCase().includes(normalizedSearch) ||
        pub.category.toLowerCase().includes(normalizedSearch) ||
        pub.location?.toLowerCase().includes(normalizedSearch)
      );
    }

    // Sort
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return b.popularity - a.popularity;
      }
    });

    return filtered;
  }, [searchTerm, sortBy, activeTab, priceRange, selectedGenres, selectedRegions, sponsoredFilter, dofollowFilter, indexedFilter, publications, loading]);

  const genres = ["Music", "News", "Lifestyle", "Entertainment", "Business", "Tech", "Web 3", "Luxury", "Fashion", "Real Estate", "Sports", "Gaming", "Political", "Legal", "Alcohol"];
  const regions = ["United States", "California", "New York", "Global", "UK", "Canada", "Australia"];
  const typeOptions = ["Staff", "New", "Press Release", "Contributor", "On Hold", "6 Month Lifespan", "Raised"];

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const toggleRegion = (region: string) => {
    setSelectedRegions(prev => 
      prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]
    );
  };

  const selectedTotal = useMemo(() => {
    return selectedPublications.reduce((total, id) => {
      const pub = publications.find(p => p.id === id);
      return total + (pub?.price || 0);
    }, 0);
  }, [selectedPublications, publications]);

  const handleSelectionChange = (publicationId: string, selected: boolean) => {
    toggleCart(publicationId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Top Header Section */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">PRICING (ASCEND PR)</h1>
              <p className="text-sm text-muted-foreground">
                Once we have published the article on any further edits may include an extra charge.<br/>
                Ascend Agency will use reasonable good faith efforts to ensure that such article will remain publicly available in the applicable publication for at least 12 months.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="destructive" size="sm">Video Tutorial</Button>
              <Button variant="destructive" size="sm">How To</Button>
              <Button variant="destructive" size="sm">Download PR Questionnaire</Button>
              <Button variant="destructive" size="sm">Download TV Questionnaire</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 h-auto p-0 bg-transparent">
              <TabsTrigger value="publications" className="data-[state=active]:bg-red-500 data-[state=active]:text-white rounded-none border-0 px-3 py-2">
                PUBLICATIONS
              </TabsTrigger>
              <TabsTrigger value="broadcasttv" className="data-[state=active]:bg-red-500 data-[state=active]:text-white rounded-none border-0 px-3 py-2">
                BROADCAST TELEVISION
              </TabsTrigger>
              <TabsTrigger value="digitaltv" className="data-[state=active]:bg-red-500 data-[state=active]:text-white rounded-none border-0 px-3 py-2 relative">
                DIGITAL TELEVISION
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded">NEW</span>
              </TabsTrigger>
              <TabsTrigger value="listicles" className="data-[state=active]:bg-red-500 data-[state=active]:text-white rounded-none border-0 px-3 py-2">
                LISTICLES
              </TabsTrigger>
              <TabsTrigger value="bestsellers" className="data-[state=active]:bg-red-500 data-[state=active]:text-white rounded-none border-0 px-3 py-2">
                BEST SELLERS
              </TabsTrigger>
              <TabsTrigger value="bundles" className="data-[state=active]:bg-red-500 data-[state=active]:text-white rounded-none border-0 px-3 py-2">
                PR BUNDLES
              </TabsTrigger>
              <TabsTrigger value="print" className="data-[state=active]:bg-red-500 data-[state=active]:text-white rounded-none border-0 px-3 py-2">
                PRINT
              </TabsTrigger>
              <TabsTrigger value="socialpost" className="data-[state=active]:bg-red-500 data-[state=active]:text-white rounded-none border-0 px-3 py-2">
                SOCIAL POST
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Left Sidebar Filters */}
          <div className="w-80 space-y-6">
            {/* Publication Name Search */}
            <div>
              <h3 className="font-medium mb-2">Publication name</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search publication name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="font-medium mb-2">Price range</h3>
              <div className="px-2">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={85000}
                  min={0}
                  step={100}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>$0</span>
                  <span>${priceRange[0].toLocaleString()}</span>
                  <span>$85,000</span>
                </div>
              </div>
            </div>

            {/* Sort By */}
            <div>
              <h3 className="font-medium mb-2">Sort by</h3>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Price (Asc)" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border shadow-lg z-50">
                  <SelectItem value="price-asc">Price (Asc)</SelectItem>
                  <SelectItem value="price-desc">Price (Desc)</SelectItem>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Select Regions */}
            <div>
              <h3 className="font-medium mb-2">Select regions</h3>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select regions" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border shadow-lg z-50">
                  {regions.map(region => (
                    <SelectItem key={region} value={region.toLowerCase()}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Select Genres */}
            <div>
              <h3 className="font-medium mb-2">Select genres</h3>
              <div className="flex flex-wrap gap-2">
                {genres.map(genre => (
                  <Badge
                    key={genre}
                    variant={selectedGenres.includes(genre) ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => toggleGenre(genre)}
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Type */}
            <div>
              <h3 className="font-medium mb-2">Type</h3>
              <div className="flex flex-wrap gap-2">
                {typeOptions.map(type => (
                  <Badge
                    key={type}
                    variant="secondary"
                    className="cursor-pointer"
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Sponsored */}
            <div>
              <h3 className="font-medium mb-2">Sponsored</h3>
              <div className="flex gap-2">
                {["Yes", "No", "Discrete"].map(option => (
                  <Badge
                    key={option}
                    variant={sponsoredFilter === option.toLowerCase() ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => setSponsoredFilter(option.toLowerCase())}
                  >
                    {option}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Do follow */}
            <div>
              <h3 className="font-medium mb-2">Do follow</h3>
              <div className="flex gap-2">
                {["Yes", "No"].map(option => (
                  <Badge
                    key={option}
                    variant={dofollowFilter === option.toLowerCase() ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => setDofollowFilter(option.toLowerCase())}
                  >
                    {option}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Indexed */}
            <div>
              <h3 className="font-medium mb-2">Indexed</h3>
              <div className="flex gap-2">
                {["Yes", "No"].map(option => (
                  <Badge
                    key={option}
                    variant={indexedFilter === option.toLowerCase() ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => setIndexedFilter(option.toLowerCase())}
                  >
                    {option}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="mb-4">
              <p className="font-medium">SHOWING {filteredPublications.length} OF {publications.length} PUBLICATIONS</p>
            </div>

            {/* Publications Table */}
            <div className="bg-background border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-red-500 font-medium">PUBLICATION</TableHead>
                    <TableHead className="text-red-500 font-medium">GENRES</TableHead>
                    <TableHead className="text-red-500 font-medium">PRICE</TableHead>
                    <TableHead className="text-red-500 font-medium">DA</TableHead>
                    <TableHead className="text-red-500 font-medium">DR</TableHead>
                    <TableHead className="text-red-500 font-medium">TAT</TableHead>
                    <TableHead className="text-red-500 font-medium">REGION</TableHead>
                    <TableHead className="text-red-500 font-medium">SPONSORED</TableHead>
                    <TableHead className="text-red-500 font-medium">INDEXED</TableHead>
                    <TableHead className="text-red-500 font-medium">DO FOLLOW</TableHead>
                    <TableHead className="text-red-500 font-medium">EXAMPLE</TableHead>
                    <TableHead className="text-red-500 font-medium">IMAGE</TableHead>
                    <TableHead className="text-red-500 font-medium">NICHES</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPublications.map((publication) => (
                    <TableRow key={publication.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-sm font-bold">
                            {publication.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{publication.name}</div>
                          </div>
                          <Star className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant="outline" className="text-xs">
                            {publication.category}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        ${publication.price}
                      </TableCell>
                      <TableCell>
                        {publication.da_score || 0}
                      </TableCell>
                      <TableCell>
                        {publication.dr_score || 0}
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          {publication.tat_days || "1 Day"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center text-sm">
                          {publication.location || "Global"}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {publication.sponsored ? "Yes" : "No"}
                      </TableCell>
                      <TableCell className="text-center">
                        {publication.indexed ? "Yes" : "No"}
                      </TableCell>
                      <TableCell className="text-center">
                        {publication.dofollow_link ? "Yes" : "No"}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Image className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Star className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Clock className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <MapPin className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* No Results Message */}
        {filteredPublications.length === 0 && !loading && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No publications found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms</p>
            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setActiveTab("publications");
              setPriceRange([85000]);
              setSelectedGenres([]);
              setSelectedRegions([]);
              setSponsoredFilter("all");
              setDofollowFilter("all");
              setIndexedFilter("all");
            }}>
              Reset Filters
            </Button>
          </div>
        )}

        {/* Admin Tools */}
        {isAdmin && (
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Admin Tools</h3>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/admin/setup')}
              >
                Admin Panel
              </Button>
              <SpreadsheetSync />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};