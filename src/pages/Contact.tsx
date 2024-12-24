import React from 'react';
import Navigation from '../components/Navigation';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

type ContactFormData = {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  newsletter: boolean;
};

const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>();

  const onSubmit = (data: ContactFormData) => {
    console.log('Form submitted:', data);
    toast.success("Message sent successfully!");
    reset();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-28 pb-16 px-8 md:px-16 lg:px-24 xl:px-32 2xl:px-48">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h1 className="text-5xl font-light mb-4">Anand<br />Vijayaragavan</h1>
            <p className="text-xl mb-2">Hobby photographer</p>
            <p className="text-xl mb-12">Stockholm, Sweden</p>
            <h2 className="text-3xl font-light mb-8">Work with me?</h2>
          </div>

          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm">Name (required)</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                      placeholder="First Name"
                      {...register("firstName", { required: "First name is required" })}
                      className="bg-transparent border-input text-foreground placeholder:text-muted-foreground"
                    />
                    {errors.firstName && (
                      <p className="text-destructive text-sm mt-1">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <Input
                      placeholder="Last Name"
                      {...register("lastName", { required: "Last name is required" })}
                      className="bg-transparent border-input text-foreground placeholder:text-muted-foreground"
                    />
                    {errors.lastName && (
                      <p className="text-destructive text-sm mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm">Email (required)</label>
                <Input
                  type="email"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  className="bg-transparent border-input text-foreground placeholder:text-muted-foreground"
                />
                {errors.email && (
                  <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  {...register("newsletter")}
                  className="border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
                <label className="text-sm">Sign up for news and updates</label>
              </div>

              <div className="space-y-2">
                <label className="block text-sm">Subject (required)</label>
                <Input
                  {...register("subject", { required: "Subject is required" })}
                  className="bg-transparent border-input text-foreground placeholder:text-muted-foreground"
                />
                {errors.subject && (
                  <p className="text-destructive text-sm mt-1">{errors.subject.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm">Message (required)</label>
                <Textarea
                  {...register("message", { required: "Message is required" })}
                  className="min-h-[150px] bg-transparent border-input text-foreground placeholder:text-muted-foreground resize-none"
                />
                {errors.message && (
                  <p className="text-destructive text-sm mt-1">{errors.message.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Submit
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;