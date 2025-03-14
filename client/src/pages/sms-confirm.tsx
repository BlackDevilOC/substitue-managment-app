import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Teacher {
  id: string;
  name: string;
  phone?: string;
}

interface LocationState {
  selectedTeachers: Teacher[];
  messageText: string;
}

export default function SmsConfirmPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Parse state from URL query parameters
  const params = new URLSearchParams(window.location.search);
  const stateParam = params.get('state');
  const state: LocationState = stateParam ? JSON.parse(decodeURIComponent(stateParam)) : { selectedTeachers: [], messageText: '' };
  const { selectedTeachers = [], messageText = '' } = state;

  // State for teachers without phone numbers
  const [missingPhones, setMissingPhones] = useState<Record<string, string>>(
    selectedTeachers.reduce((acc, teacher) => {
      if (!teacher.phone) {
        acc[teacher.id] = '';
      }
      return acc;
    }, {} as Record<string, string>)
  );

  const handlePhoneChange = (teacherId: string, phone: string) => {
    setMissingPhones(prev => ({
      ...prev,
      [teacherId]: phone
    }));
  };

  const handleSendMessages = async () => {
    try {
      setLoading(true);

      // Update teachers with missing phone numbers
      const updatedTeachers = selectedTeachers.map(teacher => ({
        ...teacher,
        phone: teacher.phone || missingPhones[teacher.id]
      }));

      // Filter out teachers without phone numbers
      const teachersWithPhones = updatedTeachers.filter(t => t.phone);

      if (teachersWithPhones.length === 0) {
        throw new Error("No valid phone numbers provided");
      }

      // Open the default SMS app with the message and numbers
      const numbers = teachersWithPhones.map(t => t.phone).join(',');
      window.location.href = `sms:${numbers}?body=${encodeURIComponent(messageText)}`;

      // Record the SMS attempt in history
      await fetch('/api/record-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teachers: teachersWithPhones,
          message: messageText,
          method: 'mobile'
        })
      });

      toast({
        title: "SMS App Opened",
        description: "Continue in your device's SMS application",
      });

      // Redirect to SMS history page
      setLocation('/sms-history');
    } catch (error) {
      console.error('Error processing messages:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process messages",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Confirm SMS Details</h1>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold mb-4">Recipients ({selectedTeachers.length})</h2>
          <div className="space-y-4">
            {selectedTeachers.map(teacher => (
              <div key={teacher.id} className="flex items-center gap-4">
                <span className="flex-1">{teacher.name}</span>
                {teacher.phone ? (
                  <span className="text-muted-foreground">{teacher.phone}</span>
                ) : (
                  <Input
                    type="tel"
                    placeholder="Enter phone number"
                    value={missingPhones[teacher.id]}
                    onChange={(e) => handlePhoneChange(teacher.id, e.target.value)}
                    className="w-48"
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold mb-4">Message</h2>
          <p className="whitespace-pre-wrap">{messageText}</p>
        </CardContent>
      </Card>

      <Button
        className="w-full"
        onClick={handleSendMessages}
        disabled={loading}
      >
        <Phone className="h-4 w-4 mr-2" />
        Open SMS App
      </Button>
    </div>
  );
}