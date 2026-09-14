import React from 'react'
import { MdWorkspacePremium, MdOpenInNew } from 'react-icons/md'
import { formatDate } from '@/lib/Format'

export default function CertificatesGrid({ certificates = [], baseUrl = '' }) {
  return (
    <div className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b border-[var(--border)] pb-4">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Certificates</h3>
        <span className="text-sm text-muted-foreground">
          {certificates.length} certificate{certificates.length === 1 ? '' : 's'}
        </span>
      </div>

      {certificates.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-1 py-10 text-center text-sm text-muted-foreground">
          <p className="font-medium text-[var(--text-primary)]">No certificates yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {certificates.map((cert) => {
            const fileHref = cert.fileUrl
              ? cert.fileUrl.startsWith('http')
                ? cert.fileUrl
                : `${baseUrl}${cert.fileUrl}`
              : null

            return (
              <div
                key={cert._id}
                className="flex items-center gap-3 rounded-xl border border-[var(--border)] p-3.5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
                  <MdWorkspacePremium className="text-xl" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium text-[var(--text-primary)]">
                    {cert.title ?? 'Certificate'}
                  </span>
                  {cert.issuedAt && (
                    <span className="text-xs text-muted-foreground">Issued {formatDate(cert.issuedAt)}</span>
                  )}
                </div>
                {fileHref && (
                  <a
                    href={fileHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-full p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--primary)]"
                    aria-label="Open certificate"
                  >
                    <MdOpenInNew className="text-base" />
                  </a>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}