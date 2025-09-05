import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "The Trust Factor: How Media Coverage Transforms Brand Perception",
    excerpt: "Discover how third-party validation through press coverage creates instant credibility and builds consumer trust at scale.",
    category: "Psychology",
    readTime: "5 min read",
    author: "Sarah Mitchell",
    date: "Dec 15, 2024",
    image: "/api/placeholder/400/240"
  },
  {
    id: 2,
    title: "Social Proof in Action: Why Press Coverage Drives Customer Behavior",
    excerpt: "Learn how media mentions trigger powerful psychological responses that influence purchasing decisions and brand loyalty.",
    category: "Marketing",
    readTime: "7 min read",
    author: "David Chen",
    date: "Dec 12, 2024",
    image: "/api/placeholder/400/240"
  },
  {
    id: 3,
    title: "The Authority Effect: Building Instant Credibility Through Media",
    excerpt: "Explore the science behind why consumers perceive brands with press coverage as more authoritative and trustworthy.",
    category: "Branding",
    readTime: "6 min read",
    author: "Emily Rodriguez",
    date: "Dec 10, 2024",
    image: "/api/placeholder/400/240"
  },
  {
    id: 4,
    title: "From Unknown to Industry Leader: The PR Transformation Journey",
    excerpt: "Real case studies showing how strategic press coverage catapults businesses from obscurity to market leadership.",
    category: "Case Study",
    readTime: "8 min read",
    author: "Michael Johnson",
    date: "Dec 8, 2024",
    image: "/api/placeholder/400/240"
  },
  {
    id: 5,
    title: "The Halo Effect: How One Article Can Change Everything",
    excerpt: "Understanding how a single strategic media placement can create a ripple effect across your entire business.",
    category: "Strategy",
    readTime: "4 min read",
    author: "Lisa Wang",
    date: "Dec 5, 2024",
    image: "/api/placeholder/400/240"
  },
  {
    id: 6,
    title: "Consumer Psychology: Why We Trust What We Read in the News",
    excerpt: "Deep dive into the cognitive biases that make media coverage such a powerful influence on consumer decision-making.",
    category: "Psychology",
    readTime: "9 min read",
    author: "Dr. James Foster",
    date: "Dec 3, 2024",
    image: "/api/placeholder/400/240"
  }
];

export const BlogCarousel = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Insights & Research
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            The Psychology of <span className="text-primary">Press & Credibility</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the science behind why media coverage transforms businesses and builds unshakeable consumer trust
          </p>
        </div>

        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {blogPosts.map((post) => (
                <CarouselItem key={post.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 group">
                    <div className="aspect-video w-full bg-gradient-to-br from-primary/10 to-primary/5 rounded-t-lg mb-4 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <Badge variant="secondary" className="text-xs">
                          {post.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="text-sm line-clamp-3">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{post.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>

        <div className="text-center mt-8">
          <p className="text-muted-foreground">
            Want to leverage the psychology of press for your business?{" "}
            <span className="text-primary font-semibold cursor-pointer hover:underline">
              Start your journey today →
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};