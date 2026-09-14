import { FaFileAlt, FaDownload } from "react-icons/fa";
import EntityCard from "@/components/UI/EntityCard";
import { getFileUrl } from "@/lib/files";

export default function CertificatesSection({ certificates = [] }) {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-16">
      <span className="inline-block text-xs font-semibold tracking-[0.18em] uppercase text-[var(--primary)] mb-3">
        Recognition
      </span>
      <h2 className="font-display text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-10">
        Certificates
      </h2>

      {certificates.length === 0 ? (
        <div className="text-center py-12 rounded-[var(--radius-xl-value)] border border-dashed border-[var(--border)]">
          <FaFileAlt className="text-3xl text-[var(--text-disabled)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)]">
            No certificates issued yet.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certificates.map((cert) => (
            <EntityCard
              key={cert._id}
              tag={cert.type}
              title={cert.title}
              description={cert.description}
              meta={[
                {
                  text: new Date(cert.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }),
                },
              ]}
              footer={
                <a
                  href={getFileUrl(cert.fileUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 text-sm font-medium bg-[var(--primary-light)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--text-white)] py-2.5 rounded-full transition-colors"
                >
                  <FaDownload className="text-xs" />
                  Download
                </a>
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}