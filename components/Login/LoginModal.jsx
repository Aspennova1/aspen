"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LoginForm } from "./LoginForm";
import { Button } from "../ui/button";
import { useState } from "react";
import { RegisterForm } from "./RegisterForm";
import { useAuthModal } from "@/components/context/AuthModalContext";

export function LoginModal() {
  const { open, closeAuthModal, openAuthModal } = useAuthModal();

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) closeAuthModal();
      else openAuthModal();
    }}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          Login / Signup
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md p-6 space-y-6 max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Welcome to Aspen Group
          </DialogTitle>

          <DialogDescription className="text-base leading-relaxed">
            One sign-in for customers, Aspen teams, and vendors.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid grid-cols-2 w-full -mt-5 mb-3">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <LoginForm onSuccess={closeAuthModal} />
          </TabsContent>

          <TabsContent value="register">
            <RegisterForm onSuccess={closeAuthModal} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}