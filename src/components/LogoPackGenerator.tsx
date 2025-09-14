import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, Search, ExternalLink } from 'lucide-react';
import { LogoLinkService } from '@/utils/logoLink';
import { useToast } from '@/hooks/use-toast';

interface LogoVariation {
  id: string;
  name: string;
  url: string;
  size: number;
  theme: 'light' | 'dark';
  type: 'icon' | 'logo' | 'symbol';
  format: 'png' | 'svg' | 'jpg';
}

export const LogoPackGenerator = () => {
  const [domain, setDomain] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<number[]>([64, 128, 256]);
  const [selectedThemes, setSelectedThemes] = useState<('light' | 'dark')[]>(['light', 'dark']);
  const [selectedTypes, setSelectedTypes] = useState<('icon' | 'logo' | 'symbol')[]>(['logo']);
  const [selectedFormats, setSelectedFormats] = useState<('png' | 'svg' | 'jpg')[]>(['png']);
  const [logoVariations, setLogoVariations] = useState<LogoVariation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const sizes = [16, 32, 64, 128, 256, 512];
  const themes = ['light', 'dark'] as const;
  const types = ['icon', 'logo', 'symbol'] as const;
  const formats = ['png', 'svg', 'jpg'] as const;

  const handleSizeToggle = (size: number) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const handleThemeToggle = (theme: 'light' | 'dark') => {
    setSelectedThemes(prev => 
      prev.includes(theme) 
        ? prev.filter(t => t !== theme)
        : [...prev, theme]
    );
  };

  const handleTypeToggle = (type: 'icon' | 'logo' | 'symbol') => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleFormatToggle = (format: 'png' | 'svg' | 'jpg') => {
    setSelectedFormats(prev => 
      prev.includes(format) 
        ? prev.filter(f => f !== format)
        : [...prev, format]
    );
  };

  const generateLogoPack = () => {
    if (!domain.trim()) {
      toast({
        title: "Domain Required",
        description: "Please enter a domain or company name.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    const variations: LogoVariation[] = [];

    selectedSizes.forEach(size => {
      selectedThemes.forEach(theme => {
        selectedTypes.forEach(type => {
          selectedFormats.forEach(format => {
            const url = LogoLinkService.getLogoLinkUrl(domain, {
              size,
              theme,
              type,
              format
            });
            
            if (url) {
              variations.push({
                id: `${size}-${theme}-${type}-${format}`,
                name: `${type}-${theme}-${size}px.${format}`,
                url,
                size,
                theme,
                type,
                format
              });
            }
          });
        });
      });
    });

    setLogoVariations(variations);
    setIsGenerating(false);
    
    toast({
      title: "Logo Pack Generated",
      description: `Generated ${variations.length} logo variations for ${domain}`,
    });
  };

  const downloadLogo = (variation: LogoVariation) => {
    const link = document.createElement('a');
    link.href = variation.url;
    link.download = variation.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllLogos = async () => {
    if (logoVariations.length === 0) return;

    toast({
      title: "Download Started",
      description: "Downloading all logo variations...",
    });

    // Download each logo individually (ZIP creation would require additional implementation)
    logoVariations.forEach((variation, index) => {
      setTimeout(() => downloadLogo(variation), index * 200);
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Logo Pack Generator
          </CardTitle>
          <CardDescription>
            Generate professional logo packs with multiple sizes, themes, and formats
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Domain Input */}
          <div className="space-y-2">
            <Label htmlFor="domain">Domain or Company Name</Label>
            <div className="flex gap-2">
              <Input
                id="domain"
                placeholder="example.com or Apple"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && generateLogoPack()}
              />
              <Button onClick={generateLogoPack} disabled={isGenerating}>
                <Search className="w-4 h-4 mr-2" />
                Generate
              </Button>
            </div>
          </div>

          {/* Size Selection */}
          <div className="space-y-3">
            <Label>Logo Sizes (px)</Label>
            <div className="flex flex-wrap gap-2">
              {sizes.map(size => (
                <div key={size} className="flex items-center space-x-2">
                  <Checkbox
                    id={`size-${size}`}
                    checked={selectedSizes.includes(size)}
                    onCheckedChange={() => handleSizeToggle(size)}
                  />
                  <Label htmlFor={`size-${size}`} className="text-sm">
                    {size}px
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Theme Selection */}
          <div className="space-y-3">
            <Label>Themes</Label>
            <div className="flex gap-4">
              {themes.map(theme => (
                <div key={theme} className="flex items-center space-x-2">
                  <Checkbox
                    id={`theme-${theme}`}
                    checked={selectedThemes.includes(theme)}
                    onCheckedChange={() => handleThemeToggle(theme)}
                  />
                  <Label htmlFor={`theme-${theme}`} className="text-sm capitalize">
                    {theme}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Type Selection */}
          <div className="space-y-3">
            <Label>Logo Types</Label>
            <div className="flex gap-4">
              {types.map(type => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type}`}
                    checked={selectedTypes.includes(type)}
                    onCheckedChange={() => handleTypeToggle(type)}
                  />
                  <Label htmlFor={`type-${type}`} className="text-sm capitalize">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Format Selection */}
          <div className="space-y-3">
            <Label>File Formats</Label>
            <div className="flex gap-4">
              {formats.map(format => (
                <div key={format} className="flex items-center space-x-2">
                  <Checkbox
                    id={`format-${format}`}
                    checked={selectedFormats.includes(format)}
                    onCheckedChange={() => handleFormatToggle(format)}
                  />
                  <Label htmlFor={`format-${format}`} className="text-sm uppercase">
                    {format}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generated Logos */}
      {logoVariations.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Generated Logo Pack</CardTitle>
                <CardDescription>
                  {logoVariations.length} variations for {domain}
                </CardDescription>
              </div>
              <Button onClick={downloadAllLogos}>
                <Download className="w-4 h-4 mr-2" />
                Download All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {logoVariations.map(variation => (
                <Card key={variation.id} className="p-4">
                  <div className="space-y-3">
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      <img
                        src={variation.url}
                        alt={variation.name}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="secondary" className="text-xs">
                          {variation.size}px
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {variation.theme}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {variation.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {variation.format.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadLogo(variation)}
                          className="flex-1"
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(variation.url, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};