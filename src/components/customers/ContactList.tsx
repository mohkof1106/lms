'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Contact } from '@/types';
import { Mail, Phone, Star } from 'lucide-react';

interface ContactListProps {
  contacts: Contact[];
  variant?: 'card' | 'compact';
}

export function ContactList({ contacts, variant = 'card' }: ContactListProps) {
  if (contacts.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-4">
        No contacts added yet.
      </p>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="space-y-2">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="flex items-center justify-between py-2 border-b last:border-0"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium">{contact.name}</span>
              {contact.isPrimary && (
                <Badge variant="secondary" className="text-xs">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Primary
                </Badge>
              )}
            </div>
            <span className="text-sm text-muted-foreground">{contact.position}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {contacts.map((contact) => (
        <Card key={contact.id} className={contact.isPrimary ? 'border-primary' : ''}>
          <CardContent className="pt-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium">{contact.name}</h4>
                {contact.position && (
                  <p className="text-sm text-muted-foreground">{contact.position}</p>
                )}
              </div>
              {contact.isPrimary && (
                <Badge variant="secondary" className="text-xs">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Primary
                </Badge>
              )}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${contact.email}`} className="hover:text-primary">
                  {contact.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{contact.phone}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
