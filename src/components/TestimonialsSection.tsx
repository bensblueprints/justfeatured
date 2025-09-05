import { Card, CardContent } from "@/components/ui/card";

export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Marissa",
      quote: "In Less Than a Week, I was Featured in FOX, ABC, NBC, & CBS! I highly recommend to anybody looking to build their brand and grow their company.",
      image: "/lovable-uploads/2788bde6-9ec5-4cc5-8442-bcd3383393a7.png"
    },
    {
      name: "John Bryson", 
      quote: "Startup here in Atlanta. They got us featured in Fox, NBC, ABC, CBS, the list goes on. Definitely worth every penny.",
      image: "/lovable-uploads/d67272ed-5e4e-43d7-9b83-5292aed1e0c3.png"
    },
    {
      name: "MJ Wolfe",
      quote: "In less than a week, got me featured in tons of news outlets, including Fox, ABC, NBC, & CBS. Highly recommend them to anyone."
    },
    {
      name: "Paul Loubao",
      quote: "They've been fantastic, professional. They did what they promised. They gave me an article on different outlets like Fox and CNBC."
    },
    {
      name: "Lawrence Bierria", 
      quote: "In under a week, they were able to do something I struggled to do for months, which was get published in news outlets."
    },
    {
      name: "Adam Levine",
      quote: "They got me featured in NBC, CBS, and Associated Press. I don't think you'll find a company that could compete with what they're offering."
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            TESTIMONIALS
          </h2>
          <p className="text-xl text-muted-foreground">
            Join 1,000+ happy customers who have been featured and grew their business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-gradient-card">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full mx-auto mb-4 overflow-hidden">
                    {testimonial.image ? (
                      <img 
                        src={testimonial.image} 
                        alt={`${testimonial.name} testimonial`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-xl font-bold">{testimonial.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold mb-4">{testimonial.name}</h3>
                  <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};