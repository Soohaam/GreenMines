import React, { useState, useEffect } from "react";
import { HashLink } from "react-router-hash-link";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Menu, User, X } from 'lucide-react';
import logo from "./logo.png";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navigation = [
  { name: "Home", href: "/" },
  { name: "DashBoard", href: "/dashboard" },
  { name: "Carbon Footprint", href: "/emission" },
  { name: "Neutrality", href: "/neutralityoptions" },
];

function Navbar({ className }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [navs, setNavs] = useState(navigation);

  useEffect(() => {
    const updatedNavs = navigation.map(nav => ({
      ...nav,
      current: location.pathname === nav.href
    }));
    setNavs(updatedNavs);
  }, [location.pathname]);

  const handleSignOut = () => {
    console.log("Signing out...");
  };

  const navigationMenuItemClasses = "flex";
  
  const navigationMenuLinkClasses = (current) => cn(
    "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-6 text-lg font-medium transition-colors focus:outline-none focus:bg-transparent disabled:pointer-events-none disabled:opacity-50",
    current 
      ? "text-transparent bg-clip-text bg-gradient-to-br from-[#6664F1] to-[#C94AF0]" 
      : "text-gray-300 hover:text-white hover:scale-110 ease-in duration-200"
  );

  const mobileNavItemClasses = (current) => cn(
    "flex w-full items-center rounded-md p-3 text-lg font-medium",
    current
      ? "bg-[#342F49] text-[#66C5CC]"
      : "text-[#66C5CC] hover:bg-[#342F49] hover:text-white"
  );

  return (
    <nav className={`bg-transparent ${className}`}>
      <div className="w-full px-4">
        <div className="relative flex items-center justify-between h-20 max-w-screen-2xl mx-auto sm:mt-4 mt-8">
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-700">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open main menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-[#2B263F] border-r border-[#342F49] p-0">
                <div className="flex flex-col space-y-2 py-6">
                  {navs.map((item) => (
                    <HashLink
                      key={item.name}
                      to={item.href}
                      className={mobileNavItemClasses(item.current)}
                    >
                      {item.name}
                    </HashLink>
                  ))}
                  <HashLink to="/profile" className={mobileNavItemClasses(false)}>
                    Profile
                  </HashLink>
                  <HashLink to="/predictions" className={mobileNavItemClasses(false)}>
                    Predictions
                  </HashLink>
                  <HashLink to="/routing" className={mobileNavItemClasses(false)}>
                    Route
                  </HashLink>
                  <button onClick={handleSignOut} className={cn(mobileNavItemClasses(false), "text-left")}>
                    Logout
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src={logo}
              alt="Logo"
              className="h-10 w-auto cursor-pointer"
              onClick={() => navigate("/")}
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-grow justify-center">
            <NavigationMenu className="mx-auto">
              <NavigationMenuList className="flex space-x-24">
                {navs.map((item) => (
                  <NavigationMenuItem key={item.name} className={navigationMenuItemClasses}>
                    <HashLink to={item.href}>
                      <NavigationMenuLink className={navigationMenuLinkClasses(item.current)}>
                        {item.name}
                      </NavigationMenuLink>
                    </HashLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Profile Dropdown */}
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200">
                  <User className="h-8 w-8" />
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#342F49] border-[#342F49] min-w-[240px]">
                <DropdownMenuItem 
                  className="text-[#66C5CC] hover:bg-gradient-to-br hover:from-[#6664F1] hover:to-[#C94AF0] hover:text-white py-3 px-6 text-base cursor-pointer"
                  onClick={() => navigate("/profile")}
                >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-[#66C5CC] hover:bg-gradient-to-br hover:from-[#6664F1] hover:to-[#C94AF0] hover:text-white py-3 px-6 text-base cursor-pointer"
                  onClick={() => navigate("/predictions")}
                >
                  Predictions
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-[#66C5CC] hover:bg-gradient-to-br hover:from-[#6664F1] hover:to-[#C94AF0] hover:text-white py-3 px-6 text-base cursor-pointer"
                  onClick={() => navigate("/routing")}
                >
                  Route
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-[#66C5CC] hover:bg-gradient-to-br hover:from-[#6664F1] hover:to-[#C94AF0] hover:text-white py-3 px-6 text-base cursor-pointer"
                  onClick={() => window.location.href = "http://localhost:8080/simulation"}
                >
                  Simulation
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-[#66C5CC] hover:bg-gradient-to-br hover:from-[#6664F1] hover:to-[#C94AF0] hover:text-white py-3 px-6 text-base cursor-pointer"
                  onClick={handleSignOut}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;