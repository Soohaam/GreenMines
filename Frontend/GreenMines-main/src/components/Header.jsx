import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button"; // Shadcn/ui Button
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Shadcn/ui Card
import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card"; // Shadcn/ui HoverCard
import Navbar from "./Navbar";

function Header() {
  const navigate = useNavigate();
  const ref = useRef(null);

  const fadeIn = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.5, ease: "easeInOut" },
  };

  const [videoOpacity, setVideoOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fadeStart = windowHeight / 2;
      const fadeEnd = windowHeight;
      const newOpacity = Math.max(
        0,
        1 - Math.max((scrollTop - fadeStart) / (fadeEnd - fadeStart), 0)
      );
      setVideoOpacity(newOpacity);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-[#71669b] to-[#746a9b] px-4 sm:px-6 lg:px-10">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{ opacity: videoOpacity }}
        className="absolute left-0 top-0 h-full w-full object-cover transition-opacity duration-300"
      >
        <source src="MyVideo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col bg-black bg-opacity-50">
        <Navbar className="z-50" />

        {/* Main Content */}
        <div className="flex flex-grow flex-col items-center justify-center px-4 py-8 sm:px-6 md:px-10 md:py-20">
          <motion.div
            ref={ref}
            initial="initial"
            animate="animate"
            variants={fadeIn}
            className="mx-auto max-w-4xl text-center"
          >
            {/* Card for Header Content */}
            <Card className="border-none bg-transparent shadow-none">
              <CardHeader>
                <CardTitle className="mb-4 text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
                  Tackling Climate Change with{" "}
                  <span className="bg-gradient-to-br from-[#66C5CC] to-[#009688] bg-clip-text text-transparent">
                    CARBON
                  </span>{" "}
                  Solutions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-6 text-sm leading-relaxed text-gray-200 sm:mb-8 sm:text-base md:text-lg lg:text-xl">
                  GREENMINES provides innovative solutions to reduce carbon emissions
                  and promote sustainability. Join us in building a greener future.
                </p>

                {/* Enhanced Button */}
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button
                      variant="default"
                      size="lg"
                      className="w-full rounded-full bg-[#009688] px-7 py-3 text-sm font-semibold tracking-wider text-white transition-all hover:bg-[#00796B] sm:w-auto sm:text-base md:text-lg"
                      onClick={() => {
                        navigate("/dashboard");
                        console.log("Button clicked!");
                      }}
                    >
                      Get Started Now
                    </Button>
                  </HoverCardTrigger>
      
                </HoverCard>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Animated Sign-In Button */}
        <motion.div
          initial={{
            opacity: 0,
            y: -50,
            scale: 0.5,
            rotateX: -180,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 10,
              delay: 0.3,
            },
          }}
          whileHover={{
            scale: 1.1,
            rotate: [0, -5, 5, -5, 5, 0],
            transition: {
              duration: 0.4,
              type: "spring",
              stiffness: 300,
            },
          }}
          whileTap={{
            scale: 0.95,
            boxShadow: "0px 0px 20px rgba(102, 197, 204, 0.6)",
          }}
          className="fixed right-4 top-4 z-50 sm:right-6"
        >
          
        </motion.div>
      </div>
    </div>
  );
}

export default Header;