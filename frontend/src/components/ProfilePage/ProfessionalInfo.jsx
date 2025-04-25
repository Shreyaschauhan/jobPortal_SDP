import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { GraduationCap, Briefcase, Building, Plus, Trash2 } from 'lucide-react';
import { useFieldArray, Controller } from "react-hook-form";

const ProfessionalInfo = ({ register, watch, isEditing, role, control }) => {
  // Helper to ensure we are always mapping over an array
  const ensureArray = (data) => {
    if (Array.isArray(data)) return data;
    if (typeof data === 'string' && data.trim() !== "") {
        try { return JSON.parse(data); } catch { return []; }
    }
    return [];
  };

  const qualificationsValue = watch("qualifications");
  const experienceValue = watch("experience");
  const companyValue = watch("company");

  return (
    <div className="space-y-8">
      {role === "jobseeker" && (
        <>
          {/* Qualifications Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-500" /> Qualifications
            </h3>
            <Separator />
            {ensureArray(qualificationsValue).length > 0 ? (
              ensureArray(qualificationsValue).map((qualification, index) => (
                <Card key={index} className="bg-slate-50 border-slate-200">
                  <CardContent className="p-4 space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-slate-500">Education</Label>
                      <Input
                        {...register(`qualifications.${index}.education`)}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-white" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-slate-500">Certificate</Label>
                      <Input
                        {...register(`qualifications.${index}.certifricate`)}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-white" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-slate-500">Skills</Label>
                      <Input
                        {...register(`qualifications.${index}.skills`)}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-white" : ""}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-sm text-slate-500">No qualifications added yet</p>
            )}
          </div>

          {/* Experience Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-500" /> Experience
            </h3>
            <Separator />
            {ensureArray(experienceValue).length > 0 ? (
              ensureArray(experienceValue).map((exp, index) => (
                <Card key={index} className="bg-slate-50 border-slate-200">
                  <CardContent className="p-4 space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-slate-500">Title</Label>
                      <Input
                        {...register(`experience.${index}.title`)}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-white" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-slate-500">Company</Label>
                      <Input
                        {...register(`experience.${index}.company`)}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-white" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-slate-500">Description</Label>
                      <Textarea
                        {...register(`experience.${index}.desc`)}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-white min-h-[80px]" : "min-h-[80px]"}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-sm text-slate-500">No experience added yet</p>
            )}
          </div>
        </>
      )}

      {role === "recruiter" && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Building className="h-5 w-5 text-blue-500" /> Company
          </h3>
          <Separator />
          <div className="space-y-2">
            <Label className="text-sm text-slate-500">Company Name</Label>
            <Input
              {...register("company")}
              disabled={!isEditing}
              className={!isEditing ? "bg-white" : ""}
              placeholder="Enter company name"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalInfo;