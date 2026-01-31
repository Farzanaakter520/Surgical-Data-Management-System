"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Settings, User, FileText, BarChart3 } from "lucide-react";
import Stepper from "./stepper";

// Sample components to demonstrate the tabbed page
export const AddSurgicalPatient = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5" />
         Add Surgical Patient
      </CardTitle>
      <CardDescription> Complete all steps to finalize patient record</CardDescription>
    </CardHeader>
    <CardContent>
      
           <Stepper></Stepper> 
    </CardContent>
  </Card>
);
