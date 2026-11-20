"use client"

import { useCallback, useState } from "react"
import { createClient } from "@supabase/supabase-js"

import { saveProfile, signResumeUpload } from "@/app/admin/settings-actions"
import { MessageBanner, SaveBar, Section, pathDescriber, useSaveFlow } from "@/components/admin/editor-shell"
import { Field, ImageField, TextInput } from "@/components/admin/fields"
import { BUTTON } from "@/components/admin/styles"
import { RESUME_PATH, TIME_ZONE } from "@/lib/contact"
import { DOCUMENTS_BUCKET, MAX_DOCUMENT_BYTES, documentUrl } from "@/lib/documents"
import type { ProfileDraft, Resume } from "@/lib/settings-content"

const describePath = pathDescriber({
  "photo.src": "Photo",
  "photo.alt": "Photo description",
  "portrait.src": "Author portrait",
  resume: "Resume",
  "resume.path": "Resume",
})

/**
 * The photograph on the About page, the portrait on every article, and the
 * resume visitors download. Each
 * upload goes straight from the browser to where it is stored; nothing goes
 * live until the profile is saved.
 */
export function ProfileEditor({ initial }: { initial: ProfileDraft }) {
  // The resume the site is serving now, so a fresh upload can say it isn't live yet
  const [livePath, setLivePath] = useState(initial.resume?.path)
  const onSaved = useCallback((_: unknown, saved: ProfileDraft) => setLivePath(saved.resume?.path), [])
  const { state, change, errors, errorAt, message, saving, dirty, saveNow } = useSaveFlow({
    initial,
    save: saveProfile,
    onSaved,
  })

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">Photo &amp; resume</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Your photo on the About page, your portrait on articles and the resume visitors download. Saved changes go
          live within a few seconds.
        </p>
      </div>

      <MessageBanner message={message} errors={errors} describePath={describePath} />

      <Section
        title="About photo"
        description="Fills the screen at the top of the About page, and behind the About section on the home page. It is cropped to fit, centred, so a wide landscape photo works best."
        action={
          <a href="/about" target="_blank" rel="noreferrer" className={BUTTON}>
            View live ↗
          </a>
        }
      >
        <ImageField
          label="Photo"
          src={state.photo.src}
          folder="profile"
          onChange={(image) => change((current) => ({ ...current, photo: { ...current.photo, src: image.src } }))}
          error={errorAt("photo.src")}
        />
        <TextInput
          label="Description"
          value={state.photo.alt}
          onChange={(alt) => change((current) => ({ ...current, photo: { ...current.photo, alt } }))}
          hint="What the photo shows, read out to anyone who can’t see it."
          error={errorAt("photo.alt")}
        />
      </Section>

      <Section
        title="Author portrait"
        description="The round photo beside your name on every article: in the byline at the top and in the author card at the end. It is cropped to a circle with your face in the upper half, so a square head-and-shoulders photo works best."
      >
        <ImageField
          label="Portrait"
          src={state.portrait.src}
          folder="profile"
          onChange={(image) => change((current) => ({ ...current, portrait: { src: image.src } }))}
          error={errorAt("portrait.src")}
        />
        {state.portrait.src && <PortraitPreview src={state.portrait.src} />}
      </Section>

      <Section
        title="Resume"
        description={
          <>
            Visitors download it from <code>{RESUME_PATH}</code>. That address never changes, so links you’ve already
            sent keep working and get the new file.
          </>
        }
        action={
          <a href={RESUME_PATH} target="_blank" rel="noreferrer" className={BUTTON}>
            View live ↗
          </a>
        }
      >
        <ResumeField
          value={state.resume}
          live={state.resume !== null && state.resume.path === livePath}
          onChange={(resume) => change((current) => ({ ...current, resume }))}
          error={errorAt("resume") ?? errorAt("resume.path")}
        />
      </Section>

      <SaveBar saving={saving} onSave={saveNow} note={dirty ? "Unsaved changes" : "Saved · live"} label="Save and publish" />
    </div>
  )
}

/** The portrait cropped the way the articles crop it, on their dark page and on the guides' light one. */
function PortraitPreview({ src }: { src: string }) {
  // Matches components/insights/author.tsx, so what you see here is what goes live
  const crop = "size-16 shrink-0 rounded-full object-cover object-[50%_28%] ring-4"
  return (
    <Field label="How it looks">
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center rounded-md bg-[#07111c] p-4">
          {/* A plain img, like the field above: any address previews before it is saved */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" className={`${crop} ring-white/15`} />
        </div>
        <div className="flex items-center rounded-md border border-neutral-200 bg-[#F7F8FC] p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" className={`${crop} ring-white`} />
        </div>
      </div>
    </Field>
  )
}

/**
 * Only the anonymous half of Supabase is needed here: the signed upload URL
 * from the server is the permission, and it holds for one path only.
 */
function storageBucket() {
  const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
  return client.storage.from(DOCUMENTS_BUCKET)
}

async function uploadResume(file: File): Promise<Resume> {
  if (file.type !== "application/pdf") throw new Error("That isn’t a PDF. Export the resume as a PDF and try again.")
  if (file.size > MAX_DOCUMENT_BYTES) throw new Error("That PDF is over 10 MB. Export a smaller one and try again.")

  const { path, token } = await signResumeUpload()
  const { error } = await storageBucket().uploadToSignedUrl(path, token, file, {
    contentType: "application/pdf",
    // Every upload gets a new name, so a copy can be kept as long as anyone likes
    cacheControl: "31536000",
  })
  if (error) throw new Error(`Upload failed: ${error.message}`)

  return { path, size: file.size, uploadedAt: new Date().toISOString() }
}

function formatSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

/** In the site's own time zone, so the server and the browser print the same date. */
function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TIME_ZONE,
  })
}

function ResumeField({
  value,
  live,
  onChange,
  error,
}: {
  value: Resume | null
  /** Whether this is the file the site is serving now. */
  live: boolean
  onChange: (resume: Resume) => void
  error?: string
}) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string>()

  async function upload(file: File) {
    setUploading(true)
    setUploadError(undefined)
    try {
      onChange(await uploadResume(file))
    } catch (failure) {
      setUploadError(failure instanceof Error ? failure.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <Field label="Current file" error={uploadError ?? error}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {value ? (
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-10 shrink-0 items-center justify-center rounded border border-neutral-300 bg-neutral-50 text-[0.65rem] font-semibold text-neutral-500">
              PDF
            </span>
            <div className="text-sm">
              <a href={documentUrl(value.path)} target="_blank" rel="noreferrer" className="text-neutral-900 underline underline-offset-2">
                Open this file ↗
              </a>
              <p className="text-neutral-500">
                Uploaded {formatDate(value.uploadedAt)} · {formatSize(value.size)}
              </p>
              {!live && <p className="font-medium text-amber-700">New - press Save and publish to put it live.</p>}
            </div>
          </div>
        ) : (
          <p className="text-sm text-neutral-500">No resume uploaded yet.</p>
        )}

        <label className={`${BUTTON} cursor-pointer self-start sm:self-center ${uploading ? "pointer-events-none opacity-50" : ""}`}>
          {uploading ? "Uploading…" : value ? "Upload new PDF" : "Upload PDF"}
          <input
            type="file"
            accept="application/pdf"
            className="sr-only"
            disabled={uploading}
            onChange={(event) => {
              const file = event.target.files?.[0]
              event.target.value = ""
              if (file) upload(file)
            }}
          />
        </label>
      </div>
    </Field>
  )
}
