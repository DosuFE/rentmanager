'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PropertyForm } from '@/components/forms/property-form'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { useAuth } from '@/hooks/use-auth'
import {
  createProperty,
  deleteProperty,
  getProperties,
  updateProperty,
} from '@/services/property-service'
import type { Property } from '@/types'
import type { PropertySchema } from '@/validations/property-schema'

export default function PropertiesPage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [createOpen, setCreateOpen] = useState(false)
  const [editProperty, setEditProperty] = useState<Property | null>(null)

  const { data: properties, isLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: getProperties,
    enabled: user?.role === 'LANDLORD',
  })

  const createMutation = useMutation({
    mutationFn: createProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      toast.success('Property created')
      setCreateOpen(false)
    },
    onError: () => toast.error('Failed to create property'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PropertySchema }) =>
      updateProperty(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      toast.success('Property updated')
      setEditProperty(null)
    },
    onError: () => toast.error('Failed to update property'),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      toast.success('Property deleted')
    },
    onError: () => toast.error('Failed to delete property'),
  })

  if (user?.role !== 'LANDLORD') {
    return (
      <p className="text-muted-foreground">Only landlords can manage properties.</p>
    )
  }

  if (isLoading) return <LoadingSpinner label="Loading properties..." />

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold md:text-3xl">Properties</h2>
          <p className="text-muted-foreground">Manage your rental properties</p>
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Property
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Property</DialogTitle>
            </DialogHeader>
            <PropertyForm
              onSubmit={(data) => createMutation.mutate(data)}
              isLoading={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Mobile cards */}
      <div className="grid gap-4 md:hidden">
        {properties?.map((property) => (
          <Card key={property.id} className="rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{property.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                {property.address}, {property.city}, {property.state}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link href={`/properties/${property.id}`}>View</Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditProperty(property)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteMutation.mutate(property.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {!properties?.length && (
          <p className="text-center text-muted-foreground">No properties yet.</p>
        )}
      </div>

      {/* Desktop table */}
      <Card className="hidden rounded-2xl md:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>City</TableHead>
                <TableHead>State</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties?.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/properties/${property.id}`}
                      className="hover:underline"
                    >
                      {property.name}
                    </Link>
                  </TableCell>
                  <TableCell>{property.address}</TableCell>
                  <TableCell>{property.city}</TableCell>
                  <TableCell>{property.state}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditProperty(property)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => deleteMutation.mutate(property.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!properties?.length && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No properties yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!editProperty} onOpenChange={() => setEditProperty(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Property</DialogTitle>
          </DialogHeader>
          {editProperty && (
            <PropertyForm
              defaultValues={editProperty}
              submitLabel="Update Property"
              onSubmit={(data) =>
                updateMutation.mutate({ id: editProperty.id, data })
              }
              isLoading={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
