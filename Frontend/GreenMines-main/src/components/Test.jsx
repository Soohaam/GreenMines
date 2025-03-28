"use client"

import React, { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose } from "@/components/ui/toast"
import { Toggle } from "@/components/ui/toggle"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ChevronRight, Layers, Layout, Palette, Settings, Sparkles } from "lucide-react"

const formSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
})

function ComponentShowcase() {
  const [isOpen, setIsOpen] = useState(false)
  const [progress, setProgress] = useState(50)
  const [toastOpen, setToastOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("inputs")
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "" },
  })

  // Simulate progress animation
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(progress >= 100 ? 0 : progress + 10)
    }, 1000)
    return () => clearTimeout(timer)
  }, [progress])

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-slate-950 dark:to-indigo-950">
        <header className="sticky top-0 z-10 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-violet-600 dark:text-violet-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 text-transparent bg-clip-text">
                UI Component Gallery
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex"
                onClick={() => document.documentElement.classList.toggle("dark")}
              >
                Toggle Theme
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
              >
                Get Started
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
            {/* Sidebar Navigation */}
            <aside className="hidden lg:block">
              <Card className="sticky top-24">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Components</CardTitle>
                  <CardDescription>Browse all UI components</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <NavigationMenu orientation="vertical" className="w-full max-w-none">
                    <NavigationMenuList className="flex flex-col space-y-1 p-2">
                      {[
                        { id: "inputs", label: "Inputs & Controls", icon: <Settings className="h-4 w-4 mr-2" /> },
                        { id: "feedback", label: "Feedback", icon: <Sparkles className="h-4 w-4 mr-2" /> },
                        { id: "layout", label: "Layout", icon: <Layout className="h-4 w-4 mr-2" /> },
                        { id: "navigation", label: "Navigation", icon: <ChevronRight className="h-4 w-4 mr-2" /> },
                        { id: "display", label: "Display", icon: <Layers className="h-4 w-4 mr-2" /> },
                        { id: "theming", label: "Theming", icon: <Palette className="h-4 w-4 mr-2" /> },
                      ].map((item) => (
                        <NavigationMenuItem key={item.id} className="w-full">
                          <Button
                            variant={activeTab === item.id ? "secondary" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => setActiveTab(item.id)}
                          >
                            {item.icon}
                            {item.label}
                          </Button>
                        </NavigationMenuItem>
                      ))}
                    </NavigationMenuList>
                  </NavigationMenu>
                </CardContent>
              </Card>
            </aside>

            {/* Mobile Navigation */}
            <div className="lg:hidden mb-6">
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full grid grid-cols-3 mb-4">
                  <TabsTrigger value="inputs">Inputs</TabsTrigger>
                  <TabsTrigger value="feedback">Feedback</TabsTrigger>
                  <TabsTrigger value="layout">Layout</TabsTrigger>
                </TabsList>
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="navigation">Navigation</TabsTrigger>
                  <TabsTrigger value="display">Display</TabsTrigger>
                  <TabsTrigger value="theming">Theming</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Main Content */}
            <div className="space-y-8">
              {/* Inputs & Controls Section */}
              {activeTab === "inputs" && (
                <section className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    <h2 className="text-2xl font-bold">Inputs & Controls</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Input */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Input</CardTitle>
                        <CardDescription>A basic input component</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Input placeholder="Type here..." className="mb-2" />
                        <div className="flex items-center gap-2 mt-4">
                          <Label htmlFor="test-input">With Label</Label>
                          <Input id="test-input" placeholder="Labeled input" />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Button */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Button</CardTitle>
                        <CardDescription>Interactive button elements</CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-wrap gap-2">
                        <Button variant="default">Default</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="link">Link</Button>
                        <Button variant="destructive">Destructive</Button>
                      </CardContent>
                    </Card>

                    {/* Checkbox */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Checkbox</CardTitle>
                        <CardDescription>Select multiple values</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="check1" />
                          <Label htmlFor="check1">Accept terms</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="check2" defaultChecked />
                          <Label htmlFor="check2">Remember me</Label>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Radio Group */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Radio Group</CardTitle>
                        <CardDescription>Select a single value</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <RadioGroup defaultValue="option-one">
                          <div className="flex items-center space-x-2 mb-2">
                            <RadioGroupItem value="option-one" id="r1" />
                            <Label htmlFor="r1">Option One</Label>
                          </div>
                          <div className="flex items-center space-x-2 mb-2">
                            <RadioGroupItem value="option-two" id="r2" />
                            <Label htmlFor="r2">Option Two</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="option-three" id="r3" />
                            <Label htmlFor="r3">Option Three</Label>
                          </div>
                        </RadioGroup>
                      </CardContent>
                    </Card>

                    {/* Select */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Select</CardTitle>
                        <CardDescription>Dropdown selection</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Select>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="option1">Option 1</SelectItem>
                            <SelectItem value="option2">Option 2</SelectItem>
                            <SelectItem value="option3">Option 3</SelectItem>
                          </SelectContent>
                        </Select>
                      </CardContent>
                    </Card>

                    {/* Slider */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Slider</CardTitle>
                        <CardDescription>Select a value from a range</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Slider defaultValue={[33]} max={100} step={1} className="w-full" />
                      </CardContent>
                    </Card>

                    {/* Switch */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Switch</CardTitle>
                        <CardDescription>Toggle between states</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="switch1">Airplane Mode</Label>
                          <Switch id="switch1" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="switch2">Notifications</Label>
                          <Switch id="switch2" defaultChecked />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Textarea */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Textarea</CardTitle>
                        <CardDescription>Multi-line text input</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Textarea placeholder="Type your message here..." />
                      </CardContent>
                    </Card>
                  </div>
                </section>
              )}

              {/* Feedback Section */}
              {activeTab === "feedback" && (
                <section className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    <h2 className="text-2xl font-bold">Feedback</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Alert */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Alert</CardTitle>
                        <CardDescription>Displays important messages</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Alert className="border-violet-200 bg-violet-50 dark:border-violet-900 dark:bg-violet-950">
                          <AlertTitle>Information</AlertTitle>
                          <AlertDescription>This is an informational alert</AlertDescription>
                        </Alert>
                        <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
                          <AlertTitle>Success</AlertTitle>
                          <AlertDescription>Your action was completed successfully</AlertDescription>
                        </Alert>
                      </CardContent>
                    </Card>

                    {/* Alert Dialog */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Alert Dialog</CardTitle>
                        <CardDescription>Modal for critical actions</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline">Open Alert Dialog</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </CardContent>
                    </Card>

                    {/* Toast */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Toast</CardTitle>
                        <CardDescription>Temporary notifications</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant="default" onClick={() => setToastOpen(true)}>
                          Show Toast
                        </Button>
                        <Toast open={toastOpen} onOpenChange={setToastOpen}>
                          <ToastTitle>Notification</ToastTitle>
                          <ToastDescription>Your action was completed successfully!</ToastDescription>
                          <ToastClose />
                        </Toast>
                      </CardContent>
                    </Card>

                    {/* Progress */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Progress</CardTitle>
                        <CardDescription>Shows completion status</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Progress value={progress} className="w-full mb-2" />
                        <p className="text-sm text-muted-foreground text-center">{progress}% Complete</p>
                      </CardContent>
                    </Card>

                    {/* Skeleton */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Skeleton</CardTitle>
                        <CardDescription>Loading placeholder</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                        <div className="flex items-center space-x-4 mt-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-4 w-[150px]" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </section>
              )}

              {/* Layout Section */}
              {activeTab === "layout" && (
                <section className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Layout className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    <h2 className="text-2xl font-bold">Layout</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Card</CardTitle>
                        <CardDescription>Container for related content</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>This is the main content area of the card.</p>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="ghost">Cancel</Button>
                        <Button>Save</Button>
                      </CardFooter>
                    </Card>

                    {/* Accordion */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Accordion</CardTitle>
                        <CardDescription>Collapsible content sections</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="item-1">
                            <AccordionTrigger>Section 1</AccordionTrigger>
                            <AccordionContent>
                              Content for section 1 goes here. You can add any information that belongs to this section.
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="item-2">
                            <AccordionTrigger>Section 2</AccordionTrigger>
                            <AccordionContent>
                              Content for section 2 goes here. This section can be expanded independently.
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="item-3">
                            <AccordionTrigger>Section 3</AccordionTrigger>
                            <AccordionContent>
                              Content for section 3 goes here. Accordions are great for FAQs and other grouped content.
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </CardContent>
                    </Card>

                    {/* Collapsible */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Collapsible</CardTitle>
                        <CardDescription>Simple toggle content</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
                          <CollapsibleTrigger asChild>
                            <Button variant="outline" className="w-full justify-between">
                              Toggle Content
                              <ChevronRight className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="p-4 mt-2 border rounded-md">
                            <p>This content can be shown or hidden with the toggle button above.</p>
                          </CollapsibleContent>
                        </Collapsible>
                      </CardContent>
                    </Card>

                    {/* Separator */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Separator</CardTitle>
                        <CardDescription>Visual divider between content</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p>Content above the separator</p>
                          <Separator className="my-4" />
                          <p>Content below the separator</p>
                          <div className="flex items-center gap-4 pt-4">
                            <div>Left</div>
                            <Separator orientation="vertical" className="h-4" />
                            <div>Right</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Tabs */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Tabs</CardTitle>
                        <CardDescription>Switch between content views</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Tabs defaultValue="tab1" className="w-full">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="tab1">Account</TabsTrigger>
                            <TabsTrigger value="tab2">Settings</TabsTrigger>
                            <TabsTrigger value="tab3">Profile</TabsTrigger>
                          </TabsList>
                          <TabsContent value="tab1" className="p-4 border rounded-md mt-2">
                            Account settings and preferences
                          </TabsContent>
                          <TabsContent value="tab2" className="p-4 border rounded-md mt-2">
                            Application settings and configuration
                          </TabsContent>
                          <TabsContent value="tab3" className="p-4 border rounded-md mt-2">
                            User profile information
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>

                    {/* ScrollArea */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Scroll Area</CardTitle>
                        <CardDescription>Custom scrollable container</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[150px] w-full rounded-md border p-4">
                          <div className="space-y-4">
                            {Array.from({ length: 15 }, (_, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-violet-500" />
                                <p>Scroll Item {i + 1}</p>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </div>
                </section>
              )}

              {/* Navigation Section */}
              {activeTab === "navigation" && (
                <section className="space-y-6">
                  <div className="flex items-center gap-2">
                    <ChevronRight className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    <h2 className="text-2xl font-bold">Navigation</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Navigation Menu */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Navigation Menu</CardTitle>
                        <CardDescription>Application navigation</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <NavigationMenu>
                          <NavigationMenuList>
                            <NavigationMenuItem>
                              <Button variant="ghost" asChild>
                                <NavigationMenuLink>Dashboard</NavigationMenuLink>
                              </Button>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                              <Button variant="ghost" asChild>
                                <NavigationMenuLink>Projects</NavigationMenuLink>
                              </Button>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                              <Button variant="ghost" asChild>
                                <NavigationMenuLink>Settings</NavigationMenuLink>
                              </Button>
                            </NavigationMenuItem>
                          </NavigationMenuList>
                        </NavigationMenu>
                      </CardContent>
                    </Card>

                    {/* Dropdown Menu */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Dropdown Menu</CardTitle>
                        <CardDescription>Contextual menu options</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline">Open Menu</Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuItem>Notifications</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500">Logout</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardContent>
                    </Card>

                    {/* Command */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Command</CardTitle>
                        <CardDescription>Command palette for quick actions</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Command className="rounded-lg border shadow-md">
                          <CommandInput placeholder="Type a command or search..." />
                          <CommandList>
                            <CommandItem className="flex items-center gap-2">
                              <span className="text-violet-500">→</span> New Project
                            </CommandItem>
                            <CommandItem className="flex items-center gap-2">
                              <span className="text-violet-500">→</span> Search Files
                            </CommandItem>
                            <CommandItem className="flex items-center gap-2">
                              <span className="text-violet-500">→</span> Recent Documents
                            </CommandItem>
                            <CommandItem className="flex items-center gap-2">
                              <span className="text-violet-500">→</span> System Settings
                            </CommandItem>
                          </CommandList>
                        </Command>
                      </CardContent>
                    </Card>
                  </div>
                </section>
              )}

              {/* Display Section */}
              {activeTab === "display" && (
                <section className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    <h2 className="text-2xl font-bold">Display</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   

                    {/* Badge */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Badge</CardTitle>
                        <CardDescription>Status indicators</CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-wrap gap-2">
                        <Badge>Default</Badge>
                        <Badge variant="secondary">Secondary</Badge>
                        <Badge variant="outline">Outline</Badge>
                        <Badge variant="destructive">Destructive</Badge>
                        <Badge className="bg-violet-500 hover:bg-violet-600">Custom</Badge>
                      </CardContent>
                    </Card>

                    {/* Hover Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Hover Card</CardTitle>
                        <CardDescription>Preview content on hover</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <Button variant="link">Hover for details</Button>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <div className="flex justify-between space-x-4">
                              <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                              </Avatar>
                              <div className="space-y-1">
                                <h4 className="text-sm font-semibold">@shadcn</h4>
                                <p className="text-sm">Creator of the shadcn/ui component library</p>
                                <div className="flex items-center pt-2">
                                  <span className="text-xs text-muted-foreground">Joined December 2021</span>
                                </div>
                              </div>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      </CardContent>
                    </Card>

                    {/* Table */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Table</CardTitle>
                        <CardDescription>Tabular data display</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Role</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>Alice Johnson</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  Active
                                </Badge>
                              </TableCell>
                              <TableCell>Admin</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Bob Smith</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                  Pending
                                </Badge>
                              </TableCell>
                              <TableCell>User</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Carol Davis</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                  Inactive
                                </Badge>
                              </TableCell>
                              <TableCell>Guest</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>

                    {/* Tooltip */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Tooltip</CardTitle>
                        <CardDescription>Contextual information</CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-wrap gap-4">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline">Hover Me</Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Helpful information appears here</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="secondary">Settings</Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Adjust your preferences</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </CardContent>
                    </Card>

                    {/* Dialog */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Dialog</CardTitle>
                        <CardDescription>Modal overlay for content</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline">Open Dialog</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Profile</DialogTitle>
                              <DialogDescription>
                                Make changes to your profile here. Click save when you're done.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                  Name
                                </Label>
                                <Input id="name" defaultValue="John Doe" className="col-span-3" />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="username" className="text-right">
                                  Username
                                </Label>
                                <Input id="username" defaultValue="@johndoe" className="col-span-3" />
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <Button type="submit">Save changes</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </CardContent>
                    </Card>
                  </div>
                </section>
              )}

              {/* Theming Section */}
              {activeTab === "theming" && (
                <section className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    <h2 className="text-2xl font-bold">Theming</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Color Palette */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Color Palette</CardTitle>
                        <CardDescription>Primary theme colors</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-5 gap-2">
                          {[
                            "bg-violet-50",
                            "bg-violet-100",
                            "bg-violet-200",
                            "bg-violet-300",
                            "bg-violet-400",
                            "bg-violet-500",
                            "bg-violet-600",
                            "bg-violet-700",
                            "bg-violet-800",
                            "bg-violet-900",
                          ].map((color, i) => (
                            <div
                              key={i}
                              className={`${color} h-12 rounded-md flex items-center justify-center text-xs`}
                            >
                              {i * 100 || 50}
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-5 gap-2 mt-4">
                          {[
                            "bg-indigo-50",
                            "bg-indigo-100",
                            "bg-indigo-200",
                            "bg-indigo-300",
                            "bg-indigo-400",
                            "bg-indigo-500",
                            "bg-indigo-600",
                            "bg-indigo-700",
                            "bg-indigo-800",
                            "bg-indigo-900",
                          ].map((color, i) => (
                            <div
                              key={i}
                              className={`${color} h-12 rounded-md flex items-center justify-center text-xs`}
                            >
                              {i * 100 || 50}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Typography */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Typography</CardTitle>
                        <CardDescription>Text styles and hierarchy</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h1 className="text-4xl font-bold">Heading 1</h1>
                          <p className="text-sm text-muted-foreground">4xl / Bold</p>
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold">Heading 2</h2>
                          <p className="text-sm text-muted-foreground">3xl / Bold</p>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">Heading 3</h3>
                          <p className="text-sm text-muted-foreground">2xl / Bold</p>
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold">Heading 4</h4>
                          <p className="text-sm text-muted-foreground">xl / Semibold</p>
                        </div>
                        <div>
                          <p className="text-base">Body text</p>
                          <p className="text-sm text-muted-foreground">base / Regular</p>
                        </div>
                        <div>
                          <p className="text-sm">Small text</p>
                          <p className="text-sm text-muted-foreground">sm / Regular</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Toggle */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Toggle</CardTitle>
                        <CardDescription>Button that can be toggled</CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-wrap gap-2">
                        <Toggle>Basic</Toggle>
                        <Toggle variant="outline">Outline</Toggle>
                        <Toggle defaultPressed>Pressed</Toggle>
                        <Toggle variant="outline" size="sm">
                          Small
                        </Toggle>
                        <Toggle variant="outline" size="lg">
                          Large
                        </Toggle>
                      </CardContent>
                    </Card>

                    {/* Form */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Form</CardTitle>
                        <CardDescription>Validated input collection</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit((data) => console.log(data))} className="space-y-4">
                            <FormField
                              control={form.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Username</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter username" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button type="submit" className="w-full">
                              Submit
                            </Button>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                  </div>
                </section>
              )}
            </div>
          </div>
        </main>

        <footer className="border-t border-slate-200 dark:border-slate-800 mt-12">
          <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
            <p>UI Component Gallery - Built with shadcn/ui and Tailwind CSS</p>
          </div>
        </footer>

        <ToastViewport />
      </div>
    </ToastProvider>
  )
}

export default ComponentShowcase

