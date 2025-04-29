"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect } from "./multi-select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"

interface Category {
  id: number
  name: string
}

interface Tag {
  id: number
  name: string
}

interface SubmissionFormProps {
  categories: Category[]
  tags: Tag[]
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  type: z.enum(["wallet", "dapp", "learning", "service", "event"]),
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
  short_desc: z
    .string()
    .min(10, {
      message: "Short description must be at least 10 characters.",
    })
    .max(150, {
      message: "Short description must not exceed 150 characters.",
    }),
  long_desc: z.string().optional(),
  source_link: z
    .string()
    .url({
      message: "Please enter a valid URL for the source.",
    })
    .optional()
    .or(z.literal("")),
  category_id: z.string(),
  tags: z.array(z.number()).min(1, {
    message: "Please select at least one tag.",
  }),
})

export default function SubmissionForm({ categories, tags }: SubmissionFormProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "dapp",
      url: "",
      logo_url: "",
      short_desc: "",
      long_desc: "",
      source_link: "",
      category_id: "",
      tags: [],
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true)

    try {
      const { error } = await supabase
        .schema("ethdir")
        .from("submissions")
        .insert({
          payload: {
            ...values,
            category_id: Number.parseInt(values.category_id),
          },
        })

      if (error) throw error

      toast({
        title: "Submission successful",
        description: "Your listing has been submitted for review.",
      })

      router.push("/")
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was an error submitting your listing. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    const fieldsToValidate = step === 1 ? ["name", "type", "url", "short_desc", "category_id"] : ["tags"]

    form.trigger(fieldsToValidate as any).then((isValid) => {
      if (isValid) {
        setStep(step + 1)
      }
    })
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  return (
    <Card className="bg-neutral-900 border-neutral-800 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">
            {step === 1 && "Basic Information"}
            {step === 2 && "Tags"}
            {step === 3 && "Review & Submit"}
          </h2>
          <div className="text-sm text-neutral-400">Step {step} of 3</div>
        </div>
        <div className="w-full bg-neutral-800 h-2 rounded-full">
          <div
            className="bg-white h-2 rounded-full transition-all"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && (
            <>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. MetaMask" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="wallet">Wallet</SelectItem>
                        <SelectItem value="dapp">dApp</SelectItem>
                        <SelectItem value="learning">Learning</SelectItem>
                        <SelectItem value="service">Service</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="logo_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo URL (optional)</FormLabel>
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
                name="short_desc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of the project (max 150 characters)"
                        {...field}
                        className="resize-none"
                      />
                    </FormControl>
                    <FormDescription>{field.value.length}/150 characters</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="long_desc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Long Description (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detailed description of the project"
                        {...field}
                        className="min-h-[150px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="source_link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source Link (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/example/repo" {...field} />
                    </FormControl>
                    <FormDescription>Link to source code or additional resources</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            </>
          )}

          {step === 2 && (
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
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
                  <FormDescription>Select tags that best describe this listing</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Review your submission</h3>
                <p className="text-neutral-400 mb-4">
                  Please review your submission before submitting. Once submitted, it will be reviewed by our team.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-neutral-400">Name</div>
                  <div className="col-span-2">{form.getValues("name")}</div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-neutral-400">Type</div>
                  <div className="col-span-2 capitalize">{form.getValues("type")}</div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-neutral-400">URL</div>
                  <div className="col-span-2">{form.getValues("url")}</div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-neutral-400">Short Description</div>
                  <div className="col-span-2">{form.getValues("short_desc")}</div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-neutral-400">Category</div>
                  <div className="col-span-2">
                    {categories.find((c) => c.id.toString() === form.getValues("category_id"))?.name}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-neutral-400">Tags</div>
                  <div className="col-span-2 flex flex-wrap gap-2">
                    {form.getValues("tags").map((tagId) => (
                      <span key={tagId} className="bg-neutral-800 text-neutral-300 px-2 py-1 rounded-md text-sm">
                        {tags.find((tag) => tag.id === tagId)?.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={prevStep}>
                Back
              </Button>
            ) : (
              <div></div>
            )}

            {step < 3 ? (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <button type="submit" disabled={loading} className="bg-white hover:bg-gray-90">
                {loading ? "submitting..." : "submit listing"}
              </button>
            )}
          </div>
        </form>
      </Form>
    </Card>
  )
}
