"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MultiSelect } from "./multi-select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import useSupabaseBrowser from "@/lib/useSupabaseBrowser"
import { Loader2 } from "lucide-react"

interface Category {
  id: number
  name: string
}

interface Tag {
  id: number
  name: string
}

interface SubmitFormProps {
  categories: Category[]
  tags: Tag[]
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  type: z.enum(["wallet", "dapp", "learning", "service", "event", "media", "books", "podcasts", "documentaries"]),
  url: z.string().url({
    message: "Please enter a valid URL.",
  }),
  logo_url: z
    .string()
    .url({
      message: "Please enter a valid URL for the logo.",
    })
    .optional()
    .or(z.literal("")),
  thumbnail_url: z
    .string()
    .url({
      message: "Please enter a valid URL for the thumbnail.",
    })
    .optional()
    .or(z.literal("")),
  short_desc: z
    .string()
    .min(10, {
      message: "Short description must be at least 10 characters.",
    })
    .max(150, {
      message: "Short description must not exceed 150 characters.",
    }),
  long_desc: z.string().optional().or(z.literal("")),
  source_link: z
    .string()
    .url({
      message: "Please enter a valid URL for the source.",
    })
    .optional()
    .or(z.literal("")),
  category_id: z.string().nonempty({
    message: "Please select a category.",
  }),
  tags: z.array(z.number()).min(1, {
    message: "Please select at least one tag.",
  }),
})

type FormValues = z.infer<typeof formSchema>

export default function SubmitForm({ categories, tags }: SubmitFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const supabase = useSupabaseBrowser()
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "dapp",
      url: "",
      logo_url: "",
      thumbnail_url: "",
      short_desc: "",
      long_desc: "",
      source_link: "",
      category_id: "",
      tags: [],
    },
  })

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)

    try {
      // Generate a slug from the name
      const slug = values.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "")

      // First insert the listing
      const { data: listing, error: listingError } = await supabase
        .from("listings")
        .insert({
          name: values.name,
          slug,
          type: values.type,
          url: values.url,
          logo_url: values.logo_url || null,
          thumbnail_url: values.thumbnail_url || null,
          short_desc: values.short_desc,
          long_desc: values.long_desc || null,
          source_link: values.source_link || null,
          category_id: Number.parseInt(values.category_id),
        })
        .select("id")
        .single()

      if (listingError) throw listingError

      // Then connect the tags
      if (listing && values.tags.length > 0) {
        const tagConnections = values.tags.map((tagId) => ({
          listing_id: listing.id,
          tag_id: tagId,
        }))

        const { error: tagError } = await supabase.from("listing_tags").insert(tagConnections)

        if (tagError) throw tagError
      }

      toast({
        title: "Submission successful!",
        description: "Your listing has been submitted for review and will be published soon.",
      })

      setTimeout(() => {
        router.push("/")
        router.refresh()
      }, 2000)
    } catch (error: any) {
      console.error("Submission error:", error)
      toast({
        title: "Submission failed",
        description: error.message || "There was an error submitting your listing. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="bg-neutral-900 border-neutral-800">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* General Information Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-medium">General Information</h3>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. MetaMask" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Type*</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select project type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="wallet">Wallet</SelectItem>
                          <SelectItem value="dapp">dApp</SelectItem>
                          <SelectItem value="learning">Learning</SelectItem>
                          <SelectItem value="service">Service</SelectItem>
                          <SelectItem value="event">Event</SelectItem>
                          <SelectItem value="media">Media</SelectItem>
                          <SelectItem value="books">Books</SelectItem>
                          <SelectItem value="podcasts">Podcasts</SelectItem>
                          <SelectItem value="documentaries">Documentaries</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category*</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website URL*</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="logo_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/logo.png" {...field} />
                      </FormControl>
                      <FormDescription>URL to the project's logo image</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="source_link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source Link</FormLabel>
                      <FormControl>
                        <Input placeholder="https://github.com/example/repo" {...field} />
                      </FormControl>
                      <FormDescription>Link to source code if applicable</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-6 pt-6 border-t border-neutral-800">
              <h3 className="text-xl font-medium">Description</h3>

              <FormField
                control={form.control}
                name="short_desc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description*</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief summary of the project (max 150 characters)"
                        {...field}
                        className="resize-none"
                        maxLength={150}
                      />
                    </FormControl>
                    <FormDescription>{field.value.length}/150 characters - This appears in listings</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="long_desc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detailed description of the project"
                        {...field}
                        className="min-h-[150px]"
                      />
                    </FormControl>
                    <FormDescription>This will appear on the listing's detail page</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="thumbnail_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/thumbnail.jpg" {...field} />
                    </FormControl>
                    <FormDescription>For media-type listings, add a thumbnail image</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Tags Section */}
            <div className="space-y-6 pt-6 border-t border-neutral-800">
              <h3 className="text-xl font-medium">Tags</h3>

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags*</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={tags.map((tag) => ({
                          value: tag.id,
                          label: tag.name,
                        }))}
                        selected={field.value.map((id) => ({
                          value: id,
                          label: tags.find((tag) => tag.id === id)?.name || "",
                        }))}
                        onChange={(selected) => field.onChange(selected.map((item) => item.value))}
                      />
                    </FormControl>
                    <FormDescription>Select tags that best describe this project</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-6 border-t border-neutral-800">
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Listing"
                )}
              </Button>
              <p className="text-xs text-neutral-500 mt-4 text-center">
                By submitting, you agree to our terms and conditions. Submissions are reviewed before publication.
              </p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
