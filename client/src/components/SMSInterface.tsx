
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useToast } from '@/hooks/use-toast';

interface SMSInterfaceProps {
  recipient: string;
  message: string;
  onSend: () => void;
}

export function SMSInterface({ recipient, message, onSend }: SMSInterfaceProps) {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);

  const handleSendSMS = async () => {
    setSending(true);
    try {
      // Check if running in mobile environment
      if (typeof (window as any).ReactNativeWebView !== 'undefined') {
        // Send message to React Native
        (window as any).ReactNativeWebView.postMessage(JSON.stringify({
          type: 'SEND_SMS',
          payload: {
            phoneNumber: recipient,
            message: message
          }
        }));
        toast({
          title: "SMS Request Sent",
          description: "Message will be sent via device SMS",
        });
        onSend();
      } else {
        toast({
          title: "Error",
          description: "SMS sending is only available on mobile devices",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send SMS",
        variant: "destructive"
      });
    }
    setSending(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send SMS via Device</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <p><strong>To:</strong> {recipient}</p>
            <p><strong>Message:</strong> {message}</p>
          </div>
          <Button
            onClick={handleSendSMS}
            disabled={sending}
            className="w-full"
          >
            {sending ? 'Sending...' : 'Send via Device SMS'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
