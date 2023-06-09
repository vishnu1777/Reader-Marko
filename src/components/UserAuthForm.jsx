"use client";

import * as React from "react";

import { cn } from "../../utils/form";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export function UserAuthForm({
  setAdminId,
  setThreshold,
  className,
  userData,
  setIsSuccess,
  setId,
  ...props
}) {
  const [email, setEmail] = React.useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const isName = userData.filter(
      (data) => data.lectureDetails.name === email
    );

    if (!isName.length) return;
    localStorage.setItem("user", isName[0].lectureDetails._id);
    setId(isName[0].lectureDetails._id);
    setAdminId(isName[0]._id);
    setThreshold(isName[0].threshold);
    navigate("/", { replace: true });
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <div className="flex  justify-center">
            <Button
              className="bg-white border-2 transition duration-200 ease-in-out hover:border-black rounded-xl hover:text-white hover:bg-black"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In with Email
            </Button>
          </div>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
      </div>
    </div>
  );
}
