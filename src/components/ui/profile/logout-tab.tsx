import React from "react";
import { signOut } from "next-auth/react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "../button";

export const LogOutTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Out</CardTitle>
        <CardDescription>Sign out of your account</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-8">
        <p className="mb-6 text-center">Are you sure you want to logout?</p>
        <Button
          variant="destructive"
          onClick={() => {
            signOut();
          }}
        >
          Logout
        </Button>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          You will be redirected to the login page
        </p>
      </CardContent>
    </Card>
  );
};
