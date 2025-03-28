import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose } from "@/components/ui/toast"; // Updated import
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
});

function Test() {
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState(50);
  const [toastOpen, setToastOpen] = useState(false); // State to control toast visibility
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "" },
  });

  return (
    <ToastProvider>
      <div className="p-4 space-y-6">
        <h2 className="text-2xl font-bold">Shadcn/ui Test Component</h2>

        {/* Accordion */}
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Accordion</AccordionTrigger>
            <AccordionContent>Content here</AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Alert */}
        <Alert>
          <AlertTitle>Alert</AlertTitle>
          <AlertDescription>This is an alert</AlertDescription>
        </Alert>

        {/* Alert Dialog */}
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

        {/* Avatar */}
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        {/* Badge */}
        <Badge>Badge</Badge>

        {/* Button */}
        <Button variant="default" onClick={() => setToastOpen(true)}>
          Show Toast
        </Button>

        {/* Card */}
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>Card Content</CardContent>
          <CardFooter>
            <Button>Card Button</Button>
          </CardFooter>
        </Card>

        {/* Checkbox */}
        <Checkbox id="check" />
        <Label htmlFor="check">Checkbox</Label>

        {/* Collapsible */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost">Toggle Collapsible</Button>
          </CollapsibleTrigger>
          <CollapsibleContent>Collapsible Content</CollapsibleContent>
        </Collapsible>

        {/* Command */}
        <Command>
          <CommandInput placeholder="Type a command..." />
          <CommandList>
            <CommandItem>Command 1</CommandItem>
            <CommandItem>Command 2</CommandItem>
          </CommandList>
        </Command>

        {/* Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
              <DialogDescription>Dialog Description</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        {/* Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Dropdown</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuItem>Item 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Form */}
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
            <Button type="submit">Submit</Button>
          </form>
        </Form>

        {/* Hover Card */}
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link">Hover me</Button>
          </HoverCardTrigger>
          <HoverCardContent>Hover Card Content</HoverCardContent>
        </HoverCard>

        {/* Input */}
        <Input placeholder="Type here..." />

        {/* Label */}
        <Label htmlFor="test-input">Label</Label>
        <Input id="test-input" placeholder="With Label" />

        {/* Navigation Menu */}
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink>Link 1</NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink>Link 2</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Open Popover</Button>
          </PopoverTrigger>
          <PopoverContent>Popover Content</PopoverContent>
        </Popover>

        {/* Progress */}
        <Progress value={progress} className="w-[60%]" />

        {/* Radio Group */}
        <RadioGroup defaultValue="option-one">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-one" id="r1" />
            <Label htmlFor="r1">Option One</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-two" id="r2" />
            <Label htmlFor="r2">Option Two</Label>
          </div>
        </RadioGroup>

        {/* Scroll Area */}
        <ScrollArea className="h-[100px] w-[200px] border">
          <div className="p-4">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i}>Scroll Item {i + 1}</div>
            ))}
          </div>
        </ScrollArea>

        {/* Select */}
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>

        {/* Separator */}
        <Separator />

        {/* Skeleton */}
        <Skeleton className="h-4 w-[200px]" />

        {/* Slider */}
        <Slider defaultValue={[33]} max={100} step={1} className="w-[60%]" />

        {/* Switch */}
        <Switch id="switch" />
        <Label htmlFor="switch">Switch</Label>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Row 1</TableCell>
              <TableCell>100</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* Tabs */}
        <Tabs defaultValue="tab1" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Tab 1 Content</TabsContent>
          <TabsContent value="tab2">Tab 2 Content</TabsContent>
        </Tabs>

        {/* Textarea */}
        <Textarea placeholder="Type your message here..." />

        {/* Toast */}
        <Toast open={toastOpen} onOpenChange={setToastOpen}>
          <ToastTitle>Toast</ToastTitle>
          <ToastDescription>This is a toast!</ToastDescription>
          <ToastClose />
        </Toast>

        {/* Toggle */}
        <Toggle>Toggle</Toggle>

        {/* Tooltip */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Hover for Tooltip</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Tooltip Content</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Toast Viewport */}
        <ToastViewport />
      </div>
    </ToastProvider>
  );
}

export default Test;