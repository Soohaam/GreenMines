import { useState } from "react";
import {
  LineChartIcon as ChartLineUp,
  Brain,
  BotIcon as Robot,
  FileCheckIcon as FileReport,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button"; // Shadcn/ui Button
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Shadcn/ui Card
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"; // Shadcn/ui HoverCard

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const features = [
    {
      icon: <Brain className="w-12 h-12 text-emerald-500" />,
      title: "ML Model Integration",
      description:
        "Our advanced machine learning algorithms analyze vast amounts of data to predict carbon emissions with unprecedented accuracy. Gain insights beyond traditional analytics to reduce your carbon footprint effectively.",
      image: "ml.jpg",
      route: "/predictions",
    },
    {
      icon: <Robot className="w-12 h-12 text-emerald-500" />,
      title: "Chat Bot & Gen AI",
      description:
        "Experience real-time assistance with our generative AI-powered chatbot. Get emission calculations, tailored recommendations, and answers to complex carbon management questions 24/7.",
      image: "ai.jpg",
      route: "/chatbot",
    },
    {
      icon: <ChartLineUp className="w-12 h-12 text-emerald-500" />,
      title: "Environment Prediction",
      description:
        "Forecast emission trends and environmental impacts with predictive analytics. Proactively adjust strategies to minimize your ecological footprint using historical data and advanced modeling.",
      image: "pre.jpg",
      route: "/predictions",
    },
    {
      icon: <FileReport className="w-12 h-12 text-emerald-500" />,
      title: "Report Generation",
      description:
        "Transform complex data into actionable insights with automated reports. Get detailed emission status updates and reduction recommendations for decision-making and compliance.",
      image: "report.jpg",
      route: "/environmental-reports",
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-emerald-500" />,
      title: "Neutrality Increment Points",
      description:
        "Gamify your carbon neutrality journey with points earned through emission-reducing measures. Track progress and showcase your sustainability commitment to stakeholders.",
      image: "net.jpg",
      route: "/neutralityoptions",
    },
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" },
    viewport: { once: true },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Features Section */}
      <section id="features" className="py-20 bg-[#342F49]">
        <div className="mx-auto max-w-[2000px] px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 text-center text-3xl font-bold text-[#66C5CC] sm:mb-16 sm:text-4xl lg:text-5xl"
          >
            Our Features
          </motion.h2>

          <div className="space-y-24 sm:space-y-32">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                {...fadeInUp}
                transition={{ ...fadeInUp.transition, delay: index * 0.2 }}
                className={`flex flex-col items-center justify-between gap-10 lg:flex-row${
                  index % 2 === 0 ? "" : "-reverse"
                }`}
              >
                {/* Image */}
                <div className="w-full lg:w-[45%]">
                  <motion.img
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    src={feature.image}
                    alt={feature.title}
                    className="h-[300px] w-full rounded-lg border border-[#66C5CC] object-cover shadow-lg sm:h-[400px] lg:h-[500px]"
                  />
                </div>

                {/* Feature Card */}
                <div className="w-full lg:w-[45%]">
                  <Card className="border-none bg-[#3A3550] shadow-xl transition-all hover:shadow-2xl">
                    <CardHeader>
                      <div className="flex items-center gap-6">
                        {feature.icon}
                        <CardTitle className="text-3xl font-semibold text-[#66C5CC] sm:text-4xl">
                          {feature.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <p className="text-lg leading-8 text-white sm:text-xl sm:leading-9">
                        {feature.description}
                      </p>
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button
                            variant="default"
                            size="lg"
                            className="rounded-md bg-[#66C5CC] px-8 py-3 text-base font-semibold text-[#342F49] transition-all hover:bg-[#4da5aa] sm:px-10 sm:py-4 sm:text-lg"
                            onClick={() => navigate(feature.route)}
                          >
                            Learn More
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent className="text-sm text-gray-700">
                          Explore how {feature.title.toLowerCase()} can benefit your sustainability goals!
                        </HoverCardContent>
                      </HoverCard>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}