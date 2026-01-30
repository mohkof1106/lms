'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Customer } from '@/types';
import { Building2, Users, Plus, Trash2, Star } from 'lucide-react';

const contactSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'Contact name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  position: z.string().optional(),
  isPrimary: z.boolean(),
});

const customerSchema = z.object({
  name: z.string().min(2, 'Company name is required'),
  location: z.string().min(2, 'Location is required'),
  website: z.string().optional(),
  industry: z.string().optional(),
  trn: z.string().optional(),
  notes: z.string().optional(),
  contacts: z.array(contactSchema).min(1, 'At least one contact is required'),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  customer?: Customer;
  onSubmit: (data: CustomerFormData) => void;
  onCancel: () => void;
}

export function CustomerForm({ customer, onSubmit, onCancel }: CustomerFormProps) {
  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: customer
      ? {
          name: customer.name,
          location: customer.location,
          website: customer.website || '',
          industry: customer.industry || '',
          trn: customer.trn || '',
          notes: customer.notes || '',
          contacts: customer.contacts,
        }
      : {
          name: '',
          location: '',
          website: '',
          industry: '',
          trn: '',
          notes: '',
          contacts: [
            {
              id: `CON-NEW-${Date.now()}`,
              name: '',
              email: '',
              phone: '+971 ',
              position: '',
              isPrimary: true,
            },
          ],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'contacts',
  });

  const handleAddContact = () => {
    append({
      id: `CON-NEW-${Date.now()}`,
      name: '',
      email: '',
      phone: '+971 ',
      position: '',
      isPrimary: false,
    });
  };

  const handleSetPrimary = (index: number) => {
    const contacts = form.getValues('contacts');
    contacts.forEach((_, i) => {
      form.setValue(`contacts.${i}.isPrimary`, i === index);
    });
  };

  const handleRemoveContact = (index: number) => {
    const contacts = form.getValues('contacts');
    const wasPrimary = contacts[index].isPrimary;
    remove(index);

    // If removed contact was primary and there are other contacts, make first one primary
    if (wasPrimary && contacts.length > 1) {
      setTimeout(() => {
        form.setValue('contacts.0.isPrimary', true);
      }, 0);
    }
  };

  const industries = [
    'Information Technology',
    'Government',
    'Tourism & Hospitality',
    'Education',
    'Healthcare',
    'Real Estate',
    'Retail',
    'Arts & Culture',
    'Environmental Services',
    'Financial Services',
    'Manufacturing',
    'Other',
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="h-5 w-5 text-primary" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="TAHSEEL Information Technology" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Sharjah, UAE" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="example.ae" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Select or type industry"
                      list="industries"
                      {...field}
                    />
                  </FormControl>
                  <datalist id="industries">
                    {industries.map((industry) => (
                      <option key={industry} value={industry} />
                    ))}
                  </datalist>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="trn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TRN (Tax Registration Number)</FormLabel>
                  <FormControl>
                    <Input placeholder="100123456700003" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional notes about the client..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Contacts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-primary" />
              Contacts
            </CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={handleAddContact}>
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => {
              const isPrimary = form.watch(`contacts.${index}.isPrimary`);
              return (
                <div
                  key={field.id}
                  className={`rounded-lg border p-4 space-y-4 ${
                    isPrimary ? 'border-primary bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">Contact {index + 1}</span>
                      {isPrimary && (
                        <span className="inline-flex items-center text-xs text-primary">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Primary
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {!isPrimary && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetPrimary(index)}
                        >
                          <Star className="h-4 w-4 mr-1" />
                          Set Primary
                        </Button>
                      )}
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleRemoveContact(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name={`contacts.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Ahmed Al Rashid" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`contacts.${index}.position`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position</FormLabel>
                          <FormControl>
                            <Input placeholder="Marketing Manager" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`contacts.${index}.email`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="ahmed@company.ae" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`contacts.${index}.phone`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="+971 50 123 4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              );
            })}
            {form.formState.errors.contacts?.root && (
              <p className="text-sm text-destructive">
                {form.formState.errors.contacts.root.message}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{customer ? 'Save Changes' : 'Create Customer'}</Button>
        </div>
      </form>
    </Form>
  );
}
