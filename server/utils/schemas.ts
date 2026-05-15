import { z } from 'zod'

const optionalText = z.string().trim().optional().nullable()
const slug = z.string().trim().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
const uuid = z.string().uuid()
const dateText = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable()

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export const propertySchema = z.object({
  name: z.string().trim().min(1),
  slug,
  primary_domain: z.string().trim().min(1),
  allowed_domains: z.array(z.string().trim().min(1)).default([]),
  utm_source: optionalText,
  utm_medium: optionalText,
  utm_campaign: optionalText,
  utm_content: optionalText,
  utm_term: optionalText,
  status: z.enum(['active', 'paused']).default('active')
})

export const advertiserSchema = z.object({
  name: z.string().trim().min(1),
  contact_name: optionalText,
  contact_email: z.string().email().optional().nullable().or(z.literal('')),
  contact_phone: optionalText,
  notes: optionalText,
  status: z.enum(['active', 'paused', 'archived']).default('active')
})

export const placementSchema = z.object({
  name: z.string().trim().min(1),
  slug,
  description: optionalText,
  width: z.coerce.number().int().positive(),
  height: z.coerce.number().int().positive(),
  status: z.enum(['active', 'paused', 'archived']).default('active')
})

export const campaignSchema = z.object({
  advertiser_id: uuid,
  property_id: uuid,
  name: z.string().trim().min(1),
  start_date: dateText,
  end_date: dateText,
  status: z.enum(['draft', 'active', 'paused', 'completed']).default('draft'),
  notes: optionalText
})

export const adSchema = z.object({
  campaign_id: uuid,
  advertiser_id: uuid,
  property_id: uuid,
  name: z.string().trim().min(1),
  destination_url: z.string().url(),
  alt_text: optionalText,
  status: z.enum(['draft', 'active', 'paused', 'archived']).default('draft'),
  start_date: dateText,
  end_date: dateText,
  weight: z.coerce.number().int().positive().default(1),
  utm_source: optionalText,
  utm_medium: optionalText,
  utm_campaign: optionalText,
  utm_content: optionalText,
  utm_term: optionalText
})

export const assignmentSchema = z.object({
  placement_ids: z.array(uuid)
})

export const impressionSchema = z.object({
  property_id: uuid,
  placement_id: uuid,
  advertiser_id: uuid,
  campaign_id: uuid,
  ad_id: uuid,
  page_url: z.string().url().optional().nullable(),
  metadata: z.record(z.unknown()).optional()
})
