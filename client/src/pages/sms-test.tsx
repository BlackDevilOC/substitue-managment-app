import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SMSInterface } from '@/components/SMSInterface';

export default function SmsTestPage() {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSMSSent = () => {
    setMessage('');
    setPhone('');
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>SMS Test Tool</CardTitle>
          <CardDescription>
            Send SMS using your device's SIM card
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Recipient Phone Number</Label>
              <Input
                id="phone"
                placeholder="+923123456789"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Enter your message here"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                {message.length} characters ({Math.ceil(message.length / 160)} SMS)
              </p>
            </div>

            {phone && message && (
              <SMSInterface
                recipient={phone}
                message={message}
                onSend={handleSMSSent}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}