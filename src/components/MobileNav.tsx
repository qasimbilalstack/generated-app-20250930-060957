import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, UtensilsCrossed, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
const navItems = [
  { href: "/", label: "Stalls" },
  { href: "/about", label: "About" },
  { href: "/admin", label: "Admin" },
];
export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-xs pr-0">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <NavLink
              to="/"
              className="flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <UtensilsCrossed className="h-7 w-7 text-brand" />
              <span className="font-display text-xl font-bold tracking-tight">
                Urban Chowk
              </span>
            </NavLink>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close Menu</span>
            </Button>
          </div>
          <nav className="flex flex-col gap-4 p-6">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "text-lg font-medium transition-colors hover:text-brand",
                    isActive ? "text-brand" : "text-foreground/80"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}