import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Loader2, Mail, Send, X, AlertCircle, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

interface Customer {
  name: string;
  email: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  message: string;
}

const EmailModal = ({
  customer,
  onClose,
  open,
}: {
  customer: Customer;
  onClose: () => void;
  open: boolean;
}) => {
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState("compose");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const emailTemplates: EmailTemplate[] = [
    {
      id: "welcome",
      name: "Welcome",
      subject: "Welcome to Our Platform!",
      message: `Dear ${customer.name},\n\nWelcome aboard! We're excited to have you join our platform.\n\nBest regards,\nThe Team`,
    },
    {
      id: "follow-up",
      name: "Follow Up",
      subject: "Following Up on Your Recent Activity",
      message: `Dear ${customer.name},\n\nI noticed you recently used our platform and wanted to check in.\n\nBest regards,\nThe Team`,
    },
    {
      id: "support",
      name: "Support",
      subject: "Support Request Follow-up",
      message: `Dear ${customer.name},\n\nI'm checking in about your recent support request.\n\nBest regards,\nThe Team`,
    },
  ];

  const form = useForm({
    defaultValues: {
      to: customer.email || "",
      subject: "",
      message: "",
      template: "",
    },
  });

  const onSubmit: SubmitHandler<{
    to: string;
    subject: string;
    message: string;
    template?: string;
  }> = async (data) => {
    setSending(true);
    setStatus("idle");

    try {
      const response = await fetch("/api/admin/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: data.to,
          subject: data.subject,
          message: data.message,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || result.details || "Failed to send email",
        );
      }

      setStatus("success");

      toast.success("Email sent successfully", {
        description: `Email was sent to ${data.to}`,
      });

      setTimeout(() => {
        onClose();

        setTimeout(() => setStatus("idle"), 500);
      }, 1500);
    } catch (error) {
      setStatus("error");

      toast.error("Failed to send email", {
        description: (error as Error).message,
      });
    } finally {
      setSending(false);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = emailTemplates.find((t) => t.id === templateId);
    if (template) {
      form.setValue("subject", template.subject);
      form.setValue("message", template.message);
      form.setValue("template", templateId);
    }
  };

  return (
    <>
      <Toaster />
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email {customer.name}
            </DialogTitle>
            <DialogDescription>
              Send a personalized email to this customer.
            </DialogDescription>
          </DialogHeader>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-4 grid w-full grid-cols-2">
              <TabsTrigger value="compose">Compose</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="compose" className="mt-0">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="to"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recipient</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value || ""}
                            disabled
                          />
                        </FormControl>
                        <FormDescription>
                          Email will be sent to this address.
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter email subject..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Enter your message..."
                            className="min-h-[200px] resize-y"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {status === "success" && (
                    <Alert
                      variant="default"
                      className="border-green-200 bg-green-50"
                    >
                      <Check className="h-4 w-4 text-green-600" />
                      <AlertTitle className="text-green-800">
                        Email Sent Successfully
                      </AlertTitle>
                      <AlertDescription className="text-green-700">
                        Your email has been delivered to {customer.email}.
                      </AlertDescription>
                    </Alert>
                  )}

                  {status === "error" && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Failed to Send Email</AlertTitle>
                      <AlertDescription>
                        There was a problem sending your email. Please try
                        again.
                      </AlertDescription>
                    </Alert>
                  )}

                  <Separator />

                  <DialogFooter className="flex justify-between gap-2 sm:justify-between">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={onClose}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                    <Button type="submit" disabled={sending} className="gap-2">
                      {sending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Send Email
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="templates" className="mt-0">
              <div className="grid gap-4">
                {emailTemplates.map((template) => (
                  <Card key={template.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-4">
                        <div className="mb-1 font-medium">{template.name}</div>
                        <div className="mb-2 text-sm text-muted-foreground">
                          {template.subject}
                        </div>
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {template.message}
                        </p>
                      </div>
                      <div className="flex justify-end bg-muted px-4 py-3">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            handleTemplateSelect(template.id);
                            setActiveTab("compose");
                          }}
                        >
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmailModal;
